/**
 * @typedef {object} EnrichedItem
 * @property {string} id
 * @property {number} questionIndex
 * @property {string} category
 * @property {number} categoryId
 * @property {string} categoryLabel
 * @property {string} question
 * @property {string} answer
 * @property {boolean|null} isCompliant
 * @property {string} legalBasis
 * @property {string} penaltyType
 * @property {number} penaltyAmount
 * @property {number} fineManwon
 * @property {number} adminManwon
 * @property {string} penaltyDetail
 * @property {string} riskLevel
 * @property {string} improvementGuide
 */

/**
 * @param {EnrichedItem} item
 */
function generateScenario(item) {
  const q = item.question
  const templates = {
    contract: `고용노동부 근로감독관이 「${q}」 관련 서류를 요청합니다. 미비 확인 시 시정명령이 내려지고, 미이행 시 ${item.penaltyDetail}이(가) 부과될 수 있습니다.`,
    wage: `근로자 진정 또는 정기감독으로 「${q}」 위반이 적발될 수 있습니다. ${item.legalBasis} 위반으로 ${item.penaltyDetail}이(가) 부과될 수 있으며, 미지급분 즉시 지급 명령이 내려질 수 있습니다.`,
    worktime: `근로시간 기록 확인 과정에서 「${q}」 위반이 적발될 수 있습니다. ${item.penaltyDetail}이(가) 부과될 수 있습니다.`,
    insurance: `4대보험 가입 현황 점검에서 「${q}」 미이행이 확인될 수 있습니다. 소급 가입·연체금이 부과될 수 있습니다.`,
    safety: `산업안전 점검에서 「${q}」 위반이 적발될 경우, ${item.penaltyDetail}이(가) 부과될 수 있습니다. 중대재해 발생 시 경영책임자 처벌 가능성도 검토됩니다.`,
    etc: `정기 근로감독에서 「${q}」 위반이 확인될 수 있습니다. ${item.penaltyDetail}이(가) 부과될 수 있습니다.`,
  }
  const cat = item.category in templates ? item.category : 'etc'
  return templates[cat]
}

/**
 * @param {EnrichedItem[]} items
 * @param {number} [limit]
 * @returns {(EnrichedItem & { scenario: string })[]}
 */
export function getTopRiskScenarios(items, limit = 3) {
  return items
    .filter((item) => item.isCompliant === false)
    .sort((a, b) => b.penaltyAmount - a.penaltyAmount)
    .slice(0, limit)
    .map((item) => ({
      ...item,
      scenario: generateScenario(item),
    }))
}

export { generateScenario }
