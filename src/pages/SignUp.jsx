import { Link } from 'react-router-dom'

export default function SignUp() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-4 pb-10 pt-6 md:px-6 md:pt-8">
        <header className="mb-6 flex items-center justify-between rounded-2xl border-2 border-zinc-200 bg-white px-4 py-3 shadow-edge md:mb-8 md:px-6">
          <Link to="/" className="flex items-center gap-3 text-ink hover:opacity-80 transition">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-ink bg-white text-xs font-bold text-ink">
              R
            </span>
            <span className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600 md:inline">
              RISK119
            </span>
          </Link>
        </header>

        <div className="flex flex-1 flex-col justify-center">
          <div className="rounded-3xl border-2 border-zinc-200 bg-white p-8 text-center shadow-edge">
            <h1 className="text-xl font-semibold tracking-tight text-ink md:text-2xl">
              회원가입 기능은 준비 중입니다
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
              지금은 로그인 없이도 자가진단과 상담 신청을 모두 이용하실 수 있어요.
              진단 결과는 브라우저에만 저장되니 바로 시작해 보세요.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                to="/diagnosis"
                className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-bold text-white shadow-edge transition hover:bg-zinc-800"
              >
                로그인 없이 자가진단 시작하기
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                홈으로
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
