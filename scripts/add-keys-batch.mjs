// 批量生成访问密钥，写入 Supabase，并把结果导出成一份 CSV（明文密钥只在这份文件里出现一次）。
// 用法：
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node ./scripts/add-keys-batch.mjs 100 "批次A"
import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'node:fs'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('请设置环境变量 SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY 后再运行。')
  process.exit(1)
}

const count = parseInt(process.argv[2] || '100', 10)
const prefix = process.argv[3] || 'batch'

function randomKey() {
  const bytes = crypto.getRandomValues(new Uint8Array(8))
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
  return `PJSC-${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}`
}

const supabase = createClient(url, key)
const rows = []

for (let i = 1; i <= count; i++) {
  const label = `${prefix}-${String(i).padStart(3, '0')}`
  const plainKey = randomKey()
  const { error } = await supabase.rpc('add_access_key', { input_label: label, plain_key: plainKey })
  if (error) {
    console.error(`第 ${i} 个失败:`, error.message)
    continue
  }
  rows.push({ label, plainKey })
  process.stdout.write(`\r已生成 ${i}/${count}`)
}
console.log('')

const csv = ['label,key', ...rows.map((r) => `${r.label},${r.plainKey}`)].join('\n')
const outPath = new URL(`../${prefix}-keys.csv`, import.meta.url)
writeFileSync(outPath, csv)

console.log(`\n完成，共写入 ${rows.length} 个密钥。`)
console.log(`明文密钥列表已保存到: ${prefix}-keys.csv（这个文件不会被提交到git，注意自己保管好，分发完可以删掉本地这份）`)
