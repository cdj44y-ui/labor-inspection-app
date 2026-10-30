import { Link } from 'react-router-dom'
import { useState } from 'react'
import SiteFooter from '../components/common/SiteFooter.jsx'
import NewsBanner from '../components/common/NewsBanner.jsx'
import LawCalendar from '../components/common/LawCalendar.jsx'
import { PROMISE } from '../constants/brand.js'


// 2026-10-30 고용노동부 「지방정부 노동감독체계 구축 및 실행방안」(2026.9) — 위임 대상 분야 선정 예시(체불 인원·지역 집중도·업종 내 체불 비율로 추출)
const REGION_FOCUS = {"서울":["출판업 · 5~29인","의복·의복 액세서리 제조업 · 5~9인","사업지원 서비스업 · 10~29인"],"부산":["가죽·가방·신발 제조업 · 10~29인","종합 건설업 · 5~9인","음식점 및 주점업 · 10~29인"],"대구":["섬유제품 제조업 · 5~29인","소매업 · 5~9인","음식점 및 주점업 · 5~29인"],"인천":["사업지원 서비스업 · 5~9인","스포츠·오락 관련 서비스업 · 1~4인","전자부품·컴퓨터 등 제조업 · 10~29인"],"광주":["종합 건설업 · 5~9인","전자부품·컴퓨터 등 제조업 · 10~29인","보건업 · 10~29인"],"대전":["출판업 · 5~9인","기타 개인 서비스업 · 10~29인","연구개발업 · 10~29인"],"울산":["기타 운송장비 제조업 · 5~29인","기타 기계·장비 제조업 · 10~29인","자동차·트레일러 제조업 · 1~29인"],"세종":["의료·정밀·광학기기·시계 제조업 · 10~29인","전기장비 제조업 · 10~29인","보건업 · 10~29인"],"경기":["섬유제품 제조업 · 10~29인","가구 제조업 · 5~29인","고무·플라스틱제품 제조업 · 10~29인"],"강원":["숙박업 · 10~29인","농업 · 1~4인","식료품 제조업 · 10~29인"],"충북":["식료품 제조업 · 5~29인","금속가공제품 제조업 · 10~29인","비금속 광물제품 제조업 · 10~29인"],"충남":["금속가공제품 제조업 · 5~29인","자동차·트레일러 제조업 · 10~29인","어업 · 1~4인"],"전북":["어업 · 1~4인","식료품 제조업 · 5~29인","의복·의복 액세서리 및 모피제품 제조업 · 5~9인"],"전남":["기타 운송장비 제조업 · 1~29인","어업 · 1~4인","금속가공제품 제조업 · 10~29인"],"경북":["자동차·트레일러 제조업 · 10~29인","섬유제품 제조업 · 5~9인","금속가공제품 제조업 · 5~9인"],"경남":["기타 운송장비 제조업 · 1~29인","금속가공제품 제조업 · 10~29인","기타 제품 제조업 · 5~9인"],"제주":["숙박업 · 5~29인","수상운송업 · 1~4인","기타 전문·과학·기술 서비스업 · 5~9인"]}

function LocalInspection() {
  const [rg, setRg] = useState('서울')
  return (
    <section className="border-t border-[#E6E6E6] bg-white py-12 md:py-16">
      <div className="mx-auto max-w-[1120px] px-6 md:px-8">
        <p className="text-[15px] font-bold text-[#666]">2026년 12월 8일부터 달라지는 감독</p>
        <h2 className="mt-2 text-[28px] font-extrabold leading-[1.35] tracking-[-0.6px] md:text-[34px]">30인 미만 사업장은 시·도 감독관도 점검합니다</h2>
        {/* 2026-10-31 읽기 쉽게: 한 줄 요약 3개 + 근거는 펼쳐 보기(노션 토글) */}
        <ol className="mt-6 border-t border-[#111]">
          {[
            ['12월 8일부터', '시·도에도 노동감독관을 둡니다.'],
            ['30인 미만', '시·도가 감독을 맡는 안이 나와 있습니다. (확정 전)'],
            ['감독 방식', '점검표로 보고, 고칠 기회를 먼저 줍니다.'],
          ].map(([k, v]) => (
            <li key={k} className="grid grid-cols-[110px_1fr] gap-3 border-b border-[#E6E6E6] py-4 text-[17px] md:grid-cols-[160px_1fr] md:text-[18px]">
              <b className="text-[#1B2A44]">{k}</b><span className="leading-[1.6]">{v}</span>
            </li>
          ))}
        </ol>
        <details className="mt-3 text-[15px] text-[#555]">
          <summary className="cursor-pointer py-2 font-bold text-[#333]">근거 보기</summary>
          <ul className="mt-1 space-y-1 pl-4 leading-[1.7]">
            <li>노동감독관 직무집행법 · 2026년 12월 8일 시행</li>
            <li>30인 미만 감독·후속 조치(수사·과태료) 시·도 위임 시행령안 · 입법예고 2026.7.24.~9.2. · 확정 전. 신고 사건은 계속 노동청이 맡습니다.</li>
            <li>고용노동부 「지방정부 노동감독체계 구축 및 실행방안」(2026.9) · 기한 안에 고치지 않으면 수사·과태료로 이어집니다.</li>
          </ul>
        </details>
        <div className="mt-8 bg-[#F5F5F4] px-5 py-6 md:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[18px] font-extrabold">우리 지역 중점 업종(예시)</p>
            <select value={rg} onChange={(e) => setRg(e.target.value)} className="h-[48px] border border-[#BDBDBD] bg-white px-3 text-[17px]" aria-label="시·도 선택">
              {Object.keys(REGION_FOCUS).map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <ol className="mt-4 grid gap-2 md:grid-cols-3">
            {REGION_FOCUS[rg].map((v, i) => (
              <li key={v} className="flex items-baseline gap-3 border-t border-[#DADADA] pt-3 text-[17px]"><span className="text-[22px] font-light text-[#1B2A44]">0{i + 1}</span><span className="font-bold">{v}</span></li>
            ))}
          </ol>
          <p className="mt-4 text-[16px] text-[#333]">해당 업종이라면 진단으로 먼저 점검해 보세요.</p>
          <details className="mt-1 text-[14px] text-[#666]"><summary className="cursor-pointer py-2 font-bold">이 목록은 어떻게 뽑았나요?</summary><p className="leading-[1.7]">고용노동부 실행방안(2026.9)의 선정 예시입니다. 체불 인원, 지역 집중도, 업종 내 체불 사업장 비율로 뽑았고, 실제 감독 대상은 협의회에서 정합니다.</p></details>
          <Link to="/diagnosis" className="mt-4 inline-flex h-[52px] items-center bg-[#1B2A44] px-6 text-[17px] font-bold text-white no-underline visited:text-white">진단 시작하기 →</Link>
        </div>
      </div>
    </section>
  )
}

const FAQ_ITEMS = [
  {
    q: '이 서비스는 어떤 서비스인가요?',
    a: '고용노동부 자율진단표를 바탕으로 우리 회사의 근로감독 위험을 미리 점검하는 자가진단입니다.',
  },
  { q: '진단에 얼마나 걸리나요?', a: '약 10분 걸립니다. 50여 개 핵심 문항에 답하시면 됩니다.' },
  {
    q: '진단 결과는 저장되나요?',
    a: '답변은 이 브라우저에만 임시로 남고 서버에는 저장되지 않습니다. 상담을 신청하실 때만 진단 결과가 노무사에게 전달됩니다.',
  },
  { q: '어떤 사업장이 이용할 수 있나요?', a: '근로자를 둔 사업장이면 이용하실 수 있습니다.' },
]

const CASES = [
  {
    tag: '외식·프랜차이즈',
    title: '주 52시간 초과 + 연장수당 미지급',
    body: '근로시간을 기록하지 않고 포괄임금으로 연장수당을 주지 않아 시정지시를 받는 유형입니다.',
    loss: '연장수당·주휴수당 소급 지급과 평판 하락',
  },
  {
    tag: '스타트업·사무직',
    title: '자율 출퇴근제인데 연장근로 관리가 없는 경우',
    body: '야근·주말 근무를 사실상 요구하면서 근로시간 기록과 수당 체계가 없어 위반으로 판단되는 유형입니다.',
    loss: '연장·야간·휴일수당 일괄 정산과 근로시간 제도 재설계',
  },
  {
    tag: '소규모 사업장',
    title: '단시간 근로자의 4대보험·연차·주휴수당 미적용',
    body: '파트타이머에게 4대보험·연차·주휴수당을 적용하지 않다가 여러 해 치 체불이 확인되는 유형입니다.',
    loss: '과거 체불임금 정산과 과태료',
  },
]


const INDUSTRY_POINTS = [
  { name: '금융', point: '영업직 연장근로 관리, 성과급의 임금 해당 여부' },
  { name: 'IT', point: '포괄임금·유연근무 운영과 실제 근로시간 기록' },
  { name: '보건의료', point: '교대 근무의 휴게·야간근로 관리' },
  { name: '제조', point: '교대제 근로시간과 안전보건교육·위험성평가 기록' },
]

const btnPrimary = 'inline-flex h-[60px] items-center justify-center rounded-[10px] bg-[#1B2A44] px-8 text-[19px] font-bold text-white no-underline transition hover:bg-[#131F33] visited:text-white'
const btnConsult = 'inline-flex h-[60px] items-center justify-center rounded-[10px] bg-[#1F4E79] px-8 text-[19px] font-bold text-white no-underline transition hover:bg-[#173B5C] visited:text-white'
const btnGhost = 'inline-flex h-[60px] items-center justify-center rounded-[10px] border-[1.5px] border-[#14213D] bg-white px-8 text-[19px] font-bold text-[#14213D] no-underline transition hover:bg-[#F5F7FA]'

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="min-h-screen bg-white text-[#14213D] [word-break:keep-all]">
      <NewsBanner />

      {/* 헤더 */}
      <header className="border-b border-[#DDE2EA]">
        <div className="mx-auto flex h-[76px] max-w-[1120px] items-center justify-between px-6 md:px-8">
          <Link to="/" className="no-underline text-[#14213D]">
            <span className="block text-[22px] font-extrabold leading-tight tracking-[-0.3px]">RISK<span className="text-[#1B2A44]">119</span></span>
            <span className="block text-[13px] font-medium text-[#5B6680]">근로감독 자가진단</span>
          </Link>
          <nav className="flex items-center gap-5 text-[16px] font-semibold text-[#3D4A63] md:gap-8 md:text-[17px]">
            <Link to="/diagnosis" className="no-underline text-[#3D4A63] hover:text-[#14213D]">자가진단</Link>
            <a href="#law" className="hidden no-underline text-[#3D4A63] hover:text-[#14213D] md:inline">달라지는 법령</a>
            <a href="#expert" className="hidden no-underline text-[#3D4A63] hover:text-[#14213D] md:inline">노무사 소개</a>
            <Link to="/contact" className="rounded-lg bg-[#1F4E79] px-4 py-2 text-white no-underline hover:bg-[#173B5C] visited:text-white">상담 신청</Link>
          </nav>
        </div>
      </header>

      {/* 히어로 */}
      <section className="py-14 md:py-[72px]">
        <div className="mx-auto grid max-w-[1120px] gap-12 px-6 md:grid-cols-[1.25fr_0.9fr] md:gap-14 md:px-8">
          <div>
            <p className="text-[17px] font-bold text-[#1B2A44]">50여 문항 · 약 10분</p>
            <h1 className="mt-3.5 text-[38px] font-bold leading-[1.28] tracking-[-1px] md:text-[52px] md:tracking-[-1.2px]">
              근로감독 오기 전에,<br />우리 회사 위험부터<br />확인하십시오
            </h1>
            <p className="mt-6 max-w-[560px] text-[19px] leading-[1.75] text-[#3D4A63] md:text-[20px]">
              감독관이 실제로 보는 임금·근로시간·연차·4대보험 항목을 점검합니다. 결과에서 해당 조문과 처벌 수준을 확인하실 수 있습니다.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/diagnosis" className={btnPrimary}>진단 시작하기 →</Link>
              <Link to="/contact" className={btnConsult}>상담 신청</Link>
            </div>
            <p className="mt-5 text-[16px] text-[#5B6680]">{PROMISE}</p>
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

      <LocalInspection />

      {/* 2026-10-31 진단과 같은 주제의 결과 견본 (실제 고객 문서 아님 · 회사 소개 견본과 동일) */}
      <section className="border-t border-[#E6E6E6] bg-white py-12 md:py-16">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <p className="text-[15px] font-bold text-[#666]">진단 뒤에 받으시는 검토 결과 · 견본</p>
          <h2 className="mt-2 text-[28px] font-extrabold leading-[1.35] tracking-[-0.6px] md:text-[34px]">근로시간 점검은 이렇게 한 장으로 정리됩니다</h2>
          <p className="mt-2 text-[16px] font-bold text-[#1B2A44]">제조업 · 상시 40명 · 근로시간 점검</p>
          <div className="mt-6 border-t border-[#111]">
            {[
              ['결론', '연장근로가 주 12시간을 넘은 주가 있습니다. 이번 달 근무표부터 조정이 필요합니다.'],
              ['근거', '근로기준법 제53조 제1항 · 최근 3개월 출퇴근 기록 대조'],
              ['확인 필요', '교대조가 휴게시간을 실제로 쉬었는지는 아직 현장에서 확인하지 못했습니다.'],
              ['실행', '인사 담당 · 다음 달 첫 주까지 · 생산 2팀 근무표부터'],
              ['다음', '3개월 뒤 같은 기록으로 다시 점검'],
            ].map(([k, v], i) => (
              <div key={k} className={'grid gap-1 border-b border-[#E6E6E6] py-4 md:grid-cols-[140px_1fr] md:gap-6 ' + (i === 0 ? 'bg-[#F5F5F4] px-4' : 'px-4')}>
                <p className="text-[15px] font-bold text-[#666]">{k}</p>
                <p className={'text-[17px] leading-[1.7] ' + (i === 0 ? 'font-bold text-[#111]' : 'text-[#333]')}>{v}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[14px] text-[#777]">형식을 보여 드리는 견본입니다. 실제 문서는 귀사의 자료와 현장 확인 결과로 작성합니다.</p>
        </div>
      </section>

      {/* 전문가 */}
      <section id="expert" className="border-t border-[#DDE2EA] bg-[#F5F7FA] py-10 md:py-14">
        <div className="mx-auto grid max-w-[1120px] items-start gap-10 px-6 md:grid-cols-[260px_1fr] md:gap-14 md:px-8">
          <img src="/expert/cho-daejin.jpg" alt="조대진 대표노무사" width="260" height="338" className="h-[220px] w-[170px] rounded-xl object-cover md:h-[338px] md:w-[260px]" />
          <div>
            <p className="text-[17px] font-bold text-[#1B2A44]">이 진단을 설계한 사람</p>
            <h2 className="mt-2 text-[32px] font-bold leading-[1.35] tracking-[-0.8px] md:text-[36px]">대기업 인사팀 출신 노무사, 조대진</h2>
            <p className="mt-1 text-[18px] font-semibold text-[#5B6680]">공인노무사 16년 · 안전공학 박사</p>
            <p className="mt-2 text-[20px] font-semibold leading-[1.6] md:text-[22px]">
              “감독은 서류보다 실제 운영을 봅니다. 대기업 근로감독을 매년 직접 대응한 경험으로, 문항을 감독관이 묻는 순서대로 만들었습니다.”
            </p>
            <div className="mt-5 grid grid-cols-1 border-t-2 border-[#14213D] md:grid-cols-2">
              {[
                ['소속', '노무법인 위너스 대표노무사'],
                
                
                ['실무 이력', '현대카드 · 삼성서울병원 인사 출신'],
                ['강의', '삼성전자 · SK가스 · 두산그룹 등 기업 강의'],
                ['전문 분야', '근로감독 대응 · 노동법 · 산업안전 · 인사제도'],
              ].map(([k, v]) => (
                <div key={k} className="border-b border-[#DDE2EA] py-3 md:pr-6">
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

      {/* 근거 원칙 + 진행 방식 */}
      <section className="border-t border-[#DDE2EA] py-10 md:py-14">
        <div className="mx-auto grid max-w-[1120px] gap-8 px-6 md:grid-cols-2 md:gap-14 md:px-8">
          <div>
            <h2 className="text-[26px] font-bold leading-[1.35] tracking-[-0.6px] md:text-[30px]">모든 문항에 법적 근거를 답니다</h2>
            <ul className="mt-4 space-y-2 text-[17px] leading-[1.7] text-[#3D4A63]">
              <li><b className="text-[#14213D]">문항마다 조문 표기</b> · 모든 질문에 해당 조문을 함께 보여드립니다.</li>
              <li><b className="text-[#14213D]">공식 점검표 기반</b> · 고용노동부 「사업장 기초노동질서 자율진단표」 기준 50여 문항입니다.</li>
              <li><b className="text-[#14213D]">매일 원문 대조</b> · 국가법령정보센터 원문을 확인해 날짜와 함께 반영합니다.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-[26px] font-bold leading-[1.35] tracking-[-0.6px] md:text-[30px]">10분이면 끝납니다</h2>
            <ul className="mt-4 space-y-2 text-[17px] leading-[1.7] text-[#3D4A63]">
              <li><b className="text-[#14213D]">1. 사업장 정보</b> · 업종과 직원 수만 고르시면 됩니다.</li>
              <li><b className="text-[#14213D]">2. 질문에 답하기</b> · 한 화면에 질문 하나씩 답하시면 됩니다.</li>
              <li><b className="text-[#14213D]">3. 결과와 할 일</b> · 위험 등급, 해당 조문, 우선 고칠 항목을 정리해 드립니다.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 법 개정 한 장 — 네 사이트 공통 */}
      <LawCalendar />

      {/* 사례 */}
      <section className="border-t border-[#DDE2EA] py-10 md:py-14">
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
      <section id="faq" className="border-t border-[#DDE2EA] bg-[#F5F7FA] py-10 md:py-14">
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

      {/* 사장님 1분 상담소 연결 (2026-10-18) */}
      <section className="border-y border-[#DDE2EA] bg-[#F5F7FA]">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-4 px-6 py-7 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="text-[15px] font-bold text-[#1B2A44]">진단 전에 고민부터 풀고 싶으시다면</p>
            <p className="mt-1 text-[19px] font-bold leading-[1.5] text-[#14213D]">잠수·주휴수당·퇴직금 등 직원 고민 10가지, 1분 답과 할 일 3개</p>
          </div>
          <a href="https://win119.site/sangdamso" className="inline-flex h-[52px] shrink-0 items-center justify-center rounded-[10px] border-2 border-[#14213D] px-6 text-[17px] font-bold text-[#14213D] hover:bg-white">사장님 1분 상담소 →</a>
        </div>
      </section>

      {/* 소개 영상 (접힘) */}
      <section id="intro-video" className="border-t border-[#DDE2EA] py-6">
        <div className="mx-auto max-w-[880px] px-6 md:px-8">
          <details className="group">
            <summary className="flex min-h-[48px] cursor-pointer items-center text-[19px] font-bold text-[#14213D]">15초 소개 영상 보기</summary>
            <div className="mt-4 overflow-hidden rounded-[14px] border border-[#DDE2EA]">
              <video className="block aspect-video w-full bg-[#F5F7FA]" src="/video/risk119-intro.mp4" poster="/video/risk119-intro-poster.jpg" muted loop playsInline controls preload="none" aria-label="RISK119 소개 영상" />
            </div>
          </details>
        </div>
      </section>

      {/* 마무리 CTA */}
      <section className="bg-[#14213D] py-16 text-center text-white md:py-[88px]">
        <div className="mx-auto max-w-[1120px] px-6 md:px-8">
          <h2 className="text-[30px] font-bold leading-[1.35] tracking-[-0.8px] text-white md:text-[36px]">감독 통지서가 오기 전에 확인하십시오</h2>
          <p className="mt-2.5 text-[18px] text-[#C9D1E0] md:text-[19px]">{PROMISE} · 약 10분</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/diagnosis" className={btnPrimary}>진단 시작하기 →</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
