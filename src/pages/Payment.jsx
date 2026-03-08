import { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { loadTossPayments, ANONYMOUS } from '@tosspayments/tosspayments-sdk'
import { checkout } from '../api/payments'
import { DIAGNOSIS_CTA_CLASS } from '../constants/contact.js'

const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY || ''

export default function Payment() {
  const location = useLocation()
  const plan = location.state?.plan
  const [checkoutData, setCheckoutData] = useState(null)
  const [widgets, setWidgets] = useState(null)
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(!!plan)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!plan) {
      setError('플랜을 선택해 주세요.')
      setLoading(false)
      return
    }
    checkout(plan.id)
      .then(setCheckoutData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [plan?.id])

  useEffect(() => {
    if (!clientKey) return
    loadTossPayments(clientKey)
      .then((tp) => tp.widgets({ customerKey: ANONYMOUS }))
      .then(setWidgets)
      .catch(() => setError('결제 위젯을 불러올 수 없습니다.'))
  }, [])

  useEffect(() => {
    if (!widgets || !checkoutData) return
    const amount = { currency: 'KRW', value: checkoutData.amount }
    widgets
      .setAmount(amount)
      .then(() =>
        Promise.all([
          widgets.renderPaymentMethods({ selector: '#payment-method', variantKey: 'DEFAULT' }),
          widgets.renderAgreement({ selector: '#agreement', variantKey: 'AGREEMENT' }),
        ])
      )
      .then(() => setReady(true))
      .catch(() => setError('결제 UI를 불러올 수 없습니다.'))
  }, [widgets, checkoutData])

  const handlePayment = async () => {
    if (!widgets || !checkoutData) return
    try {
      await widgets.requestPayment({
        orderId: checkoutData.orderId,
        orderName: checkoutData.planName,
        successUrl: window.location.origin + '/payment/success',
        failUrl: window.location.origin + '/payment/fail',
        customerEmail: checkoutData.customerEmail || undefined,
      })
    } catch (err) {
      setError(err.message || '결제 요청에 실패했습니다.')
    }
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-paper text-ink">
        <div className="mx-auto max-w-lg px-4 py-12 text-center">
          <p className="text-zinc-600">플랜을 선택해 주세요.</p>
          <Link to="/pricing" className="mt-4 inline-block text-sm font-medium text-ink underline">
            요금제 보기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-lg px-4 py-12 md:px-8">
        <h1 className="text-display font-bold tracking-tight text-ink md:text-display-md">
          결제
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          {checkoutData ? checkoutData.planName + ' · ' + (checkoutData.amount && checkoutData.amount.toLocaleString()) + '원' : ''}
        </p>

        {loading && (
          <div className="mt-8 rounded-2xl border-2 border-zinc-200 bg-white p-8 text-center text-zinc-600">
            주문 정보를 불러오는 중…
          </div>
        )}
        {error && (
          <div className="mt-6 rounded-2xl border-2 border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {checkoutData && !error && (
          <div className="mt-8 rounded-2xl border-2 border-zinc-200 bg-white p-6 shadow-edge">
            <div id="payment-method" />
            <div id="agreement" className="mt-4" />
            <button
              type="button"
              disabled={!ready}
              onClick={handlePayment}
              className={"mt-6 w-full px-4 py-3 text-sm font-bold " + DIAGNOSIS_CTA_CLASS + " disabled:opacity-50"}
            >
              결제하기
            </button>
          </div>
        )}

        <p className="mt-8 text-center">
          <Link to="/pricing" className="text-sm font-medium text-zinc-600 underline hover:text-ink">
            요금제로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  )
}
