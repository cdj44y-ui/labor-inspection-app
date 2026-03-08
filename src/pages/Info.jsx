import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const INDUSTRIES = ['제조업', '서비스업', '건설업', 'IT', '기타']
const EMPLOYMENT_TYPES = ['정규직', '계약직', '파견직', '일용직', '아르바이트']

const STORAGE_KEY = 'labor_diagnosis_business'

export default function Info() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    industry: '',
    employeeCount: '',
    establishedDate: '',
    employmentTypes: [],
    email: '',
  })
  const [errors, setErrors] = useState({})

  const progress = 25 // 1/4 단계

  const toggleEmployment = (type) => {
    setForm((prev) => ({
      ...prev,
      employmentTypes: prev.employmentTypes.includes(type)
        ? prev.employmentTypes.filter((t) => t !== type)
        : [...prev.employmentTypes, type],
    }))
  }

  const validate = () => {
    const e = {}
    if (!form.name?.trim()) e.name = '사업장명을 입력하세요.'
    if (!form.industry) e.industry = '업종을 선택하세요.'
    if (!form.employeeCount || Number(form.employeeCount) < 0) e.employeeCount = '상시근로자 수를 입력하세요.'
    if (form.employmentTypes.length === 0) e.employmentTypes = '주요 고용형태를 1개 이상 선택하세요.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const payload = {
      ...form,
      employeeCount: Number(form.employeeCount) || 0,
    }
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, business: payload }))
    } catch (_) {}
    navigate('/diagnosis')
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#e0f2fe_0,_#f9fafb_45%,_#f9fafb_100%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col px-4 pb-10 pt-6 md:px-6 md:pt-8">
        {/* 헤더 */}
        <header className="mb-6 flex items-center justify-between text-xs text-slate-500 md:mb-8">
          <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-secondary via-sky-400 to-emerald-300 text-[11px] font-semibold text-slate-950 shadow-md shadow-secondary/40">
              L
            </span>
            <span className="hidden text-[11px] font-medium uppercase tracking-[0.18em] md:inline">
              Labor Risk Studio
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px]">
              1/4 · 사업장 기본 정보
            </span>
            <Link
              to="/diagnosis"
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
            >
              기본정보 없이 진단만 하기
            </Link>
          </div>
        </header>

        {/* 진행률 */}
        <div className="mb-6 md:mb-8">
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-secondary via-sky-400 to-emerald-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            1/4 단계 · 사업장의 기본 정보를 먼저 정리합니다.
          </p>
        </div>

        {/* 카드 */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_70px_rgba(148,163,184,0.35)] backdrop-blur md:p-7">
          <div className="mb-6 flex flex-col gap-2 md:mb-7">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
              사업장 기본 정보
            </h1>
            <p className="text-xs leading-relaxed text-slate-600 md:text-sm">
              근로감독 리스크를 정확하게 보기 위해 최소한의 정보만 요청합니다.
              입력하신 데이터는 브라우저 내에만 저장되며 서버로 전송되지 않습니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                사업장명 <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-secondary focus:bg-slate-50 focus:ring-2 focus:ring-secondary/30"
                placeholder="예: ㈜노바테크, ○○디자인 스튜디오"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-rose-400">{errors.name}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  업종 <span className="text-rose-400">*</span>
                </label>
                <select
                  value={form.industry}
                  onChange={(e) => setForm((p) => ({ ...p, industry: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-secondary focus:bg-slate-50 focus:ring-2 focus:ring-secondary/30"
                >
                  <option value="" className="bg-white">
                    선택하세요
                  </option>
                  {INDUSTRIES.map((opt) => (
                    <option key={opt} value={opt} className="bg-white text-slate-900">
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.industry && (
                  <p className="mt-1 text-xs text-rose-400">{errors.industry}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  상시근로자 수 <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.employeeCount}
                  onChange={(e) => setForm((p) => ({ ...p, employeeCount: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-secondary focus:bg-slate-50 focus:ring-2 focus:ring-secondary/30"
                  placeholder="예: 25"
                />
                {errors.employeeCount && (
                  <p className="mt-1 text-xs text-rose-400">{errors.employeeCount}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  설립일
                </label>
                <input
                  type="date"
                  value={form.establishedDate}
                  onChange={(e) => setForm((p) => ({ ...p, establishedDate: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-secondary focus:bg-slate-50 focus:ring-2 focus:ring-secondary/30"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  연락처(이메일)
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-secondary focus:bg-slate-50 focus:ring-2 focus:ring-secondary/30"
                  placeholder="결과 리포트 알림을 받고 싶다면 입력해 주세요"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-slate-700">
                주요 고용형태 <span className="text-rose-400">*</span>{' '}
                <span className="text-[11px] text-slate-400">(복수 선택 가능)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {EMPLOYMENT_TYPES.map((type) => {
                  const active = form.employmentTypes.includes(type)
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleEmployment(type)}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
                        active
                          ? 'border-secondary bg-secondary/10 text-primary'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-secondary/50 hover:bg-white'
                      }`}
                    >
                      <span
                        className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border text-[9px] ${
                          active
                            ? 'border-transparent bg-secondary text-white'
                            : 'border-slate-300 text-slate-400'
                        }`}
                      >
                        {active ? '✓' : ''}
                      </span>
                      <span>{type}</span>
                    </button>
                  )
                })}
              </div>
              {errors.employmentTypes && (
                <p className="mt-1 text-xs text-rose-400">{errors.employmentTypes}</p>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-4 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
              <p>
                입력한 내용은 브라우저에만 임시 저장되며, 새로고침 시에도 유지됩니다.
              </p>
              <div className="flex gap-2">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-2 text-[11px] font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  홈으로
                </Link>
                <button
                  type="submit"
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-primary px-6 py-2.5 text-[11px] font-semibold tracking-wide text-white shadow-lg shadow-slate-300/60 transition hover:bg-primary-hover md:flex-none"
                >
                  다음 단계로 · 진단 시작
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
