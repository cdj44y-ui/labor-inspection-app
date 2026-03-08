import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { saveEncryptedSession, loadEncryptedSession } from './cryptoStore.js'
import { registerUser, loginUser, getSessionUser, logoutUser } from './authDb.js'

const app = express()
const port = process.env.PORT || 8787

app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
)
app.use(express.json())

// 로그인/회원가입 API
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    const { token, user } = await registerUser(email, password)
    return res.status(201).json({ token, user })
  } catch (err) {
    const message = err.message || '회원가입 중 오류가 발생했습니다.'
    return res.status(400).json({ error: message })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    const { token, user } = await loginUser(email, password)
    return res.json({ token, user })
  } catch (err) {
    const message = err.message || '로그인 중 오류가 발생했습니다.'
    return res.status(401).json({ error: message })
  }
})

app.get('/api/auth/me', (req, res) => {
  const auth = req.headers.authorization
  const token = auth && auth.startsWith('Bearer ') ? auth.slice(7) : null
  const user = getSessionUser(token)
  if (!user) return res.status(401).json({ error: '로그인이 필요합니다.' })
  return res.json({ user })
})

app.post('/api/auth/logout', (req, res) => {
  const auth = req.headers.authorization
  const token = auth && auth.startsWith('Bearer ') ? auth.slice(7) : null
  logoutUser(token)
  return res.json({ ok: true })
})

// 민감 데이터 암호화 저장용 엔드포인트
// 예: 사업장 정보 + 진단 결과를 하나의 세션으로 저장
app.post('/api/secure-sessions', (req, res) => {
  try {
    const { business, answers, resultSummary } = req.body || {}
    if (!business && !answers && !resultSummary) {
      return res.status(400).json({ error: '저장할 데이터가 필요합니다.' })
    }
    const id = saveEncryptedSession({ business, answers, resultSummary })
    return res.status(201).json({ id })
  } catch (err) {
    console.error('암호화 세션 저장 오류:', err)
    return res.status(500).json({ error: '암호화 저장 중 오류가 발생했습니다.' })
  }
})

app.get('/api/secure-sessions/:id', (req, res) => {
  try {
    const session = loadEncryptedSession(req.params.id)
    if (!session) {
      return res.status(404).json({ error: '세션을 찾을 수 없습니다.' })
    }
    return res.json(session)
  } catch (err) {
    console.error('암호화 세션 조회 오류:', err)
    return res.status(500).json({ error: '암호화 세션 조회 중 오류가 발생했습니다.' })
  }
})

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`)
})

