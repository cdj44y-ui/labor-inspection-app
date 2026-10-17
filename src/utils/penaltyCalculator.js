import { QUESTIONS, CATEGORIES } from '../data/questions.js'
import { getPenaltyMeta, CATEGORY_LABELS } from '../data/penalties.js'

function isNonCompliant(answer) {
  return answer === '아니오' || ['일부', '모름', '확인필요'].includes(answer)
}

/**
 * @param {string[]} answers
 * @returns {import('./scenarioGenerator.js').EnrichedItem[]}
 */
export function buildEnrichedItems(answers) {
  return QUESTIONS.map((q, i) => {
    const answer = answers[i]
    const meta = getPenaltyMeta(i)
    const categoryKey = meta.categoryKey
    const compliant = answer === '예' || answer === '해당없음' ? true : answer ? !isNonCompliant(answer) : null
    return {
      id: `q-${i}`,
      questionIndex: i,
      category: categoryKey,
      categoryId: q.categoryId,
      categoryLabel: CATEGORY_LABELS[categoryKey] || CATEGORIES[q.categoryId]?.name,
      question: q.text,
      answer,
      isCompliant: compliant,
      legalBasis: meta.legalBasis,
      penaltyType: meta.penaltyType,
      penaltyAmount: meta.penaltyAmount,
      fineManwon: meta.fineManwon,
      adminManwon: meta.adminManwon,
      penaltyDetail: meta.penaltyDetail,
      riskLevel: meta.riskLevel,
      improvementGuide: meta.improvementGuide,
    }
  })
}

/**
 * 미충족 항목만, 해당없음 제외
 * @param {ReturnType<typeof buildEnrichedItems>} items
 */
export function filterViolations(items) {
  return items.filter((item) => item.isCompliant === false)
}

/**
 * @param {ReturnType<typeof filterViolations>} violations
 */
export function aggregatePenaltyTotals(violations) {
  let fineSum = 0
  let adminSum = 0
  for (const v of violations) {
    fineSum += v.fineManwon || 0
    adminSum += v.adminManwon || 0
  }
  const total = fineSum + adminSum
  return { total, fineSum, adminSum }
}

/**
 * 영역별 그룹
 * @param {ReturnType<typeof filterViolations>} violations
 */
export function groupByCategory(violations) {
  /** @type {Record<string, typeof violations>} */
  const map = {}
  for (const v of violations) {
    const k = v.category
    if (!map[k]) map[k] = []
    map[k].push(v)
  }
  return map
}

/** 점수 구간 안내. bucketIndex는 UI에서 4단계 세그먼트 중 활성 구간을 표시하기 위한 보조값(0~3). */
export function getIndustryComparisonHint(totalScore) {
  // 업계 통계 없이 백분위를 표시하지 않음 — 점수 구간만 안내(2026-10-17)
  if (totalScore >= 90) return { percentile: '90점 이상', hint: '기본 항목을 대부분 갖추고 있습니다.', bucketIndex: 0 }
  if (totalScore >= 70) return { percentile: '70~89점', hint: '일부 항목에 보완이 필요합니다.', bucketIndex: 1 }
  if (totalScore >= 50) return { percentile: '50~69점', hint: '여러 항목에서 위반 소지가 있어 점검이 필요합니다.', bucketIndex: 2 }
  return { percentile: '50점 미만', hint: '주요 항목 다수가 미비해 즉시 점검이 필요합니다.', bucketIndex: 3 }
}

export { CATEGORY_LABELS }
