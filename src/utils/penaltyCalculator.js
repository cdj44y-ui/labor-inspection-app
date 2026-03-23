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

/** 동종업계 비교용 문구 (추정·참고) */
export function getIndustryComparisonHint(totalScore) {
  if (totalScore >= 90) {
    return { percentile: '하위 ~20%', hint: '유사 규모 사업장 추정 평균 대비 상대적으로 양호한 편입니다.' }
  }
  if (totalScore >= 70) {
    return { percentile: '중위 40~60%', hint: '일부 항목에서 동종 업종 평균 대비 개선 여지가 있습니다.' }
  }
  if (totalScore >= 50) {
    return { percentile: '상위 ~25%', hint: '동종 업종 추정 대비 위반 노출 가능성이 높은 편입니다.' }
  }
  return { percentile: '상위 ~10%', hint: '동종 업종 추정 대비 즉시 점검이 필요한 수준입니다.' }
}

export { CATEGORY_LABELS }
