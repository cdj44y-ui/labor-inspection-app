import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authFetch, setAuth } from '../utils/auth.js'

export default function SignUp() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) {
      setError('이메일을 입력하세요.')
      return
    }
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    setLoading(true)
    try {
      const res = await authFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || '회원가입에 실패했습니다.')
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
        <header className="mb-6 flex items-center justify-between rounded-2xl border-2 border-zinc-200 bg-white px-4 py-3 shadow-edge md:mb-8 md:px-6">
          <Link to="/" className="flex items-center gap-3 text-ink hover:opacity-80 transition">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-ink bg-white text-xs font-bold text-ink">
              L
            </span>
            <span className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600 md:inline">
              Labor Risk Studio
            </span>
          </Link>
          <Link
            to="/login"
            className="rounded-full border-2 border-zinc-300 bg-zinc-50 px-3 py-1.5 text-[11px] font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            로그인
          </Link>
        </header>

        <div className="flex flex-1 flex-col justify-center">
          <div className="rounded-3xl border-2 border-zinc-200 bg-white p-6 shadow-edge md:p-8">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
              회원가입
            </h1>
            <p className="mt-2 text-xs text-slate-600">
              이메일과 비밀번호만으로 가입할 수 있습니다.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error && (
                <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">
                  {error}
                </p>
              )}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  이메일 <span className="text-rose-400">*</span>
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
                  비밀번호 <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/30"
                  placeholder="6자 이상"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  비밀번호 확인 <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/30"
                  placeholder="비밀번호 다시 입력"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-ink py-3 text-sm font-semibold text-white shadow-edge transition hover:bg-zinc-800 disabled:opacity-60"
              >
                {loading ? '가입 중…' : '회원가입'}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-500">
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="font-medium text-secondary hover:underline">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
