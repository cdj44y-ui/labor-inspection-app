import { Link } from 'react-router-dom'
import { DIAGNOSIS_CTA_CLASS, CONSULT_BUTTON_CLASS, KAKAO_CHANNEL_URL } from '../../constants/contact.js'
import { buildTallyUrl } from '../../utils/tally.js'

/**
 * @param {{
 *   riskLevelLabel: string,
 *   totalScore?: number,
 *   totalPenaltyManwon: number,
 *   violationSummary: string,
 * }} props
 */
export default function CTASection({ riskLevelLabel, totalScore, totalPenaltyManwon, violationSummary }) {
  const tallyGuideUrl = buildTallyUrl({
    score: totalScore != null ? `${totalScore}점` : undefined,
    grade: riskLevelLabel,
    area: violationSummary,
    items: `예상 과태료·벌금 합계 약 ${totalPenaltyManwon}만원`,
  })

  const tallyCallUrl = buildTallyUrl({
    score: totalScore != null ? `${totalScore}점` : undefined,
    grade: riskLevelLabel,
    area: violationSummary,
    items: `15분 전화상담 요청 · 예상 부담 약 ${totalPenaltyManwon}만원`,
  })

  return (
    <section className="rounded-3xl border-2 border-toss/30 bg-white p-6 shadow-edge md:p-8">
      <h2 className="text-base font-extrabold text-ink md:text-lg">다음 단계</h2>
      <p className="mt-1 text-sm text-zinc-700">부담이 적은 순서로 단계별로 도와드립니다.</p>

      <div className="mt-6 space-y-8">
        {/* 1단계 */}
        <div>
          <p className="text-sm font-bold text-ink">📋 1단계: 무료 개선 가이드 받기</p>
          <div className="mt-3 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4">
            <ul className="space-y-1 text-sm text-zinc-700">
              <li>
                ✓ 귀사 진단 결과({riskLevelLabel} · 예상 부담 약 {totalPenaltyManwon}만원) 기반 맞춤 개선 가이드
              </li>
              <li>✓ 영역별 우선순위 + 법령 근거 포함</li>
            </ul>
            <a
              href={tallyGuideUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={DIAGNOSIS_CTA_CLASS + ' mt-3 inline-flex w-full justify-center px-6 py-3 text-sm sm:w-auto'}
            >
              무료 개선 가이드 받기
            </a>
          </div>
        </div>

        {/* 2단계 */}
        <div>
          <p className="text-sm font-bold text-ink">📞 2단계: 15분 무료 전화상담 요청</p>
          <div className="mt-3 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4">
            <p className="text-sm leading-relaxed text-zinc-800">
              &quot;진단 결과를 바탕으로 핵심 개선 포인트를 15분 안에 짚어드립니다.&quot;
            </p>
            <a
              href={tallyCallUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={DIAGNOSIS_CTA_CLASS + ' mt-3 inline-flex w-full justify-center px-6 py-3 text-sm sm:w-auto'}
            >
              전화상담 요청하기
            </a>
          </div>
        </div>

        {/* 3단계 */}
        <div>
          <p className="text-sm font-bold text-ink">💼 3단계: 근로감독 대비 컨설팅 문의</p>
          <div className="mt-3 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4">
            <p className="text-sm leading-relaxed text-zinc-800">
              &quot;체계적 점검부터 감독관 대응까지, 원스톱으로 준비합니다.&quot;
            </p>
            <Link
              to="/contact"
              className={CONSULT_BUTTON_CLASS + ' mt-3 inline-flex w-full justify-center px-6 py-3 text-sm sm:w-auto'}
            >
              컨설팅 문의하기
            </Link>
          </div>
        </div>
      </div>

      {/* 카카오톡 채널 — 가장 낮은 진입장벽, 법 개정·소식 구독 */}
      <div className="mt-6 rounded-2xl border border-[#FEE500]/60 bg-[#FFFBE6] p-4">
        <p className="text-sm font-bold text-ink">💬 이 결과, 다음 달에도 유효할까요?</p>
        <p className="mt-1 text-sm text-zinc-700">
          법이 바뀌면 오늘 받은 점수도 바뀝니다. 상담은 아직 부담스러우셔도, 채널 추가 한 번이면 근로기준법·중대재해처벌법이 바뀔 때마다 가장 먼저 알려드립니다.
        </p>
        <a
          href={KAKAO_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#FEE500] px-6 py-3 text-sm font-bold text-[#391B1B] shadow-edge transition hover:bg-[#F5D800] sm:w-auto"
        >
          놓치기 전에 채널 추가하기
        </a>
      </div>
    </section>
  )
}
