import { Link } from 'react-router-dom'
import { CONTACT_PHONE } from '../constants/contact.js'

// 래피드 '판매할 콘텐츠 링크'에 넣을 전용 페이지 (결제 후 구매자가 보는 화면)
export default function ConsultContent() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="relative mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-12">
        <div className="w-full rounded-3xl border-2 border-zinc-200 bg-white p-8 shadow-edge text-center md:p-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-ink bg-white text-lg font-bold text-ink">
            JD
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            노무법인 위너스 조대진 노무사
          </p>
          <h1 className="mt-3 text-xl font-bold tracking-tight text-ink md:text-2xl">
            비대면 상담 신청이 완료되었습니다
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600">
            구매해 주셔서 감사합니다. 조대진 노무사가 입력하신 연락처로 상담 일정을 안내해 드립니다.
          </p>
          <div className="mt-6 rounded-xl border-2 border-zinc-200 bg-zinc-50 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              유선 문의
            </p>
            <a
              href={`tel:${CONTACT_PHONE}`}
              className="mt-1 block text-lg font-bold tracking-tight text-ink hover:opacity-80"
            >
              {CONTACT_PHONE}
            </a>
          </div>
          <Link
            to="/"
            className="mt-8 inline-block rounded-full bg-ink px-8 py-3 text-sm font-bold text-white shadow-edge transition hover:bg-zinc-800"
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  )
}
