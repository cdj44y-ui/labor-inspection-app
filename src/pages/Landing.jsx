import { Link } from 'react-router-dom'
import { useState } from 'react'
import { getUser, clearAuth, authFetch } from '../utils/auth.js'
import { CONTACT_PHONE, RAPIDO_CONTENT_URL } from '../constants/contact.js'

const FEATURES = [
  {
    title: '노동부 자율점검표 기반',
    desc: "2025년 고용노동부 '사업장 기초노동질서 자율진단표'를 토대로 50여개 핵심 문항을 재구성했습니다.",
  },
  {
    title: '실제 근로감독·형사 사건 반영',
    desc: '런던베이글 등 SNS·보도자료에 등장한 임금체불·연장근로·연차·4대보험 이슈를 중심으로 리스크를 짚어드립니다.',
  },
  {
    title: '우선순위 액션 플랜 제시',
    desc: '위험도가 높은 영역부터 어떤 서류·규정·제도를 손보면 좋을지, 단계별 개선 방향을 제안합니다.',
  },
]

const STEPS = ['기본정보 입력', '진단 문항 응답', '결과 요약 확인', '우선 개선 영역 정리']

const FAQ_ITEMS = [
  {
    q: '이 서비스는 어떤 서비스인가요?',
    a: '고용노동부 자율점검표와 실제 근로감독·형사 사건 사례를 바탕으로, 우리 회사의 근로감독 리스크를 미리 점검해보는 자가진단 툴입니다.',
  },
  { q: '진단에 얼마나 걸리나요?', a: '약 5~10분 정도 소요됩니다. 50여개 핵심 문항에 답하시면 됩니다.' },
  {
    q: '진단 결과는 저장되나요?',
    a: '현재 버전에서는 브라우저에만 임시 저장되며, 서버 DB에는 저장되지 않습니다. 상담을 신청할 경우에만 암호화 저장 후 노무사에게 공유됩니다.',
  },
  { q: '어떤 사업장이 이용할 수 있나요?', a: '중소기업, 개인사업자, 스타트업 등 상시 근로자가 있는 사업장이면 이용 가능합니다.' },
]

const CASES = [
  {
    tag: '외식·프랜차이즈',
    title: '주 52시간 초과 + 연장수당 미지급',
    body: '유명 카페·베이커리 사업장에서 실제 근로시간(주 60시간 내외)을 기록하지 않고, 포괄임금 형태로 연장수당을 지급하지 않아 근로감독 시 시정지시와 과태료, 체불임금 지급 명령을 받은 사례가 다수 보고되었습니다.',
    loss: '연장수당·주휴수당 등 수천만 원 규모의 소급 지급 + 사회적 평판 하락',
  },
  {
    tag: '스타트업·사무직',
    title: '“자율 출퇴근제”인데 연장근로 관리 부재',
    body: 'IT·스타트업에서 자율 출퇴근제를 운영하면서도 야근·주말 근무를 사실상 강요했지만, 근로시간 기록과 연장근로 승인·수당 지급 체계를 갖추지 않아 근로감독에서 근로시간 위반으로 판단된 사례가 있습니다.',
    loss: '연장·야간·휴일근로수당 일괄 정산 + 향후 근로시간 제도 전면 재설계 부담',
  },
  {
    tag: '소규모 사업장',
    title: '알바·단시간 근로자 4대보험·연차 미부여',
    body: '소규모 매장·사무실에서 파트타이머는 단순 도우미라고 인식해 4대보험 가입과 연차휴가, 주휴수당을 지급하지 않았다가 노동부 진정 및 근로감독 과정에서 다년간의 체불이 한꺼번에 적발된 사례가 반복됩니다.',
    loss: '과거 근로자 전원에 대한 체불임금 정산 + 과태료 및 가산이자 부담',
  },
]

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null)
  const [user, setUser] = useState(() => getUser())

  const handleLogout = () => {
    authFetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    clearAuth()
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-12 pt-6 md:px-8 md:pt-8">
        {/* Top bar */}
        <header className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-2.5 shadow-card md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-ink text-[10px] font-bold text-white tracking-tight" style={{ letterSpacing: '-0.04em' }}>
              L
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                Labor Risk Studio
              </span>
              <span className="text-sm font-semibold tracking-tight text-ink">
                근로감독 자가진단
              </span>
            </div>
          </div>
          <div className="hidden items-center gap-4 text-xs md:flex">
            <nav className="flex items-center gap-4 text-slate-500">
              <Link to="/info" className="hover:text-slate-900 transition-colors">
                진단 시작
              </Link>
              <Link to="/diagnosis" className="hover:text-slate-900 transition-colors">
                문항 보기
              </Link>
              <Link to="/result" className="hover:text-slate-900 transition-colors">
                결과 보기
              </Link>
            </nav>
            <span className="rounded-full bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-500 border border-slate-200">
              Closed Beta · 리스크 진단 파트너
            </span>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-600 truncate max-w-[120px]" title={user.email}>
                  {user.email}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100 transition"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-slate-900 transition-colors text-[11px] font-medium">
                  로그인
                </Link>
                <Link to="/signup" className="text-slate-600 hover:text-slate-900 transition-colors text-[11px] font-medium">
                  회원가입
                </Link>
                <Link
                  to="/diagnosis"
                  className="rounded-full bg-ink px-4 py-1.5 text-[11px] font-semibold tracking-tight text-white transition hover:bg-primary-hover"
                >
                  바로 진단하기
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Privacy banner */}
        <div className="mt-4 rounded-2xl border border-slate-100 bg-white px-4 py-3 text-[11px] text-slate-700 shadow-card md:px-5 md:py-3.5">
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-slate-100 text-[10px] text-slate-600">
                🔒
              </span>
              <p className="font-medium text-ink">
                입력하신 진단 데이터는 현재 버전에서 서버 DB에 저장되지 않는 휘발성 자가진단입니다.
              </p>
            </div>
            <p className="mt-1 text-[10px] text-slate-500 md:mt-0">
              브라우저에서만 보관되며, 로그인 없이도 결과를 확인할 수 있고, 별도 동의 없이는 제3자(노무사 등)에게 공유되지 않습니다.
            </p>
          </div>
        </div>

        <main className="mt-12 flex flex-1 flex-col gap-20 md:mt-16">
          <section className="mx-auto grid w-full max-w-5xl gap-12 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-center">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">
                고용노동부 자율점검표 기반 · 실제 근로감독 사례 반영
              </p>
              <h1 className="mt-4 text-display font-bold tracking-tight text-ink md:text-display-md lg:text-display-lg">
                근로감독 전에,
                <br />
                우리 회사 리스크부터 확인하세요
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">
                노동부 자율점검표를 바탕으로 <span className="font-medium text-ink">50여개 핵심 문항</span>을 정리했습니다.
                임금체불·연장근로·휴게시간·연차휴가·근로계약·4대보험·산재 이슈를 한 번에 점검하고,
                <span className="font-medium text-ink"> 근로감독·형사 사건으로 번지기 전</span>에 리스크를 줄여보세요.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  to="/diagnosis"
                  className="inline-flex items-center justify-center rounded-full bg-ink px-8 py-3.5 text-sm font-semibold tracking-tight text-white transition hover:bg-primary-hover"
                >
                  바로 진단하기 (기본정보 없이)
                </Link>
                <Link
                  to="/info"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-medium text-ink transition hover:border-slate-300 hover:bg-slate-50"
                >
                  사업장 정보 입력 후 진단
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 text-[11px] text-slate-500">
                <span className="rounded-full border border-slate-100 bg-white px-3 py-1.5">50여개 핵심 문항</span>
                <span className="rounded-full border border-slate-100 bg-white px-3 py-1.5">7개 카테고리별 리스크</span>
                <span className="rounded-full border border-slate-100 bg-white px-3 py-1.5">종합 리포트 자동 생성</span>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card">
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                리스크 스냅샷
              </p>
              <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span className="font-medium text-ink">종합 리스크 레벨</span>
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                    양호 · B 등급
                  </span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-200">
                  <div className="h-full w-3/4 rounded-full bg-ink" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-slate-600">
                  {['근로시간', '임금·수당', '휴가·휴일'].map((label, i) => (
                    <div key={label} className="rounded-xl border border-slate-100 bg-white px-3 py-2">
                      <p className="text-[10px] text-slate-500">{label}</p>
                      <p className="mt-1 text-sm font-semibold tracking-tight text-ink">
                        {i === 0 ? '78점' : i === 1 ? '91점' : '84점'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-[10px] leading-relaxed text-slate-500">
                실제 진단에서는 귀 사업장의 답변 데이터를 기반으로 카테고리별 점수와 개선 항목을 정리해 드립니다.
              </p>
            </div>
          </section>

          {/* Features */}
          <section id="features" className="mx-auto w-full max-w-5xl">
            <p className="text-center text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">
              Why This Studio
            </p>
            <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-ink md:text-3xl">
              근로감독 리스크를 한 장의 리포트로
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-slate-600">
              복잡한 법령 대신, 점수와 우선순위 기반 액션 포인트로 정리합니다.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card transition hover:shadow-card-hover"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-ink text-sm font-semibold">
                    {i + 1}
                  </div>
                  <h3 className="mt-4 text-base font-semibold tracking-tight text-ink">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Process */}
          <section
            id="flow"
            className="mx-auto w-full max-w-4xl rounded-3xl border border-slate-100 bg-white p-8 shadow-card md:p-10"
          >
            <p className="text-center text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">
              Flow
            </p>
            <h2 className="mt-2 text-center text-xl font-bold tracking-tight text-ink md:text-2xl">
              4단계로 끝내는 근로감독 대비
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:gap-4">
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 rounded-full border border-slate-100 bg-paper px-4 py-2.5 text-sm font-medium text-ink"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-[10px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="whitespace-nowrap">{step}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Real cases */}
          <section className="mx-auto w-full max-w-5xl">
            <p className="text-center text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">
              Real Inspection Signals
            </p>
            <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-ink md:text-3xl">
              실제 근로감독 사례로 보는 리스크 경고등
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-slate-600">
              노동부 보도자료와 언론에 자주 등장하는 유형을 바탕으로 재구성한 예시입니다.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {CASES.map((c, i) => (
                <article
                  key={c.title}
                  className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-card"
                >
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                    {c.tag}
                  </p>
                  <h3 className="mt-3 text-base font-semibold tracking-tight text-ink">
                    {c.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {c.body}
                  </p>
                  <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2.5 text-[11px] text-slate-700">
                    <span className="font-semibold text-ink">적발 시 손실 가능성 · </span>
                    {c.loss}
                  </div>
                  {i === 0 && (
                    <p className="mt-3 text-[10px] text-slate-400">
                      * 유명 카페·베이커리, 런던베이글 등 언론 보도 사례를 일반화한 유형입니다.
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>

          {/* 조대진 노무사 소개 + 비대면 상담 */}
          <section
            id="consult"
            className="mx-auto w-full max-w-5xl rounded-3xl border border-slate-100 bg-white p-6 shadow-card md:p-8"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ink text-sm font-bold text-white md:h-16 md:w-16">
                  JD
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
                    Labor Risk Partner
                  </p>
                  <h2 className="text-base font-semibold tracking-tight text-slate-900 md:text-lg">
                    노무법인 위너스 조대진 노무사 1:1 리스크 코칭
                  </h2>
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    근로감독 리스크를 실제로 줄이고 싶다면, HR·산업안전·컨설팅 실무를 두루 경험한 조대진 노무사에게
                    맞춤 코칭을 받아보세요.
                  </p>
                  <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                      유선 연락처
                    </span>
                    <a
                      href={`tel:${CONTACT_PHONE}`}
                      className="text-sm font-semibold tracking-tight text-slate-900 transition hover:text-primary md:text-base"
                    >
                      {CONTACT_PHONE}
                    </a>
                  </div>
                  <ul className="flex flex-wrap gap-1.5 text-[10px] text-slate-700">
                    <li className="rounded-full bg-slate-100 px-2.5 py-1">
                      현대카드 · 삼성서울병원 HR팀 출신
                    </li>
                    <li className="rounded-full bg-slate-100 px-2.5 py-1">
                      컨설팅 회사 근무 · 산업안전공학 박사 과정
                    </li>
                    <li className="rounded-full bg-slate-100 px-2.5 py-1">
                      삼성전자 · SK가스 · 두산그룹 등 다수 기업 강의
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col gap-2 md:shrink-0 md:basis-44">
                <a
                  href={RAPIDO_CONTENT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold tracking-tight text-white transition hover:bg-primary-hover"
                >
                  비대면 상담
                </a>
                <p className="text-center text-[10px] leading-relaxed text-slate-500">
                  래피드에서 비대면 상담을 신청할 수 있습니다.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="mx-auto w-full max-w-3xl">
            <p className="text-center text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">
              FAQ
            </p>
            <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-ink">
              자주 묻는 질문
            </h2>
            <div className="mt-8 space-y-2">
              {FAQ_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-card"
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
          <section className="mx-auto w-full max-w-3xl rounded-3xl border border-slate-100 bg-white px-8 py-10 text-center shadow-card md:px-10 md:py-12">
            <h3 className="text-xl font-bold tracking-tight text-ink md:text-2xl">
              지금 사업장의 근로감독 리스크를
              <span className="block mt-1">숫자와 문장으로 정리해 보세요.</span>
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              진단 결과는 브라우저에만 임시 저장됩니다. 2025년 고용노동부 자율진단표 7개 영역 기준으로 리스크를 정리해 드립니다.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/diagnosis"
                className="inline-flex items-center justify-center rounded-full bg-ink px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
              >
                바로 진단하기 (기본정보 없이)
              </Link>
              <Link
                to="/info"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-medium text-ink transition hover:bg-slate-50"
              >
                사업장 정보 입력 후 진단
              </Link>
              <Link
                to="/diagnosis"
                className="inline-flex items-center justify-center rounded-full border border-slate-100 bg-paper px-5 py-3.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              >
                이미 진단 중이에요
              </Link>
            </div>
          </section>
        </main>

        <footer className="mt-12 border-t border-slate-100 pt-8 text-center text-[11px] text-slate-500 space-y-1">
          <p>근로감독 자가진단 서비스 · 참고용 자가점검 도구입니다.</p>
          <p className="max-w-3xl mx-auto text-[10px] text-slate-400">
            본 서비스는 노동관계 법령과 공개 자료를 바탕으로 한 일반적인 리스크 점검 도구이며, 개별 사건에 대한
            법률 자문이나 행정해석을 대체하지 않습니다. 최종적인 법적 책임과 판단은 사용자 및 관계 기관(법원·노동부
            등)에 있으며, 서비스 제공자는 본 진단 결과만을 근거로 한 의사결정에 대해 법적 책임을 지지 않습니다.
          </p>
        </footer>
      </div>
    </div>
  )
}
