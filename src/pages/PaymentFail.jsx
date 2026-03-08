import { useSearchParams, Link } from 'react-router-dom'
import { DIAGNOSIS_CTA_CLASS } from '../constants/contact.js'

export default function PaymentFail() {
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code') || ''
  const message = searchParams.get('message') || '결제에 실패했습니다.'

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-lg px-4 py-12 md:px-8">
        <div className="rounded-2xl border-2 border-zinc-200 bg-white p-8 shadow-edge">
          <h1 className="text-xl font-bold text-ink">결제 실패</h1>
          {code && (
            <p className="mt-4 text-sm text-zinc-600">에러 코드: {code}</p>
          )}
          <p className="mt-1 text-sm text-zinc-600">사유: {message}</p>
          <Link
            to="/pricing"
            className={`mt-8 inline-block w-full px-4 py-3 text-center text-sm font-bold ${DIAGNOSIS_CTA_CLASS}`}
          >
            요금제로 다시 선택
          </Link>
        </div>
      </div>
    </div>
  )
}
