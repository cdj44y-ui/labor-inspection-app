import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { confirmPayment } from '../api/payments'
import { DIAGNOSIS_CTA_CLASS } from '../constants/contact.js'

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const orderId = searchParams.get('orderId')
    const amount = searchParams.get('amount')
    const paymentKey = searchParams.get('paymentKey')

    if (!orderId || !amount || !paymentKey) {
      setError('결제 정보가 없습니다.')
      return
    }

    confirmPayment(paymentKey, orderId, amount)
      .then(setResult)
      .catch((e) => setError(e.message))
  }, [searchParams])

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-lg px-4 py-12 md:px-8">
        <div className="rounded-2xl border-2 border-zinc-200 bg-white p-8 shadow-edge">
          {result && (
            <>
              <h1 className="text-xl font-bold text-ink">결제 성공</h1>
              <p className="mt-4 text-sm text-zinc-600">
                주문번호: {searchParams.get('orderId')}
              </p>
              <p className="mt-1 text-sm text-zinc-600">
                이용 기간: ~ {result.expiresAt ? new Date(result.expiresAt).toLocaleDateString('ko-KR') : '-'}
              </p>
              <Link
                to="/"
                className={`mt-8 inline-block w-full px-4 py-3 text-center text-sm font-bold ${DIAGNOSIS_CTA_CLASS}`}
              >
                홈으로
              </Link>
            </>
          )}
          {error && (
            <>
              <h1 className="text-xl font-bold text-red-700">결제 확인 실패</h1>
              <p className="mt-4 text-sm text-zinc-600">{error}</p>
              <Link
                to="/pricing"
                className="mt-8 inline-block w-full px-4 py-3 text-center text-sm font-bold text-zinc-700 underline"
              >
                요금제로 돌아가기
              </Link>
            </>
          )}
          {!result && !error && (
            <p className="text-zinc-600">결제를 확인하는 중…</p>
          )}
        </div>
      </div>
    </div>
  )
}
