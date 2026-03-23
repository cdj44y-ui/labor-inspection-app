import {
  WORKER_STATUS_QUESTIONS,
  WORKER_STATUS_CATEGORIES,
  PRESUMPTION_QUESTION_IDS,
  PRESUMPTION_LABELS,
} from '../data/workerStatusData.js'

/** @param {(number|null)[]} answers - 각 문항 선택지 인덱스 */
export function getWorkerStatusMaxScore() {
  return WORKER_STATUS_QUESTIONS.reduce((s, q) => s + q.weight * 5, 0)
}

export function getWorkerStatusTotalScore(answers) {
  let total = 0
  WORKER_STATUS_QUESTIONS.forEach((q, i) => {
    const idx = answers[i]
    if (idx == null || !q.options[idx]) return
    total += q.options[idx].score * q.weight
  })
  return total
}

/** 0~100 퍼센트 (근로자성 쪽으로 갈수록 높음) */
export function getWorkerStatusPercent(answers) {
  const max = getWorkerStatusMaxScore()
  if (max <= 0) return 0
  const raw = (getWorkerStatusTotalScore(answers) / max) * 100
  return Math.min(100, Math.max(0, Math.round(raw * 10) / 10))
}

/** @returns {{ id: 'worker'|'gray'|'freelancer', title: string, body: string }} */
export function getWorkerStatusVerdict(pct) {
  if (pct >= 65) {
    return {
      id: 'worker',
      title: '근로자 가능성 높음',
      body: '사용종속성 관련 판단요소에 비추어 근로기준법상 근로자에 해당할 가능성이 높다고 볼 수 있습니다. 계약 형식과 무관하게 실질관계가 중요합니다.',
    }
  }
  if (pct >= 40) {
    return {
      id: 'gray',
      title: '판단 유보 (회색지대)',
      body: '근로자·사업자 양측 요소가 혼재합니다. 개별 사실관계에 따라 결론이 달라질 수 있어 전문가 정밀 분석이 필요합니다.',
    }
  }
  return {
    id: 'freelancer',
    title: '프리랜서(사업자) 가능성 높음',
    body: '독립적 사업 수행 특성이 강해 근로자 인정이 어려울 수 있습니다. 다만 실질관계가 바뀌면 재점검이 필요합니다.',
  }
}

/** 카테고리별 누적 점수 / 최대 */
export function getWorkerStatusCategoryBreakdown(answers) {
  return WORKER_STATUS_CATEGORIES.map((cat) => {
    const qs = WORKER_STATUS_QUESTIONS.filter((q) => q.categoryId === cat.id)
    let score = 0
    let max = 0
    qs.forEach((q) => {
      const globalIndex = WORKER_STATUS_QUESTIONS.indexOf(q)
      max += q.weight * 5
      const idx = answers[globalIndex]
      if (idx != null && q.options[idx]) score += q.options[idx].score * q.weight
    })
    const pct = max > 0 ? Math.round((score / max) * 1000) / 10 : 0
    return { name: cat.name, short: cat.short, score, max, pct }
  })
}

/**
 * 자가진단용: 선택지 점수가 3 이상이면 ‘핵심 지표 충족’으로 카운트 (실제 입법 기준과 다를 수 있음)
 */
export function getPresumptionChecklist(answers) {
  const items = PRESUMPTION_QUESTION_IDS.map((qid, i) => {
    const qIndex = WORKER_STATUS_QUESTIONS.findIndex((q) => q.id === qid)
    const q = WORKER_STATUS_QUESTIONS[qIndex]
    const optIdx = qIndex >= 0 ? answers[qIndex] : null
    let met = false
    if (q && optIdx != null && q.options[optIdx]) {
      met = q.options[optIdx].score >= 3
    }
    return { qid, met, label: PRESUMPTION_LABELS[i] ?? qid }
  })
  const metCount = items.filter((x) => x.met).length
  return { items, metCount }
}
