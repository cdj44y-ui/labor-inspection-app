import profileCho from '../assets/profile-cho.png'

/** RISK119 · 근로감독 전문가 소개 */
export const EXPERT_LABOR = {
  name: '조대진',
  title: '노무사',
  affiliation: '노무법인 위너스',
  credentials: ['안전공학 박사', '공인노무사', 'HR 컨설턴트'],
  photo: profileCho,

  career: [
    { company: '현대카드', role: '인사팀', icon: '🏢' },
    { company: '삼성서울병원', role: '인사팀', icon: '🏥' },
  ],

  tagline: '안전 × 노동법 × HR을 하나의 시스템으로',
  subtitle: '현대카드·삼성서울병원 인사팀 출신, 현장을 아는 노무사가 시스템을 설계합니다.',

  specialties: [
    {
      id: 'safety',
      icon: '🛡️',
      area: '산업안전',
      subtitle: '사고를 구조로 막는다',
      credentials: '안전공학 박사',
      details: [
        '안전보건관리체계 구축',
        '중대재해처벌법 대응',
        '위험성평가 설계·운영',
        '근로감독·수사 대응',
      ],
      tone: 'safety',
    },
    {
      id: 'labor',
      icon: '⚖️',
      area: '노동법',
      subtitle: '책임을 법으로 방어한다',
      credentials: '공인노무사 15년',
      details: [
        '근로감독 대비 컨설팅',
        '취업규칙·인사규정 정비',
        '임금체계 설계·방어',
        '부당해고·징계 자문',
      ],
      tone: 'labor',
    },
    {
      id: 'hr',
      icon: '📊',
      area: 'HR 컨설팅',
      subtitle: '성과를 시스템으로 만든다',
      credentials: '현대카드·삼성서울병원 인사팀 출신',
      details: ['성과관리 시스템 설계', '직무분석·직무평가', '인사제도 개편', '조직문화 진단'],
      tone: 'hr',
    },
  ],

  achievements: [
    {
      metric: '50',
      unit: '여 개사',
      label: '근로감독 대비 컨설팅',
      description: '중소·중견기업 근로감독 사전 점검 및 대응',
    },
    {
      metric: '42',
      unit: '개사',
      label: '중대재해법 대응 체계 구축',
      description: '안전보건관리체계 수립부터 이행 점검까지',
    },
    {
      metric: '152',
      unit: '회',
      label: '기업 강의',
      description: '노동법·산업안전·HR 기업 강의 누적',
    },
  ],

  philosophy: {
    headline: '왜 조대진 노무사인가',
    points: [
      {
        title: '진단이 아니라 시스템을 고칩니다',
        body:
          '벌금을 피하는 것이 목표가 아닙니다. 같은 문제가 반복되지 않는 구조를 설계합니다. 근로감독은 시스템의 부재에서 시작됩니다.',
      },
      {
        title: '세 가지를 동시에 봅니다',
        body:
          '안전사고가 나면 산안법만 보는 전문가, 해고 분쟁이 나면 노동법만 보는 전문가가 대부분입니다. 사고(안전) × 책임(법) × 성과(HR)를 하나로 연결해야 실질적 해결이 됩니다.',
      },
      {
        title: '판례와 데이터로 판단합니다',
        body:
          '경험담이나 감이 아니라, 판례·행정해석·학술 근거에 기반한 판단을 합니다. 법적·학술적으로 방어 가능한 솔루션만 제안합니다.',
      },
    ],
  },

  triadFooter:
    '이 세 영역은 따로 움직이지 않습니다. 사고(안전)가 나면 책임(법)이 따르고, 책임을 줄이려면 성과(HR)가 바뀌어야 합니다.',

  testimonials: [
    {
      quote: '사전에 리스크의 크기와 비용을 알 수 있어서 좋았어요.',
      author: '김○○ 대표',
      company: '제조업 / 직원 38명',
    },
    {
      quote: '무엇을 먼저 해야할지 정확히 가이드해줘서 좋았어요.',
      author: '김○○ 대표',
      company: '제조업 / 직원 38명',
    },
    {
      quote: '세 번째 고객 후기 자리입니다. 다른 업종의 사례를 넣으면 타겟 범위가 넓어집니다.',
      author: '○○○ 대표',
      company: '추후 교체 — 다른 업종 후기 추가 권장',
    },
  ],

  contact: {
    phone: '02-2138-0240',
    email: 'cdj44y@gmail.com',
    calendly: 'https://calendly.com/cdj44y/15min',
    blog: '',
  },

  miniCardLine: '근로감독 대비 컨설팅 50여 개사 수행',
}
