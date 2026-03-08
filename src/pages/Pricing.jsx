import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getPlans } from '../api/plans'
import { DIAGNOSIS_CTA_CLASS } from '../constants/contact.js'

export default function Pricing() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getPlans()
      .then(setPlans)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleSelect = (plan) => {
    navigate('/payment', { state: { plan } })
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-4xl px-4 py-12 md:px-8">
        <header className="mb-10 text-center">
          <h1 className="text-display font-bold tracking-tight text-ink md:text-display-md">
            요금제
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            구독 없이 1회 결제로 기간권을 이용할 수 있습니다.
          </p>
        </header>

        {loading && (
          <div className="rounded-2xl border-2 border-zinc-200 bg-white p-12 text-center text-zinc-600">
            로딩 중…
          </div>
        )}
        {error && (
          <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6 text-center text-sm text-red-800">
            {error}
          </div>
        )}
        {!loading && !error && plans.length === 0 && (
          <div className="rounded-2xl border-2 border-zinc-200 bg-white p-12 text-center text-zinc-600">
            등록된 플랜이 없습니다.
          </div>
        )}
        {!loading && !error && plans.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="flex flex-col rounded-2xl border-2 border-zinc-200 bg-white p-6 shadow-edge"
              >
                <h2 className="text-lg font-bold text-ink">{plan.name}</h2>
                <p className="mt-2 text-2xl font-bold text-ink">
                  {Number(plan.amount).toLocaleString()}원
                </p>
                <p className="mt-1 text-xs text-zinc-600">
                  {plan.period_days}일 이용 · 일 {plan.daily_limit}회 제한
                </p>
                <div className="mt-6 flex-1" />
                <button
                  type="button"
                  onClick={() => handleSelect(plan)}
                  className={"mt-4 w-full px-4 py-3 text-sm font-bold " + DIAGNOSIS_CTA_CLASS}
                >
                  선택하기
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="mt-10 text-center">
          <Link to="/" className="text-sm font-medium text-zinc-600 underline hover:text-ink">
            홈으로
          </Link>
        </p>
      </div>
    </div>
  )
}
