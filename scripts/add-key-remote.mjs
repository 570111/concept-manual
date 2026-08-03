// 生成一个新的访问密钥，写进 Supabase 的 access_keys 表（服务端哈希，不落地明文）。
// 用法：
//   SUPABASE_URL=https://xxxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=xxxx \
//   node ./scripts/add-key-remote.mjs "买家备注"
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('请设置环境变量 SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY 后再运行。')
  process.exit(1)
}

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
const supabase = createClient(url, key)
const { error } = await supabase.rpc('add_access_key', { input_label: label, plain_key: plainKey })
if (error) {
  console.error('生成失败:', error.message)
  process.exit(1)
}

console.log('新密钥已写入数据库')
console.log('备注:', label)
console.log('明文密钥（只显示这一次，请立即复制发给买家）:')
console.log('  ' + plainKey)
