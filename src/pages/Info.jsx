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
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-secondary rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-sm text-gray-500 mt-1">1/4 · 기본정보 입력</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h1 className="text-xl font-bold text-primary mb-6">사업장 기본 정보</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">사업장명 *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="사업장명을 입력하세요"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">업종 *</label>
              <select
                value={form.industry}
                onChange={(e) => setForm((p) => ({ ...p, industry: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-secondary"
              >
                <option value="">선택하세요</option>
                {INDUSTRIES.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">상시근로자 수 *</label>
              <input
                type="number"
                min="0"
                value={form.employeeCount}
                onChange={(e) => setForm((p) => ({ ...p, employeeCount: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-secondary"
                placeholder="0"
              />
              {errors.employeeCount && <p className="text-red-500 text-sm mt-1">{errors.employeeCount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">설립일</label>
              <input
                type="date"
                value={form.establishedDate}
                onChange={(e) => setForm((p) => ({ ...p, establishedDate: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">주요 고용형태 * (복수 선택)</label>
              <div className="flex flex-wrap gap-2">
                {EMPLOYMENT_TYPES.map((type) => (
                  <label key={type} className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.employmentTypes.includes(type)}
                      onChange={() => toggleEmployment(type)}
                      className="rounded border-gray-300 text-primary"
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
              {errors.employmentTypes && <p className="text-red-500 text-sm mt-1">{errors.employmentTypes}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">연락처(이메일)</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-secondary"
                placeholder="결과 리포트 발송용"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Link
                to="/"
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                이전
              </Link>
              <button
                type="submit"
                className="flex-1 bg-primary text-white rounded-lg px-6 py-3 hover:bg-primary-hover font-medium"
              >
                다음 (진단 시작)
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
