import { Link } from 'react-router-dom'
import { useState } from 'react'
import { getUser, clearAuth, authFetch } from '../utils/auth.js'
import { CONTACT_PHONE, CONSULT_PLAN_ID, RAPIDO_CONTENT_URL, CONSULT_BUTTON_CLASS, DIAGNOSIS_CTA_CLASS } from '../constants/contact.js'

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
        {/* Top bar — 밝은 배경 + 검정 글씨 (가독성) */}
        <header className="flex items-center justify-between rounded-2xl border-2 border-zinc-200 bg-white px-4 py-3 shadow-edge md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-ink bg-white text-xs font-bold tracking-tight text-ink">
              L
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                Labor Risk Studio
              </span>
              <span className="text-sm font-bold tracking-tight text-ink">
                근로감독 자가진단
              </span>
            </div>
          </div>
          <div className="hidden items-center gap-4 text-xs md:flex">
            <nav className="flex items-center gap-5 text-ink">
              <Link to="/info" className="font-medium text-zinc-700 transition hover:text-toss">
                진단 시작
              </Link>
              <Link to="/diagnosis" className="font-medium text-zinc-700 transition hover:text-toss">
                문항 보기
              </Link>
              <Link to="/result" className="font-medium text-zinc-700 transition hover:text-toss">
                결과 보기
              </Link>
              <Link to="/pricing" className="font-medium text-zinc-700 transition hover:text-toss">
                요금제
              </Link>
            </nav>
            <span className="rounded-full border-2 border-zinc-300 bg-zinc-50 px-3 py-1.5 text-[11px] font-medium text-zinc-700">
              Closed Beta
            </span>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-zinc-700 truncate max-w-[120px]" title={user.email}>
                  {user.email}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border-2 border-zinc-300 bg-zinc-50 px-3 py-1.5 text-[11px] font-medium text-zinc-700 transition hover:bg-zinc-100"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="font-medium text-zinc-700 transition hover:text-ink">
                  로그인
                </Link>
                <Link to="/signup" className="font-medium text-zinc-700 transition hover:text-ink">
                  회원가입
                </Link>
                <Link
                  to="/diagnosis"
                  className={`rounded-full px-4 py-2 text-[11px] font-bold ${DIAGNOSIS_CTA_CLASS}`}
                >
                  바로 진단하기
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Privacy — 밝은 배경 + 검정 글씨 */}
        <div className="mt-4 rounded-2xl border-2 border-zinc-200 bg-white px-4 py-3.5 text-[11px] text-ink shadow-edge md:px-5">
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-zinc-100 text-[10px]">
                🔒
              </span>
              <p className="font-semibold text-ink">
                입력하신 진단 데이터는 서버 DB에 저장되지 않는 휘발성 자가진단입니다.
              </p>
            </div>
            <p className="mt-1 text-[10px] text-zinc-700 md:mt-0">
              브라우저에서만 보관되며, 별도 동의 없이는 제3자에게 공유되지 않습니다.
            </p>
          </div>
        </div>

        <main className="mt-12 flex flex-1 flex-col gap-20 md:mt-16">
          <section className="mx-auto grid w-full max-w-5xl gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-center">
            <div className="rounded-2xl border-2 border-zinc-200 bg-white p-8 shadow-edge md:p-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600">
                고용노동부 자율점검표 기반 · 실제 근로감독 사례 반영
              </p>
              <h1 className="mt-4 text-display font-bold tracking-tight text-ink md:text-display-md lg:text-display-lg">
                근로감독 전에,
                <br />
                <span className="text-ink">우리 회사 리스크</span>부터 확인하세요
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-zinc-800 md:text-base">
                노동부 자율점검표를 바탕으로 <span className="font-bold text-ink">50여개 핵심 문항</span>을 정리했습니다.
                임금체불·연장근로·휴게시간·연차·4대보험·산재 이슈를 한 번에 점검하고,
                <span className="font-bold text-ink"> 근로감독·형사 사건으로 번지기 전</span>에 리스크를 줄여보세요.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  to="/diagnosis"
                  className={`inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-bold ${DIAGNOSIS_CTA_CLASS}`}
                >
                  바로 진단하기
                </Link>
                <Link
                  to="/info"
                  className="inline-flex items-center justify-center rounded-full border-2 border-zinc-700 bg-zinc-100 px-6 py-3.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-200"
                >
                  사업장 정보 입력 후 진단
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 text-[11px]">
                <span className="badge-dark rounded-full px-3 py-1.5 font-medium">50여개 핵심 문항</span>
                <span className="badge-dark-zinc rounded-full px-3 py-1.5 font-medium">7개 카테고리</span>
                <span className="rounded-full border-2 border-zinc-600 bg-white px-3 py-1.5 font-semibold text-zinc-800">종합 리포트</span>
              </div>
            </div>

            <div className="rounded-3xl border-2 border-zinc-200 bg-white p-6 shadow-edge md:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                리스크 스냅샷
              </p>
              <div className="mt-4 rounded-2xl border-2 border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-center justify-between text-[11px] text-ink">
                  <span className="font-medium">종합 리스크 레벨</span>
                  <span className="rounded-full bg-ink px-2.5 py-0.5 text-[10px] font-bold text-white">
                    양호 · B 등급
                  </span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-zinc-200">
                  <div className="h-full w-3/4 rounded-full bg-ink" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-ink">
                  {['근로시간', '임금·수당', '휴가·휴일'].map((label, i) => (
                    <div key={label} className="rounded-xl border-2 border-zinc-200 bg-white px-3 py-2.5">
                      <p className="text-[10px] text-zinc-600">{label}</p>
                      <p className="mt-1 text-sm font-bold text-ink">
                        {i === 0 ? '78' : i === 1 ? '91' : '84'}점
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-[10px] leading-relaxed text-zinc-700">
                귀 사업장 답변 기반으로 카테고리별 점수와 개선 항목을 정리해 드립니다.
              </p>
            </div>
          </section>

          {/* Features — 2번 카드 토스 블루 강조 */}
          <section id="features" className="mx-auto w-full max-w-5xl">
            <p className="section-label text-center text-[10px] font-semibold uppercase tracking-[0.22em]">
              Why This Studio
            </p>
            <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-ink md:text-3xl">
              근로감독 리스크를 한 장의 리포트로
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-zinc-800">
              복잡한 법령 대신, 점수와 우선순위 기반 액션 포인트로 정리합니다.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  className={`rounded-2xl border-2 p-6 shadow-edge transition ${
                    i === 1 ? 'border-toss bg-toss/5' : 'border-zinc-200 bg-white'
                  }`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${
                    i === 1 ? 'bg-toss text-white' : 'bg-zinc-100 text-ink'
                  }`}>
                    {i + 1}
                  </div>
                  <h3 className="mt-4 text-base font-bold tracking-tight text-ink">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-800">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Process — 플로우 숫자 토스 블루 */}
          <section
            id="flow"
            className="mx-auto w-full max-w-4xl rounded-3xl border-2 border-zinc-200 bg-white p-8 shadow-edge md:p-10"
          >
            <p className="section-label text-center text-[10px] font-semibold uppercase tracking-[0.22em]">
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
            <p className="section-label text-center text-[10px] font-semibold uppercase tracking-[0.22em]">
              Real Inspection Signals
            </p>
            <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-ink md:text-3xl">
              실제 근로감독 사례로 보는 리스크 경고등
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-zinc-800">
              노동부 보도자료와 언론에 자주 등장하는 유형을 바탕으로 재구성한 예시입니다.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {CASES.map((c, i) => (
                <article
                  key={c.title}
                  className="flex h-full flex-col rounded-2xl border-l-4 border-toss border border-zinc-200 bg-white p-6 shadow-edge"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                    {c.tag}
                  </p>
                  <h3 className="mt-3 text-base font-bold tracking-tight text-ink">
                    {c.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-800">
                    {c.body}
                  </p>
                  <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-[11px] text-zinc-800">
                    <span className="font-bold text-ink">적발 시 손실 가능성 · </span>
                    {c.loss}
                  </div>
                  {i === 0 && (
                    <p className="mt-3 text-[10px] text-zinc-600">
                      * 유명 카페·베이커리, 런던베이글 등 언론 보도 사례를 일반화한 유형입니다.
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>

          {/* 조대진 노무사 — 밝은 배경 + 검정 글씨 */}
          <section
            id="consult"
            className="mx-auto w-full max-w-5xl rounded-3xl border-2 border-zinc-200 bg-white p-6 shadow-edge md:p-8"
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
                      className="text-toss text-sm font-bold tracking-tight underline decoration-toss/50 transition hover:text-toss-hover md:text-base"
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
                <Link
                  to="/payment"
                  state={{ planId: CONSULT_PLAN_ID }}
                  className={CONSULT_BUTTON_CLASS + ' no-underline visited:text-white'}
                >
                  비대면 상담
                </Link>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="mx-auto w-full max-w-3xl">
            <p className="section-label text-center text-[10px] font-semibold uppercase tracking-[0.22em]">
              FAQ
            </p>
            <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-ink">
              자주 묻는 질문
            </h2>
            <div className="mt-8 space-y-2">
              {FAQ_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border-2 border-zinc-200 bg-white px-5 py-4 shadow-edge"
                >
                  <button
                    className="flex w-full items-center justify-between gap-4 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-semibold text-ink">{item.q}</span>
                    <span className="text-xs font-medium text-zinc-700">
                      {openFaq === i ? '접기' : '펼치기'}
                    </span>
                  </button>
                  {openFaq === i && (
                    <p className="mt-2 text-xs leading-relaxed text-zinc-800 md:text-sm">
                      {item.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* CTA — 밝은 배경 + 검정 글씨 */}
          <section className="mx-auto w-full max-w-3xl rounded-3xl border-2 border-zinc-200 bg-white px-8 py-10 text-center shadow-edge md:px-10 md:py-12">
            <h3 className="text-xl font-bold tracking-tight text-ink md:text-2xl">
              지금 사업장의 근로감독 리스크를
              <span className="mt-1 block">숫자와 문장으로 정리해 보세요.</span>
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-zinc-700">
              진단 결과는 브라우저에만 임시 저장됩니다. 2025년 고용노동부 자율진단표 7개 영역 기준으로 리스크를 정리해 드립니다.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/diagnosis"
                className={`inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-bold ${DIAGNOSIS_CTA_CLASS}`}
              >
                바로 진단하기
              </Link>
              <Link
                to="/info"
                className="inline-flex items-center justify-center rounded-full border-2 border-zinc-600 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
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

        <footer className="mt-12 border-t-2 border-zinc-200 pt-8 text-center text-[11px] text-zinc-800 space-y-1">
          <p>근로감독 자가진단 서비스 · 참고용 자가점검 도구입니다.</p>
          <p className="max-w-3xl mx-auto text-[10px] text-zinc-700">
            본 서비스는 노동관계 법령과 공개 자료를 바탕으로 한 일반적인 리스크 점검 도구이며, 개별 사건에 대한
            법률 자문이나 행정해석을 대체하지 않습니다. 최종적인 법적 책임과 판단은 사용자 및 관계 기관(법원·노동부
            등)에 있으며, 서비스 제공자는 본 진단 결과만을 근거로 한 의사결정에 대해 법적 책임을 지지 않습니다.
          </p>
        </footer>
      </div>
    </div>
  )
}
