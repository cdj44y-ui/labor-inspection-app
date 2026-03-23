import { Link } from 'react-router-dom'
import { useState } from 'react'
import { getUser, clearAuth, authFetch } from '../utils/auth.js'
import {
  CALENDLY_URL,
  CONTACT_PHONE,
  CONSULT_BUTTON_CLASS,
  DIAGNOSIS_CTA_CLASS,
  NOTION_REMOTE_CONSULT_URL,
} from '../constants/contact.js'
import SiteHeader from '../components/common/SiteHeader.jsx'
import SiteFooter from '../components/common/SiteFooter.jsx'

const FEATURES = [
  {
    title: '노동부 자율점검표 기반',
    desc: "2025년 고용노동부 '사업장 기초노동질서 자율진단표'를 토대로 50여개 핵심 문항을 재구성했습니다.",
  },
  {
    title: '실제 근로감독·형사 사건 반영',
    desc: '유명 제과·외식 프랜차이즈 등 언론·보도자료에 등장한 임금체불·연장근로·연차·4대보험 이슈를 중심으로 리스크를 짚어드립니다.',
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
        <SiteHeader />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50 px-3 py-2 md:px-4">
          <nav className="flex flex-wrap items-center gap-4 text-[13px] text-ink">
            <Link to="/info" className="font-medium text-zinc-800 transition hover:text-ink">
              진단 시작
            </Link>
            <Link to="/diagnosis" className="font-medium text-zinc-800 transition hover:text-ink">
              문항 보기
            </Link>
            <Link to="/result" className="font-medium text-zinc-800 transition hover:text-ink">
              결과 보기
            </Link>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-zinc-300 bg-white px-2.5 py-1 text-[10px] font-medium text-zinc-600">
              Closed Beta
            </span>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="max-w-[140px] truncate text-[11px] text-zinc-700" title={user.email}>
                  {user.email}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-[11px] font-medium text-zinc-700 transition hover:bg-zinc-100"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-[13px] font-medium text-zinc-700 transition hover:text-ink">
                  로그인
                </Link>
                <Link to="/signup" className="text-[13px] font-medium text-zinc-700 transition hover:text-ink">
                  회원가입
                </Link>
                <Link
                  to="/diagnosis"
                  className={`rounded-full px-4 py-2 text-[11px] font-bold ${DIAGNOSIS_CTA_CLASS}`}
                >
                  무료로 우리 회사 리스크 확인하기
                </Link>
              </>
            )}
          </div>
        </div>

        {/* 상단 안내 — 첨부 레이아웃: 좌(주황 아이콘+강조) / 우(보조 문구) */}
        <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-stretch md:gap-3">
          <div className="hx-banner-bar flex flex-1 items-center gap-3 rounded-lg px-4 py-3 md:px-5 md:py-3.5">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-[#ea580c] shadow-sm"
              aria-hidden
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
              </svg>
            </span>
            <p className="text-[13px] font-semibold leading-snug text-ink md:text-[14px] md:leading-relaxed">
              입력하신 진단 데이터는 서버 DB에 저장되지 않는 휘발성 자가진단입니다.
            </p>
          </div>
          <div className="hx-banner-bar flex items-center rounded-lg px-4 py-3 md:max-w-md md:px-5 md:py-3.5">
            <p className="text-[12px] leading-relaxed text-zinc-800 md:text-[13px]">
              브라우저에서만 보관되며, 별도 동의 없이는 제3자에게 공유되지 않습니다.
            </p>
          </div>
        </div>

        <main className="mt-10 flex flex-1 flex-col gap-20 md:mt-14">
          <section className="mx-auto grid w-full max-w-5xl gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-stretch md:gap-10">
            <div className="rounded-xl border border-zinc-300/90 bg-white p-8 shadow-card md:p-10 md:pt-11">
              <p className="text-[13px] font-medium leading-snug text-ink md:text-sm">
                고용노동부 자율점검표 기반 실제 근로감독 사례 반영
              </p>
              <h1 className="mt-5 text-display-xl font-extrabold tracking-tight text-ink md:text-display-2xl lg:text-display-3xl">
                근로감독 전에,
                <br />
                우리 회사 리스크부터 확인하세요
              </h1>
              <p className="mt-8 max-w-xl text-[15px] font-normal leading-[1.75] text-zinc-800 md:text-base md:leading-[1.78]">
                노동부 자율점검표를 바탕으로 <span className="font-bold text-ink">50여개</span> 핵심 문항을 정리했습니다.
                임금체불·연장근로·휴게시간·연차·4대보험·산재 이슈를 한 번에 점검하고,{' '}
                <span className="font-bold text-ink">근로감독·형사 사건으로 번지기 전</span>에 리스크를 줄여보세요.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  to="/diagnosis"
                  className={`inline-flex min-h-[48px] items-center justify-center rounded-full px-9 py-3.5 text-[15px] font-bold ${DIAGNOSIS_CTA_CLASS}`}
                >
                  무료로 우리 회사 리스크 확인하기
                </Link>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-ink bg-white px-7 py-3.5 text-[15px] font-bold text-ink transition hover:bg-zinc-50`}
                >
                  전문가와 15분 무료 상담
                </a>
                <Link
                  to="/info"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-ink bg-white px-7 py-3.5 text-[15px] font-semibold text-ink transition hover:bg-zinc-50"
                >
                  사업장 정보 입력 후 진단
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {['50여개 핵심 문항', '7개 카테고리', '종합 리포트'].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-ink/85 bg-white px-3.5 py-2 text-[12px] font-medium text-ink"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col rounded-xl border border-zinc-300/90 bg-white p-6 shadow-card md:p-8">
              <p className="text-[15px] font-semibold tracking-tight text-ink">리스크 스냅샷</p>
              <div className="mt-5 flex flex-1 flex-col rounded-lg border border-zinc-300/80 bg-white p-5">
                <p className="text-[13px] font-medium text-ink">종합 리스크 레벨</p>
                <div className="mt-4 flex items-center gap-0 overflow-hidden rounded-full border border-zinc-300 bg-zinc-100">
                  <div
                    className="flex h-10 min-w-0 flex-1 items-center justify-end bg-toss pr-0"
                    style={{ flexBasis: '72%', maxWidth: '72%' }}
                  >
                    <span className="inline-flex shrink-0 items-center rounded-full bg-[#0a0a0a] px-3 py-1.5 text-[11px] font-bold text-white md:text-xs">
                      양호 B등급
                    </span>
                  </div>
                  <div className="h-10 min-w-[28%] flex-1 bg-zinc-100" aria-hidden />
                </div>
                <div className="mt-6 grid grid-cols-3 gap-2.5">
                    {[
                      { label: '근로시간', score: '78' },
                      { label: '임금·수당', score: '91' },
                      { label: '휴가·휴일', score: '84' },
                    ].map(({ label, score }) => (
                    <div
                      key={label}
                      className="rounded-lg border border-ink/80 bg-white px-3 py-3 text-center md:px-3.5"
                    >
                      <p className="text-[11px] font-medium text-zinc-600">{label}</p>
                      <p className="mt-1.5 text-lg font-bold tracking-tight text-toss md:text-xl">
                        {score}
                        <span className="ml-0.5 text-[13px] text-ink">점</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-5 text-[12px] leading-relaxed text-zinc-700 md:text-[13px]">
                귀 사업장 답변 기반으로 카테고리별 점수와 개선 항목을 정리해 드립니다.
              </p>
            </div>
          </section>

          {/* Features — 2번 카드 토스 블루 강조 */}
          <section id="features" className="mx-auto w-full max-w-5xl">
            <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Why This Studio
            </p>
            <h2 className="mt-2 text-center text-2xl font-extrabold tracking-tight text-ink md:text-3xl">
              근로감독 리스크를 한 장의 리포트로
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-[15px] leading-relaxed text-zinc-800 md:text-base md:leading-[1.7]">
              복잡한 법령 대신, 점수와 우선순위 기반 액션 포인트로 정리합니다.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  className={`rounded-xl border p-6 shadow-card transition ${
                    i === 1 ? 'border-ink bg-zinc-50' : 'border-zinc-300/90 bg-white'
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold ${
                      i === 1 ? 'bg-ink text-white' : 'bg-zinc-200 text-ink'
                    }`}
                  >
                    {i + 1}
                  </div>
                  <h3 className="mt-4 text-base font-bold tracking-tight text-ink">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.7] text-zinc-800">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Process — 플로우 숫자 토스 블루 */}
          <section
            id="flow"
            className="mx-auto w-full max-w-4xl rounded-xl border border-zinc-300/90 bg-white p-8 shadow-card md:p-10"
          >
            <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Flow
            </p>
            <h2 className="mt-2 text-center text-xl font-bold tracking-tight text-ink md:text-2xl">
              4단계로 끝내는 근로감독 대비
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:gap-4">
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 rounded-full border-2 border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-medium text-ink"
                >
                  <span className="step-num-circle flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold">
                    {i + 1}
                  </span>
                  <span className="whitespace-nowrap">{step}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Real cases — 좌측 보더 토스 블루 강조 */}
          <section className="mx-auto w-full max-w-5xl">
            <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Real Inspection Signals
            </p>
            <h2 className="mt-2 text-center text-2xl font-extrabold tracking-tight text-ink md:text-3xl">
              실제 근로감독 사례로 보는 리스크 경고등
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-[15px] leading-relaxed text-zinc-800 md:text-base md:leading-[1.7]">
              노동부 보도자료와 언론에 자주 등장하는 유형을 바탕으로 재구성한 예시입니다.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {CASES.map((c, i) => (
                <article
                  key={c.title}
                  className="flex h-full flex-col rounded-xl border border-zinc-300/90 border-l-4 border-l-ink bg-white p-6 shadow-card"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                    {c.tag}
                  </p>
                  <h3 className="mt-3 text-base font-bold tracking-tight text-ink">
                    {c.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[14px] leading-[1.7] text-zinc-800">
                    {c.body}
                  </p>
                  <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-[11px] text-zinc-800">
                    <span className="font-bold text-ink">적발 시 손실 가능성 · </span>
                    {c.loss}
                  </div>
                  {i === 0 && (
                    <p className="mt-3 text-[10px] text-zinc-600">
                      * 특정 업체를 지칭하지 않으며, 언론 보도 사례를 일반화한 유형입니다.
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>

          {/* 조대진 노무사 — 밝은 배경 + 검정 글씨 */}
          <section
            id="consult"
            className="mx-auto w-full max-w-5xl rounded-xl border border-zinc-300/90 bg-white p-6 shadow-card md:p-8"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-ink bg-white text-sm font-bold text-ink md:h-16 md:w-16">
                  JD
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                    Labor Risk Partner
                  </p>
                  <h2 className="text-base font-bold tracking-tight text-ink md:text-lg">
                    노무법인 위너스 조대진 노무사 1:1 리스크 코칭
                  </h2>
                  <p className="text-[11px] leading-relaxed text-zinc-800">
                    근로감독 리스크를 실제로 줄이고 싶다면, HR·산업안전·컨설팅 실무를 두루 경험한 조대진 노무사에게
                    맞춤 코칭을 받아보세요.
                  </p>
                  <div className="inline-flex items-center gap-2 rounded-xl border-2 border-zinc-200 bg-zinc-50 px-3 py-2">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                      유선 연락처
                    </span>
                    <a
                      href={`tel:${CONTACT_PHONE}`}
                      className="text-sm font-bold tracking-tight text-ink underline decoration-zinc-400 underline-offset-2 transition hover:decoration-ink md:text-base"
                    >
                      {CONTACT_PHONE}
                    </a>
                  </div>
                  <ul className="flex flex-wrap gap-1.5 text-[10px] text-zinc-700">
                    <li className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1">
                      현대카드 · 삼성서울병원 HR팀 출신
                    </li>
                    <li className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1">
                      산업안전공학 박사
                    </li>
                    <li className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1">
                      삼성전자 · SK가스 · 두산그룹 등 다수 기업 강의
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col gap-2 md:shrink-0 md:basis-44">
                <a
                  href={NOTION_REMOTE_CONSULT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={CONSULT_BUTTON_CLASS + ' no-underline visited:text-white text-center'}
                >
                  비대면 상담
                </a>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="mx-auto w-full max-w-3xl">
            <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              FAQ
            </p>
            <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-ink">
              자주 묻는 질문
            </h2>
            <div className="mt-8 space-y-2">
              {FAQ_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border border-zinc-300/90 bg-white px-5 py-4 shadow-card"
                >
                  <button
                    className="flex w-full items-center justify-between gap-4 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="text-[15px] font-semibold leading-snug text-ink">{item.q}</span>
                    <span className="text-xs font-medium text-zinc-700">
                      {openFaq === i ? '접기' : '펼치기'}
                    </span>
                  </button>
                  {openFaq === i && (
                    <p className="mt-3 text-[14px] leading-[1.75] text-zinc-800">
                      {item.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* CTA — 밝은 배경 + 검정 글씨 */}
          <section className="mx-auto w-full max-w-3xl rounded-xl border border-zinc-300/90 bg-white px-8 py-10 text-center shadow-card md:px-10 md:py-12">
            <h3 className="text-xl font-extrabold tracking-tight text-ink md:text-2xl">
              지금 사업장의 근로감독 리스크를
              <span className="mt-1 block">숫자와 문장으로 정리해 보세요.</span>
            </h3>
            <p className="mt-5 text-[15px] leading-[1.75] text-zinc-700 md:text-base">
              진단 결과는 브라우저에만 임시 저장됩니다. 2025년 고용노동부 자율진단표 7개 영역 기준으로 리스크를 정리해 드립니다.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/diagnosis"
                className={`inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-bold ${DIAGNOSIS_CTA_CLASS}`}
              >
                무료로 우리 회사 리스크 확인하기
              </Link>
              <Link
                to="/info"
                className="inline-flex items-center justify-center rounded-full border border-ink bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:bg-zinc-50"
              >
                사업장 정보 입력 후 진단
              </Link>
              <Link
                to="/diagnosis"
                className={`inline-flex items-center justify-center rounded-full px-5 py-3.5 text-sm font-medium ${DIAGNOSIS_CTA_CLASS}`}
              >
                이미 진단 중이에요
              </Link>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </div>
  )
}
