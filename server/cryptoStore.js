import Database from 'better-sqlite3'
import crypto from 'crypto'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// DB 파일은 서버 디렉터리 하위에 생성
const dbPath = path.join(__dirname, 'secure-data.sqlite')
const db = new Database(dbPath)

// 최초 실행 시 테이블 생성
db.exec(`
  CREATE TABLE IF NOT EXISTS encrypted_sessions (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    ciphertext TEXT NOT NULL,
    iv TEXT NOT NULL,
    tag TEXT NOT NULL
  );
`)

const encKeyBase64 = process.env.DATA_ENC_KEY
if (!encKeyBase64) {
  // 개발 단계에서는 콘솔 경고만, 실제 운영 시에는 필수
  console.warn('[cryptoStore] DATA_ENC_KEY 환경 변수가 설정되어 있지 않습니다. 암호화 기능이 비활성화됩니다.')
}

function getKeyBuffer() {
  if (!encKeyBase64) return null
  const key = Buffer.from(encKeyBase64, 'base64')
  if (key.length !== 32) {
    console.warn('[cryptoStore] DATA_ENC_KEY는 32바이트(base64 인코딩)여야 합니다.')
    return null
  }
  return key
}

export function saveEncryptedSession(payload) {
  const key = getKeyBuffer()
  if (!key) {
    throw new Error('DATA_ENC_KEY 미설정 또는 형식 오류')
  }

  const id = crypto.randomUUID()
  const iv = crypto.randomBytes(12) // GCM 권장 96비트
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const json = JSON.stringify(payload)
  const encrypted = Buffer.concat([cipher.update(json, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()

  const stmt = db.prepare(
    'INSERT INTO encrypted_sessions (id, created_at, ciphertext, iv, tag) VALUES (?, datetime("now"), ?, ?, ?)',
  )
  stmt.run(id, encrypted.toString('base64'), iv.toString('base64'), tag.toString('base64'))

  return id
}

export function loadEncryptedSession(id) {
  const key = getKeyBuffer()
  if (!key) {
    throw new Error('DATA_ENC_KEY 미설정 또는 형식 오류')
  }

  const row = db
    .prepare('SELECT id, created_at, ciphertext, iv, tag FROM encrypted_sessions WHERE id = ?')
    .get(id)
  if (!row) return null

  const iv = Buffer.from(row.iv, 'base64')
  const tag = Buffer.from(row.tag, 'base64')
  const ciphertext = Buffer.from(row.ciphertext, 'base64')

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(tag)
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()])

  const payload = JSON.parse(decrypted.toString('utf8'))
  return { id: row.id, createdAt: row.created_at, payload }
}

