import { Link } from 'react-router-dom'
import { CONTACT_PHONE } from '../constants/contact.js'

// 래피드 '판매할 콘텐츠 링크'에 넣을 전용 페이지 (결제 후 구매자가 보는 화면)
export default function ConsultContent() {
  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#e0f2fe_0,_#f9fafb_45%,_#f9fafb_100%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-12">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_18px_70px_rgba(148,163,184,0.35)] backdrop-blur text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary via-sky-400 to-emerald-300 text-lg font-semibold text-slate-950 shadow-md shadow-secondary/40">
            JD
          </div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
            노무법인 위너스 조대진 노무사
          </p>
          <h1 className="mt-2 text-xl font-semibold text-slate-900 md:text-2xl">
            비대면 상담 신청이 완료되었습니다
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            구매해 주셔서 감사합니다. 조대진 노무사가 입력하신 연락처로
            <br className="hidden sm:block" />
            상담 일정을 안내해 드립니다.
          </p>
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
              유선 문의
            </p>
            <a
              href={`tel:${CONTACT_PHONE}`}
              className="mt-1 block text-lg font-semibold text-slate-900 hover:text-primary"
            >
              {CONTACT_PHONE}
            </a>
          </div>
          <Link
            to="/"
            className="mt-6 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-hover"
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  )
}
