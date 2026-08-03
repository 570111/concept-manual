// 生成一个新的访问密钥，追加进 src/data/accessKeys.ts，并把明文密钥打印出来（只会显示这一次，交给买家后就不再保存明文）。
// 用法: node --experimental-loader ./scripts/ts-ext-loader.mjs ./scripts/add-key.mjs "买家备注"
import { accessKeys } from '../src/data/accessKeys.ts'
import { deriveHash, randomSaltHex, normalizeKey } from '../src/lib/auth.ts'
import { writeFileSync } from 'node:fs'

const label = process.argv[2] || `key-${Date.now()}`

function randomKey() {
  const bytes = crypto.getRandomValues(new Uint8Array(8))
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
  return `PJSC-${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}`
}

const plainKey = randomKey()
const normalized = normalizeKey(plainKey)
const salt = randomSaltHex()
const hash = await deriveHash(normalized, salt)

const updated = [...accessKeys, { label, salt, hash }]

const fileContent = `// 访问密钥列表 —— 不要在这里手写明文密钥，用 scripts/add-key.mjs 生成并自动追加到这个文件。
// label 只是给你自己看的备注（比如买家昵称/订单号），不参与校验。
export type AccessKeyEntry = { label: string; salt: string; hash: string }

export const accessKeys: AccessKeyEntry[] = ${JSON.stringify(updated, null, 2)}
`

writeFileSync(new URL('../src/data/accessKeys.ts', import.meta.url), fileContent)

console.log('新密钥已生成并写入 src/data/accessKeys.ts')
console.log('备注:', label)
console.log('明文密钥（只显示这一次，请立即复制发给买家）:')
console.log('  ' + plainKey)
console.log('\n记得跑 npm run build 确认没问题，再 git commit + push 让网站生效。')
