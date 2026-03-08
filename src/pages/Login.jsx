import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authFetch, setAuth } from '../utils/auth.js'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('이메일과 비밀번호를 입력하세요.')
      return
    }
    setLoading(true)
    try {
      const res = await authFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || '로그인에 실패했습니다.')
        return
      }
      setAuth(data.token, data.user)
      navigate('/', { replace: true })
    } catch (err) {
      setError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도하세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper text-ink">

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-4 pb-10 pt-6 md:px-6 md:pt-8">
        <header className="mb-6 flex items-center justify-between text-xs text-slate-500 md:mb-8">
          <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-secondary via-sky-400 to-emerald-300 text-[11px] font-semibold text-slate-950 shadow-md shadow-secondary/40">
              L
            </span>
            <span className="hidden text-[11px] font-medium uppercase tracking-[0.18em] md:inline">
              Labor Risk Studio
            </span>
          </Link>
          <Link
            to="/signup"
            className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] text-slate-600 hover:bg-slate-100 transition"
          >
            회원가입
          </Link>
        </header>

        <div className="flex flex-1 flex-col justify-center">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card md:p-8">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
              로그인
            </h1>
            <p className="mt-2 text-xs text-slate-600">
              저장된 계정으로 로그인하세요.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error && (
                <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">
                  {error}
                </p>
              )}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  이메일
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/30"
                  placeholder="example@email.com"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  비밀번호
                </label>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/30"
                  placeholder="비밀번호"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-ink py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
              >
                {loading ? '로그인 중…' : '로그인'}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-500">
              계정이 없으신가요?{' '}
              <Link to="/signup" className="font-medium text-secondary hover:underline">
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
