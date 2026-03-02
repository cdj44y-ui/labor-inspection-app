import { Link } from 'react-router-dom'
import { useState } from 'react'

const FEATURES = [
  { title: '5분 만에 자가진단', desc: '간단한 체크리스트로 노동법 준수 여부를 빠르게 점검할 수 있습니다.' },
  { title: '항목별 위험도 분석', desc: '7개 카테고리별로 위험도를 파악하고 개선이 필요한 항목을 확인하세요.' },
  { title: '맞춤형 개선 가이드', desc: '진단 결과에 따른 구체적인 개선 방법과 관련 법령을 안내합니다.' },
]

const STEPS = ['기본정보 입력', '진단 문항 응답', '결과 확인', '개선 가이드 활용']

const FAQ_ITEMS = [
  { q: '진단에 얼마나 걸리나요?', a: '약 5~10분 정도 소요됩니다. 53개 문항에 답하시면 됩니다.' },
  { q: '무료인가요?', a: '네. 무료로 자가진단을 이용하실 수 있습니다.' },
  { q: '진단 결과는 저장되나요?', a: '현재 버전에서는 브라우저에 임시 저장됩니다. 로그인 후 히스토리는 추후 제공 예정입니다.' },
  { q: '어떤 사업장이 이용할 수 있나요?', a: '중소기업, 개인사업자, 스타트업 등 상시 근로자가 있는 사업장이면 이용 가능합니다.' },
]

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#e0f2fe_0,_#f9fafb_45%,_#f9fafb_100%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-10 pt-6 md:px-8 md:pt-8">
        {/* Top bar */}
        <header className="flex items-center justify-between rounded-full border border-slate-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur md:px-6">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-secondary via-sky-500 to-emerald-400 shadow-md shadow-secondary/30" />
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Labor Risk Studio
              </span>
              <span className="text-sm font-semibold text-slate-900">
                근로감독 자가진단
              </span>
            </div>
          </div>
          <div className="hidden items-center gap-3 text-xs md:flex">
            <span className="rounded-full bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-500 border border-slate-200">
              Closed Beta · 리스크 진단 파트너
            </span>
            <Link
              to="/info"
              className="rounded-full bg-primary text-[11px] font-semibold tracking-wide text-white shadow-sm transition hover:bg-primary-hover"
            >
              <span className="px-4 py-1.5 inline-block">무료 진단 시작</span>
            </Link>
          </div>
        </header>

        <main className="mt-10 flex flex-1 flex-col gap-16 md:mt-16">
          <section className="mx-auto grid w-full max-w-5xl gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-medium text-slate-600 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                근로감독 전, 리스크 먼저 확인하세요
              </div>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
                근로감독
                <span className="block bg-gradient-to-r from-sky-500 via-secondary to-emerald-400 bg-clip-text text-transparent">
                  리스크 진단 셀프 스튜디오
                </span>
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 md:text-base">
                53개 핵심 체크리스트로 사업장의 노동법 준수 상태를 한눈에 정리합니다.
                근로감독 전,
                <span className="font-medium text-slate-900"> 리스크 포인트</span>를 미리 발견하고
                <span className="font-medium text-slate-900"> 우선순위 액션 플랜</span>을 세워보세요.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/info"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300/60 transition hover:bg-primary-hover"
                >
                  무료 진단 시작하기
                  <span className="text-xs text-slate-200">약 5~10분 소요</span>
                </Link>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-[11px] text-slate-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                  자가진단 · 저장은 로컬 브라우저 기준
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute -inset-8 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),transparent_60%)]" />
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200/80 backdrop-blur">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    리스크 스냅샷
                  </span>
                  <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[10px] border border-slate-200">
                    Demo View
                  </span>
                </div>
                <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span className="font-medium text-slate-800">종합 리스크 레벨</span>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-600">
                      양호 · B 등급
                    </span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-200">
                    <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-emerald-400 via-yellow-300 to-orange-400 shadow-sm" />
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2 text-[11px] text-slate-600">
                    {['근로시간', '임금·수당', '휴가·휴일'].map((label, i) => (
                      <div
                        key={label}
                        className="rounded-xl border border-slate-100 bg-white px-3 py-2"
                      >
                        <p className="text-[10px] text-slate-500">{label}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {i === 0 ? '78점' : i === 1 ? '91점' : '84점'}
                        </p>
                        <p className="mt-0.5 text-[10px] text-emerald-600">
                          {i === 1 ? '우수' : '개선 필요'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
                  실제 진단에서는 귀 사업장의 답변 데이터를 기반으로 카테고리별 점수와
                  개선이 필요한 항목을 자동으로 정리해 드립니다.
                </p>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="mx-auto w-full max-w-5xl">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                Why This Studio
              </p>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
                근로감독 리스크를
                <span className="bg-gradient-to-r from-sky-500 via-secondary to-emerald-400 bg-clip-text text-transparent">
                  {' '}
                  한 장의 리포트로
                </span>
              </h2>
              <p className="max-w-2xl text-xs leading-relaxed text-slate-600 md:text-sm">
                복잡한 법령 조항 대신, 직관적인 점수와 우선순위 기반 액션 포인트로 정리해 드립니다.
                내부 인사·노무 담당자가 바로 실행할 수 있는 수준의 디테일을 목표로 설계되었습니다.
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(148,163,184,0.35)] backdrop-blur transition hover:border-secondary/60 hover:shadow-[0_22px_70px_rgba(129,140,248,0.35)]"
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                    <div className="absolute inset-x-0 -top-16 h-32 bg-gradient-to-b from-secondary/25 via-transparent to-transparent blur-2xl" />
                  </div>
                  <div className="relative">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-secondary to-sky-400 text-lg shadow-md shadow-secondary/30 text-white">
                      {(i === 0 && '⏱') || (i === 1 && '📊') || '📋'}
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-slate-900 md:text-base">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 md:text-sm">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Process */}
          <section className="mx-auto w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_80px_rgba(148,163,184,0.35)] backdrop-blur md:p-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                Flow
              </p>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
                4단계로 끝내는 근로감독 대비 플로우
              </h2>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4 md:gap-6">
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-700 md:px-5 md:py-2.5 md:text-sm"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-secondary via-sky-400 to-emerald-300 text-xs font-semibold text-slate-950 shadow-md shadow-secondary/40 md:h-9 md:w-9">
                    {i + 1}
                  </span>
                  <span className="whitespace-nowrap">{step}</span>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mx-auto w-full max-w-3xl">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                FAQ
              </p>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
                자주 묻는 질문
              </h2>
            </div>
            <div className="mt-6 space-y-2">
              {FAQ_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-[0_16px_60px_rgba(148,163,184,0.35)] backdrop-blur md:px-5 md:py-4"
                >
                  <button
                    className="flex w-full items-center justify-between gap-4 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-medium">{item.q}</span>
                    <span className="text-xs text-slate-500">
                      {openFaq === i ? '접기' : '펼치기'}
                    </span>
                  </button>
                  {openFaq === i && (
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 md:text-sm">
                      {item.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="mx-auto w-full max-w-3xl rounded-3xl border border-secondary/40 bg-gradient-to-r from-sky-100 via-indigo-100 to-emerald-100 px-6 py-8 text-center text-slate-950 shadow-[0_20px_80px_rgba(129,140,248,0.35)] backdrop-blur md:px-8 md:py-10">
            <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
              지금 사업장의 근로감독 리스크를
              <span className="block text-slate-800">숫자와 문장으로 정리해 보세요.</span>
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-slate-800/80 md:text-sm">
              진단 결과는 브라우저에만 임시 저장되며, 입력하신 정보는 서버로 전송되지 않습니다.
              안심하고 사업장 현황을 점검해 보세요.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/info"
                className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300/60 transition hover:bg-primary-hover"
              >
                무료 진단 시작하기
              </Link>
              <Link
                to="/diagnosis"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                이미 진단 중이에요
              </Link>
            </div>
          </section>
        </main>

        <footer className="mt-10 border-t border-slate-200 pt-6 text-center text-[11px] text-slate-500">
          근로감독 자가진단 서비스 · 참고용 자가점검 도구입니다.
        </footer>
      </div>
    </div>
  )
}
