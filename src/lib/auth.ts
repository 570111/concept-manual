import { accessKeys } from '../data/accessKeys'

const PBKDF2_ITERATIONS = 100_000
const SESSION_KEY = 'concept-manual-session'
const SESSION_DAYS = 30

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function hexToBytes(hex: string): Uint8Array {
  const arr = new Uint8Array(hex.length / 2)
  for (let i = 0; i < arr.length; i++) arr[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  return arr
}

export function normalizeKey(key: string): string {
  return key.trim().toUpperCase().replace(/\s+/g, '')
}

export async function deriveHash(key: string, saltHex: string): Promise<string> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(key), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: hexToBytes(saltHex) as BufferSource, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    256,
  )
  return bytesToHex(new Uint8Array(bits))
}

export function randomSaltHex(): string {
  const arr = new Uint8Array(16)
  crypto.getRandomValues(arr)
  return bytesToHex(arr)
}

export async function verifyAccessKey(inputKey: string): Promise<string | null> {
  const normalized = normalizeKey(inputKey)
  if (!normalized) return null
  for (const entry of accessKeys) {
    const hash = await deriveHash(normalized, entry.salt)
    if (hash === entry.hash) return entry.label
  }
  return null
}

type Session = { label: string; exp: number }

export function setSession(label: string) {
  const session: Session = { label, exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000 }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw) as Session
    if (!session.exp || Date.now() > session.exp) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return session
  } catch {
    return null
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}
