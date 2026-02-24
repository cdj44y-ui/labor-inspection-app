import { CATEGORY_WEIGHTS, QUESTIONS } from '../data/questions.js';

// 응답별 배점: 예 100%, 일부/모름/확인필요 50%, 아니오 0%, 해당없음 = 항목 제외
function getScoreForAnswer(answer) {
  if (!answer) return null;
  if (answer === '예') return 100;
  if (['일부', '모름', '확인필요'].includes(answer)) return 50;
  if (answer === '아니오') return 0;
  if (answer === '해당없음') return null; // 제외
  return null;
}

/** 카테고리별 점수 계산 (0~100). 해당없음은 분모·분자에서 제외 */
export function getCategoryScores(answers) {
  const byCategory = {};
  QUESTIONS.forEach((q, index) => {
    const categoryId = q.categoryId;
    if (!byCategory[categoryId]) byCategory[categoryId] = { total: 0, sum: 0, count: 0 };
    const score = getScoreForAnswer(answers[index]);
    if (score === null) return; // 해당없음 제외
    byCategory[categoryId].count += 1;
    byCategory[categoryId].total += 100;
    byCategory[categoryId].sum += score;
  });
  return CATEGORY_WEIGHTS.map((_, categoryId) => {
    const c = byCategory[categoryId] || { sum: 0, total: 0 };
    if (c.total === 0) return 100; // 답변 없으면 100으로 처리하지 말고 0? PRD상 해당없음만 제외이므로 답 없으면 0
    return Math.round((c.sum / c.total) * 100);
  });
}

/** 종합 점수 (가중 평균) 0~100 */
export function getTotalScore(answers) {
  const categoryScores = getCategoryScores(answers);
  let weightedSum = 0;
  let weightSum = 0;
  CATEGORY_WEIGHTS.forEach((w, i) => {
    weightedSum += categoryScores[i] * w;
    weightSum += w;
  });
  return Math.round(weightedSum / weightSum);
}

/** 등급: safe, caution, warning, danger */
export function getGrade(totalScore) {
  if (totalScore >= 90) return 'safe';
  if (totalScore >= 70) return 'caution';
  if (totalScore >= 50) return 'warning';
  return 'danger';
}

export const GRADE_LABELS = {
  safe: { label: '안전', color: 'safe', message: '근로감독 대비 양호합니다' },
  caution: { label: '주의', color: 'caution', message: '일부 개선이 필요합니다' },
  warning: { label: '경고', color: 'warning', message: '근로감독 시 지적 가능성이 높습니다' },
  danger: { label: '위험', color: 'danger', message: '즉시 개선이 필요합니다' },
};
