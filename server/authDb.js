import Database from 'better-sqlite3'
import crypto from 'crypto'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbPath = path.join(__dirname, 'secure-data.sqlite')
const db = new Database(dbPath)

const SALT_LEN = 16
const KEY_LEN = 64
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1 }

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
`)

function hashPassword(plain, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(plain, salt, KEY_LEN, SCRYPT_OPTIONS, (err, derived) => {
      if (err) reject(err)
      else resolve(derived.toString('base64'))
    })
  })
}

export async function registerUser(email, password) {
  const trimmed = String(email).trim().toLowerCase()
  if (!trimmed || !password || password.length < 6) {
    throw new Error('이메일과 비밀번호(6자 이상)를 입력하세요.')
  }
  const salt = crypto.randomBytes(SALT_LEN).toString('base64')
  const passwordHash = await hashPassword(password, salt)
  const id = crypto.randomUUID()
  try {
    db.prepare(
      'INSERT INTO users (id, email, password_hash, salt) VALUES (?, ?, ?, ?)',
    ).run(id, trimmed, passwordHash, salt)
  } catch (e) {
    if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw new Error('이미 사용 중인 이메일입니다.')
    }
    throw e
  }
  return { id, email: trimmed }
}

export async function loginUser(email, password) {
  const trimmed = String(email).trim().toLowerCase()
  const row = db.prepare('SELECT id, email, password_hash, salt FROM users WHERE email = ?').get(trimmed)
  if (!row) {
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
  }
  const expected = await hashPassword(password, row.salt)
  if (expected !== row.password_hash) {
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
  }
  const token = crypto.randomBytes(32).toString('hex')
  db.prepare('INSERT INTO sessions (id, user_id) VALUES (?, ?)').run(token, row.id)
  return { token, user: { id: row.id, email: row.email } }
}

export function getSessionUser(token) {
  if (!token || typeof token !== 'string') return null
  const row = db
    .prepare(
      `SELECT u.id, u.email FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.id = ?`,
    )
    .get(token.trim())
  return row ? { id: row.id, email: row.email } : null
}

export function logoutUser(token) {
  if (!token) return
  db.prepare('DELETE FROM sessions WHERE id = ?').run(token.trim())
}
