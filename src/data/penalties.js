import { QUESTIONS } from './questions.js'

/** 명세서 Category ↔ 내부 카테고리 ID 매핑 */
export const CATEGORY_KEY_BY_ID = [
  'contract',
  'wage',
  'worktime',
  'safety',
  'etc',
  'etc',
  'insurance',
]

export const CATEGORY_LABELS = {
  contract: '근로계약',
  wage: '임금·퇴직금',
  worktime: '근로시간·휴일·휴가',
  insurance: '4대보험',
  safety: '산업안전',
  etc: '기타 노무관리',
}

// 카테고리 기본값: 문항별 처벌이 원문으로 확인되지 않은 항목은 금액을 합산하지 않음(2026-10-17)
const BASE_META = {
  contract: {
    penaltyType: 'fine',
    penaltyAmount: 0,
    fineManwon: 0,
    adminManwon: 0,
    penaltyDetail: '해당 조문에 따른 제재',
    riskLevel: 'medium',
    improvementGuide: '근로계약서 필수 기재·서면 교부·명부·취업규칙 등 증빙을 정비하세요.',
  },
  wage: {
    penaltyType: 'both',
    penaltyAmount: 0,
    fineManwon: 0,
    adminManwon: 0,
    penaltyDetail: '해당 조문에 따른 제재',
    riskLevel: 'high',
    improvementGuide: '임금대장·명세서·가산수당·퇴직금 산정과 지급 기준을 점검하세요.',
  },
  worktime: {
    penaltyType: 'fine',
    penaltyAmount: 0,
    fineManwon: 0,
    adminManwon: 0,
    penaltyDetail: '해당 조문에 따른 제재',
    riskLevel: 'high',
    improvementGuide: '근로시간 기록·연장·휴일·연차 운영을 법정 기준에 맞추세요.',
  },
  safety: {
    penaltyType: 'penalty',
    penaltyAmount: 0,
    fineManwon: 0,
    adminManwon: 0,
    penaltyDetail: '해당 조문에 따른 제재',
    riskLevel: 'high',
    improvementGuide: '안전보건교육·위험성평가·보건관리체계와 기록을 갖추세요.',
  },
  etc: {
    penaltyType: 'penalty',
    penaltyAmount: 0,
    fineManwon: 0,
    adminManwon: 0,
    penaltyDetail: '해당 조문에 따른 제재',
    riskLevel: 'medium',
    improvementGuide: '내부 규정·교육·고충처리 절차를 문서화하고 이행하세요.',
  },
  insurance: {
    penaltyType: 'both',
    penaltyAmount: 0,
    fineManwon: 0,
    adminManwon: 0,
    penaltyDetail: '해당 조문에 따른 제재',
    riskLevel: 'high',
    improvementGuide: '가입 대상·취득신고·보험료 납부를 누락 없이 관리하세요.',
  },
}

/** 문항 인덱스별 세부 제재(주요 항목). 없으면 카테고리 기본값 사용 */
const INDEX_OVERRIDES = {
  0: {
    penaltyDetail: '500만원 이하 벌금',
    legalBasis: '근로기준법 제17조, 제114조',
    penaltyAmount: 500,
    fineManwon: 500,
    adminManwon: 0,
    penaltyType: 'fine',
  },
  1: {
    penaltyDetail: '500만원 이하 벌금',
    legalBasis: '근로기준법 제17조, 제114조',
    penaltyAmount: 500,
    fineManwon: 500,
    adminManwon: 0,
    penaltyType: 'fine',
  },
  5: {
    penaltyDetail: '500만원 이하 과태료',
    legalBasis: '근로기준법 제93조',
    penaltyAmount: 500,
    fineManwon: 0,
    adminManwon: 500,
    penaltyType: 'penalty',
  },
  8: {
    penaltyDetail: '3년 이하 징역 또는 2,000만원 이하 벌금(병과 가능)',
    legalBasis: '최저임금법 제6조, 제28조 제1항',
    penaltyAmount: 2000,
    fineManwon: 2000,
    adminManwon: 0,
    penaltyType: 'fine',
  },
  9: {
    penaltyDetail: '5년 이하 징역 또는 5,000만원 이하 벌금',
    legalBasis: '근로기준법 제43조, 제107조 — 2026.10.8. 시행 개정(법률 제21533호): 제109조(3년/3천만원)에서 제107조(5년/5천만원)로 벌칙 이관·상향',
    penaltyAmount: 5000,
    fineManwon: 5000,
    adminManwon: 0,
    penaltyType: 'fine',
  },
  18: {
    penaltyDetail: '2년 이하 징역 또는 2,000만원 이하 벌금',
    legalBasis: '근로기준법 제50조, 제110조',
    penaltyAmount: 2000,
    fineManwon: 2000,
    adminManwon: 0,
    penaltyType: 'fine',
  },
  29: {
    penaltyDetail: '1,000만원 이하 과태료 — 시행 전: 2027.1.1 시행(상시 50명 이상, 건설업 공사금액 50억원 이상), 2028.1.1 시행(그 미만)',
    legalBasis: '산업안전보건법 제36조, 제175조, 부칙(법률 제21374호, 2026.2.19.) 제1조',
    penaltyAmount: 0,
    fineManwon: 0,
    adminManwon: 0,
    penaltyType: 'penalty',
  },
  48: {
    penaltyDetail: '각 보험법에 따른 과태료와 미납 보험료 소급 징수',
    legalBasis: '국민건강보험법, 국민연금법, 고용보험법, 산재보험법',
    penaltyAmount: 0,
    fineManwon: 0,
    adminManwon: 0,
    penaltyType: 'both',
  },
}

function localIndexInCategory(questionIndex) {
  const cid = QUESTIONS[questionIndex].categoryId
  let n = 0
  for (let i = 0; i < questionIndex; i++) {
    if (QUESTIONS[i].categoryId === cid) n += 1
  }
  return n
}

function resolveCategoryKey(questionIndex) {
  const q = QUESTIONS[questionIndex]
  if (q.categoryId === 6 && localIndexInCategory(questionIndex) >= 3) {
    return 'etc'
  }
  return CATEGORY_KEY_BY_ID[q.categoryId]
}

/**
 * 문항별 제재·가이드 메타 (만원 단위 금액)
 * @param {number} questionIndex
 */
export function getPenaltyMeta(questionIndex) {
  const q = QUESTIONS[questionIndex]
  const key = resolveCategoryKey(questionIndex)
  const base = { ...BASE_META[key] }
  const override = INDEX_OVERRIDES[questionIndex]
  const merged = { ...base, ...override }
  merged.legalBasis = merged.legalBasis || q.law
  merged.categoryKey = key
  merged.penaltyAmount =
    merged.penaltyAmount ??
    Math.max(merged.fineManwon + merged.adminManwon, merged.fineManwon, merged.adminManwon)
  return merged
}

/** 진단·결과 화면 노출용: 법령 원문으로 검증된 문항별 처벌만 반환 (카테고리 기본값 제외, 시행 전 조항은 시행일 명기) */
const VERIFIED_PENALTY_INDEXES = [0, 1, 5, 8, 9, 18, 29]
export function getVerifiedPenalty(questionIndex) {
  if (!VERIFIED_PENALTY_INDEXES.includes(questionIndex)) return null
  const o = INDEX_OVERRIDES[questionIndex]
  if (!o) return null
  return { penaltyDetail: o.penaltyDetail, legalBasis: String(o.legalBasis).split(' — ')[0] }
}
