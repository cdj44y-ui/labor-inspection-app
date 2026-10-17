import { Link } from 'react-router-dom'
import { useState } from 'react'
import SiteFooter from '../components/common/SiteFooter.jsx'
import NewsBanner from '../components/common/NewsBanner.jsx'

const FAQ_ITEMS = [
  {
    q: '이 서비스는 어떤 서비스인가요?',
    a: '고용노동부 자율점검표와 실제 근로감독·형사 사건 사례를 바탕으로, 우리 회사의 근로감독 리스크를 미리 점검해보는 자가진단 툴입니다.',
  },
  { q: '진단에 얼마나 걸리나요?', a: '약 5~10분 정도 소요됩니다. 50여개 핵심 문항에 답하시면 됩니다.' },
  {
    q: '진단 결과는 저장되나요?',
    a: '현재 버전에서는 브라우저에만 임시 저장되며, 서버 DB에는 저장되지 않습니다. 상담을 신청할 경우에만 입력하신 내용이 담당 노무사에게 전달됩니다.',
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


// 법 개정 달력 — 국가법령정보센터 원문 확인 항목만 (매일 점검 루틴에서 갱신)
const LAW_CALENDAR = [
  { date: '2026.10.08', status: '시행 중', tone: 'now', title: '임금 체불 처벌 상향, 최대 징역 5년', note: '근로기준법 벌칙 조항 제109조 → 제107조 (법률 제21533호)' },
  { date: '2026.10.01', status: '공포 전', tone: 'pre', title: '반복 산재 사망 시 영업이익 최대 5% 과징금', note: '산업안전보건법 개정안 국회 본회의 통과' },
  { date: '2026.12.08', status: '시행 예정', tone: 'next', title: '근로감독관 명칭, 노동감독관으로 변경', note: '근로기준법 제11장·제101조 등 개정, 권한·의무는 「노동감독관 직무집행법」으로 (법률 제21533호)' },
  { date: '2027.01.08', status: '시행 예정', tone: 'next', title: '외국인 근로자 기초안전보건교육 의무화', note: '산업안전보건법 제31조의2 신설' },
  { date: '2027.06.10', status: '시행 예정', tone: 'next', title: '연차휴가 관련 조문 개정', note: '근로기준법 제60조' },
]

const INDUSTRY_POINTS = [
  { name: '금융', point: '영업직 연장근로 관리, 성과급의 임금 해당 여부' },
  { name: 'IT', point: '포괄임금·유연근무 운영과 실제 근로시간 기록' },
  { name: '보건의료', point: '교대 근무의 휴게·야간근로 관리' },
  { name: '제조', point: '교대제 근로시간과 안전보건교육·위험성평가 기록' },
]

const toneClass = {
  now: 'bg-[#FDECEC] text-[#B42318]',
  pre: 'bg-[#EEF1F5] text-[#3D4A63]',
  next: 'bg-[#EAF2FE] text-[#1B64DA]',
}

const btnPrimary = 'inline-flex h-[60px] items-center justify-center rounded-[10px] bg-[#3182F6] px-8 text-[19px] font-bold text-white no-underline transition hover:bg-[#1B64DA] visited:text-white'
const btnGhost = 'inline-flex h-[60px] items-center justify-center rounded-[10px] border-[1.5px] border-[#14213D] bg-white px-8 text-[19px] font-bold text-[#14213D] no-underline transition hover:bg-[#F5F7FA]'

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="min-h-screen bg-white text-[#14213D] [word-break:keep-all]">
      <NewsBanner />

      {/* 상단 안내줄 */}
      <div className="border-b border-[#DDE2EA] bg-[#F5F7FA] text-[15px] text-[#5B6680]">
        <div className="mx-auto flex h-11 max-w-[1120px] items-center justify-between px-6 md:px-8">
          <span>노무법인 위너스가 운영하는 <b className="text-[#14213D]">근로감독 자가진단</b> 서비스</span>
          <span className="hidden md:inline">상담은 신청서 접수 후 순차적으로 안내드립니다</span>
        </div>
      </div>

      {/* 헤더 */}
      <header className="border-b border-[#DDE2EA]">
        <div className="mx-auto flex h-[76px] max-w-[1120px] items-center justify-between px-6 md:px-8">
          <Link to="/" className="no-underline text-[#14213D]">
            <span className="block text-[22px] font-extrabold leading-tight tracking-[-0.3px]">RISK<span className="text-[#3182F6]">119</span></span>
            <span className="block text-[13px] font-medium text-[#5B6680]">근로감독 자가진단</span>
          </Link>
          <nav className="flex items-center gap-5 text-[16px] font-semibold text-[#3D4A63] md:gap-8 md:text-[17px]">
            <Link to="/diagnosis" className="no-underline text-[#3D4A63] hover:text-[#14213D]">자가진단</Link>
            <a href="#law" className="hidden no-underline text-[#3D4A63] hover:text-[#14213D] md:inline">이달의 법 개정</a>
            <a href="#expert" className="hidden no-underline text-[#3D4A63] hover:text-[#14213D] md:inline">노무사 소개</a>
            <Link to="/contact" className="no-underline text-[#3D4A63] hover:text-[#14213D]">상담 신청</Link>
          </nav>
        </div>
      </header>

      {/* 히어로 */}
      <section className="py-14 md:py-[72px]">
        <div className="mx-auto grid max-w-[1120px] gap-12 px-6 md:grid-cols-[1.25fr_0.9fr] md:gap-14 md:px-8">
          <div>
            <p className="text-[17px] font-bold text-[#3182F6]">고용노동부 자율점검표 기반 · 50여 문항 · 약 10분</p>
            <h1 className="mt-3.5 text-[38px] font-bold leading-[1.28] tracking-[-1px] md:text-[52px] md:tracking-[-1.2px]">
              근로감독 오기 전에,<br />우리 회사 위험부터<br />확인하십시오
            </h1>
            <p className="mt-6 max-w-[560px] text-[19px] leading-[1.75] text-[#3D4A63] md:text-[20px]">
              임금·근로시간·연차·4대보험까지, 감독관이 실제로 보는 항목을 그대로 점검합니다. 결과에는 위반 시 적용되는 조문과 처벌 수준이 함께 나옵니다.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/diagnosis" className={btnPrimary}>무료로 진단 시작하기 →</Link>
              <Link to="/contact" className={btnGhost}>노무사와 상담하기</Link>
            </div>
            <p className="mt-5 text-[16px] text-[#5B6680]">회원가입 없음 · 입력 내용은 서버에 저장되지 않습니다</p>
          </div>
          <div className="self-start overflow-hidden rounded-[14px] border border-[#DDE2EA]">
            <div className="flex justify-between bg-[#14213D] px-6 py-[18px] text-[16px] font-semibold text-white">
              <span>지금 꼭 아셔야 할 변화</span><span>2026.10.8 시행</span>
            </div>
            <div className="px-6 py-[26px]">
              <p className="text-[38px] font-extrabold leading-[1.2] tracking-[-1px] md:text-[44px]">
                임금 체불,<br />이제 최대 <span className="text-[#B42318]">징역 5년</span>
              </p>
              <p className="mt-3 text-[17px] leading-[1.7] text-[#3D4A63]">
                근로기준법 개정으로 임금 정기지급·체불 위반의 처벌이 <b>3년 이하 징역·3천만 원 이하 벌금</b>에서 <b>5년 이하 징역·5천만 원 이하 벌금</b>으로 올랐습니다.
              </p>
              <p className="mt-4 border-t border-[#DDE2EA] pt-3 text-[14px] text-[#5B6680]">근거: 근로기준법 제107조(법률 제21533호) · 국가법령정보센터</p>
            </div>
          </div>
        </div>
      </section>

      {/* 전문가 */}
      <section id="expert" className="border-t border-[#DDE2EA] bg-[#F5F7FA] py-16 md:py-[88px]">
        <div className="mx-auto grid max-w-[1120px] items-start gap-10 px-6 md:grid-cols-[260px_1fr] md:gap-14 md:px-8">
          <img src="/expert/cho-daejin.jpg" alt="조대진 대표노무사" width="260" height="338" className="h-[338px] w-[260px] rounded-xl object-cover" />
          <div>
            <p className="text-[17px] font-bold text-[#3182F6]">이 진단을 설계한 사람</p>
            <h2 className="mt-2 text-[32px] font-bold leading-[1.35] tracking-[-0.8px] md:text-[36px]">조대진 대표노무사</h2>
            <p className="mt-2 text-[20px] font-semibold leading-[1.6] md:text-[22px]">
              “감독은 서류보다 실제 운영을 봅니다. 문항 하나하나를 감독관이 묻는 순서대로 만들었습니다.”
            </p>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-[#DDE2EA] bg-white p-6">
                <p className="text-[15px] font-bold text-[#3182F6]">대기업 근로감독, 매년 실전 대응</p>
                <p className="mt-2 text-[17px] leading-[1.7] text-[#3D4A63]">해마다 돌아오는 대기업 근로감독을 현장에서 직접 대응하며, 감독관이 무엇을 묻고 어떤 자료를 요구하는지 쌓아 온 경험을 문항에 담았습니다.</p>
              </div>
              <div className="rounded-xl border border-[#DDE2EA] bg-white p-6">
                <p className="text-[15px] font-bold text-[#3182F6]">금융·IT·보건의료·제조 자문사와 함께</p>
                <p className="mt-2 text-[17px] leading-[1.7] text-[#3D4A63]">업종마다 감독이 보는 지점은 다릅니다. 여러 업종의 자문사와 감독을 함께 대응하며 확인한 업종별 쟁점을 반영했습니다.</p>
              </div>
            </div>
            <div className="mt-7 grid grid-cols-1 border-t-2 border-[#14213D] md:grid-cols-2">
              {[
                ['소속', '노무법인 위너스 대표노무사'],
                ['경력', '공인노무사 16년'],
                ['학위', '안전공학 박사'],
                ['실무 이력', '현대카드 · 삼성서울병원 인사 출신'],
                ['강의', '삼성전자 · SK가스 · 두산그룹 등 기업 강의'],
                ['전문 분야', '근로감독 대응 · 노동법 · 산업안전 · 인사제도'],
              ].map(([k, v]) => (
                <div key={k} className="border-b border-[#DDE2EA] py-4 md:pr-6">
                  <p className="text-[15px] font-semibold text-[#5B6680]">{k}</p>
                  <p className="text-[17px]">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-[1120px] px-6 md:px-8">
          <h3 className="text-[22px] font-bold">업종별로 감독이 자주 보는 지점</h3>
          <div className="mt-5 grid gap-0 border-t border-[#14213D] md:grid-cols-4">
            {INDUSTRY_POINTS.map((it) => (
              <div key={it.name} className="border-b border-[#DDE2EA] py-5 md:border-b-0 md:border-r md:px-5 md:first:pl-0 md:last:border-r-0">
                <p className="text-[19px] font-bold">{it.name}</p>
                <p className="mt-1 text-[16px] leading-[1.65] text-[#3D4A63]">{it.point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 근거 원칙 */}
      <section className="border-t border-[#DDE2EA] py-16 md:py-[88px]">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <h2 className="text-[30px] font-bold leading-[1.35] tracking-[-0.8px] md:text-[36px]">모든 문항에 법적 근거를 답니다</h2>
          <p className="mt-2.5 text-[18px] text-[#5B6680] md:text-[19px]">추측이나 일반론이 아니라, 확인할 수 있는 근거로만 진단합니다.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              ['문항마다 조문 표기', '모든 질문 아래에 근로기준법·최저임금법·산업안전보건법 등 해당 조문을 그대로 보여드립니다.'],
              ['공식 점검표 기반', '고용노동부 「사업장 기초노동질서 자율진단표」를 바탕으로 50여 개 핵심 문항을 구성했습니다.'],
              ['매일 원문 대조', '국가법령정보센터 원문과 고용노동부 발표를 매일 확인하고, 바뀐 내용은 날짜와 함께 반영합니다.'],
            ].map(([t, d], i) => (
              <div key={t} className="rounded-[14px] border border-[#DDE2EA] p-8">
                <p className="text-[16px] font-extrabold text-[#3182F6]">근거 {i + 1}</p>
                <h3 className="mt-2.5 text-[22px] font-bold">{t}</h3>
                <p className="mt-2 text-[17px] leading-[1.7] text-[#5B6680]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 법 개정 달력 */}
      <section id="law" className="border-t border-[#DDE2EA] bg-[#F5F7FA] py-16 md:py-[88px]">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <h2 className="text-[30px] font-bold leading-[1.35] tracking-[-0.8px] md:text-[36px]">이번 달 달라지는 노동법</h2>
          <p className="mt-2.5 text-[18px] text-[#5B6680] md:text-[19px]">국가법령정보센터 원문을 확인해 갱신합니다. 사장님 회사에 해당하는지 진단에서 바로 확인할 수 있습니다.</p>
          <div className="mt-10 border-t-2 border-[#14213D]">
            {LAW_CALENDAR.map((r) => (
              <div key={r.date + r.title} className="grid gap-2 border-b border-[#DDE2EA] py-6 md:grid-cols-[150px_120px_1fr_140px] md:items-center md:gap-6">
                <p className="text-[18px] font-bold">{r.date}</p>
                <p><span className={'inline-block rounded-md px-2.5 py-1 text-[14px] font-bold ' + toneClass[r.tone]}>{r.status}</span></p>
                <div>
                  <p className="text-[19px] font-bold leading-[1.5]">{r.title}</p>
                  <p className="text-[16px] text-[#5B6680]">{r.note}</p>
                </div>
                <Link to="/diagnosis" className="text-[16px] font-bold text-[#3182F6] no-underline md:text-right">진단에서 확인 →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 소개 영상 */}
      <section id="intro-video" className="border-t border-[#DDE2EA] py-16 md:py-[88px]">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <h2 className="text-[30px] font-bold leading-[1.35] tracking-[-0.8px] md:text-[36px]">15초로 보는 RISK119</h2>
          <p className="mt-2.5 text-[18px] text-[#5B6680] md:text-[19px]">근로감독, 무엇부터 준비할지 막막하다면 판단의 기준부터 잡아드립니다.</p>
          <div className="mt-8 overflow-hidden rounded-[14px] border border-[#DDE2EA]">
            <video className="block aspect-video w-full bg-[#F5F7FA]" src="/video/risk119-intro.mp4" poster="/video/risk119-intro-poster.jpg" autoPlay muted loop playsInline controls preload="metadata" aria-label="RISK119 소개 영상" />
          </div>
        </div>
      </section>

      {/* 진행 방식 */}
      <section className="border-t border-[#DDE2EA] bg-[#F5F7FA] py-16 md:py-[88px]">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <h2 className="text-[30px] font-bold leading-[1.35] tracking-[-0.8px] md:text-[36px]">10분이면 끝납니다</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              ['사업장 정보', '업종과 직원 수만 고르시면 됩니다.'],
              ['질문에 답하기', '한 화면에 한 질문씩, 큰 버튼으로 답하시면 됩니다.'],
              ['결과와 할 일', '위험 등급, 해당 조문, 우선 고칠 항목을 정리해 드립니다.'],
            ].map(([t, d], i) => (
              <div key={t} className="rounded-[14px] border border-[#DDE2EA] bg-white p-8">
                <p className="text-[16px] font-extrabold text-[#3182F6]">{i + 1}단계</p>
                <h3 className="mt-2.5 text-[22px] font-bold">{t}</h3>
                <p className="mt-2 text-[17px] leading-[1.7] text-[#5B6680]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 사례 */}
      <section className="border-t border-[#DDE2EA] py-16 md:py-[88px]">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <h2 className="text-[30px] font-bold leading-[1.35] tracking-[-0.8px] md:text-[36px]">실제 감독에서 자주 나오는 위반</h2>
          <p className="mt-2.5 text-[18px] text-[#5B6680] md:text-[19px]">노동부 보도자료와 언론 보도에 반복되는 유형을 정리했습니다. 특정 업체를 지칭하지 않습니다.</p>
          <div className="mt-8">
            {CASES.map((c) => (
              <div key={c.title} className="grid gap-2 border-b border-[#DDE2EA] py-7 md:grid-cols-[180px_1fr] md:gap-8">
                <p className="text-[15px] font-bold text-[#5B6680]">{c.tag}</p>
                <div>
                  <h3 className="text-[21px] font-bold">{c.title}</h3>
                  <p className="mt-1.5 text-[17px] leading-[1.75] text-[#3D4A63]">{c.body}</p>
                  <p className="mt-2.5 text-[16px] font-semibold text-[#B42318]">적발 시 · {c.loss}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-[#DDE2EA] bg-[#F5F7FA] py-16 md:py-[88px]">
        <div className="mx-auto max-w-[880px] px-6 md:px-8">
          <h2 className="text-[30px] font-bold leading-[1.35] tracking-[-0.8px] md:text-[36px]">자주 묻는 질문</h2>
          <div className="mt-8 border-t-2 border-[#14213D]">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="border-b border-[#DDE2EA] bg-transparent">
                <button className="flex w-full items-center justify-between gap-4 py-6 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="text-[19px] font-bold leading-snug text-[#14213D]">{item.q}</span>
                  <span className="flex-shrink-0 text-[20px] text-[#5B6680] transition-transform duration-200" style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }} aria-hidden="true">▾</span>
                </button>
                {openFaq === i && <p className="pb-6 text-[17px] leading-[1.75] text-[#3D4A63]">{item.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 마무리 CTA */}
      <section className="bg-[#14213D] py-16 text-center text-white md:py-[88px]">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <h2 className="text-[30px] font-bold leading-[1.35] tracking-[-0.8px] text-white md:text-[36px]">감독 통지서가 오기 전에 확인하십시오</h2>
          <p className="mt-2.5 text-[18px] text-[#C9D1E0] md:text-[19px]">무료 · 회원가입 없음 · 약 10분</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/diagnosis" className={btnPrimary}>무료로 진단 시작하기 →</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
