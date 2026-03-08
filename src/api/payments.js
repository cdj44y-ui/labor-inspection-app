const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' }
  if (SUPABASE_ANON_KEY) headers['Authorization'] = `Bearer ${SUPABASE_ANON_KEY}`
  return headers
}

/** POST /functions/v1/checkout → { orderId, amount, planName, customerEmail } */
export async function checkout(planId, customerEmail = '') {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/checkout`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ planId, customerEmail }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Checkout failed')
  return data
}

/** POST /functions/v1/confirm → { ok, planId, expiresAt } */
export async function confirmPayment(paymentKey, orderId, amount) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/confirm`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || data.message || 'Confirm failed')
  return data
}
