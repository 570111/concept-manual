import { createClient } from '@supabase/supabase-js'

// anon key 是 Supabase 设计上就允许公开的（真正的访问控制在数据库的行级安全策略和函数权限上），
// 可以放心提交到代码仓库，不是需要保密的密钥。
const SUPABASE_URL = 'https://wlhtepflrjfxoyktomdg.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_qnE0TruHztZHUWyoEFB5oQ_qUuKb9Nc'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
