// 吊销一个密钥（按创建时填的备注查找），立即生效——已登录的用户下次刷新/重新验证就会失效。
// 用法：
//   SUPABASE_URL=https://xxxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=xxxx \
//   node ./scripts/revoke-key-remote.mjs "买家备注"
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('请设置环境变量 SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY 后再运行。')
  process.exit(1)
}

const label = process.argv[2]
if (!label) {
  console.error('用法: node ./scripts/revoke-key-remote.mjs "买家备注"')
  process.exit(1)
}

const supabase = createClient(url, key)
const { error } = await supabase.rpc('revoke_access_key', { target_label: label })
if (error) {
  console.error('吊销失败:', error.message)
  process.exit(1)
}
console.log(`已吊销备注为"${label}"的密钥。`)
