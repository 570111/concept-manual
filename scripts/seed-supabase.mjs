// 把本地数据（concepts.ts / conceptContent.ts / quiz.ts）同步进 Supabase 数据库。
// 需要先在 Supabase 控制台跑过 scripts/supabase-setup.sql。
// 用法（在 concept-manual 目录下）：
//   SUPABASE_URL=https://xxxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=xxxx \
//   node --experimental-loader ./scripts/ts-ext-loader.mjs ./scripts/seed-supabase.mjs
// service role key 是敏感凭证，只在本地环境变量里用一次，不要写进代码或提交到git。
import { createClient } from '@supabase/supabase-js'
import { concepts, categoryOrder } from '../src/data/concepts.ts'
import { conceptContent } from '../src/data/conceptContent.ts'
import { quizQuestions } from '../src/data/quiz.ts'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('请设置环境变量 SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY 后再运行。')
  process.exit(1)
}

const supabase = createClient(url, key)

// 计算每个概念在其分类内的顺序，用于地图页/PDF保持和源代码一致的排序
const orderIndex = new Map()
for (const cat of categoryOrder) {
  concepts.filter((c) => c.category === cat).forEach((c, i) => orderIndex.set(c.id, i))
}

const conceptRows = concepts.map((c) => ({
  id: c.id,
  icon: c.icon,
  title: c.title,
  aka: c.aka,
  summary: c.summary,
  category: c.category,
  sort_order: categoryOrder.indexOf(c.category) * 1000 + (orderIndex.get(c.id) ?? 0),
}))

const contentRows = concepts.map((c) => {
  const content = conceptContent[c.id]
  return {
    concept_id: c.id,
    story: content.story,
    explain: content.explain,
    real_case: content.realCase,
    second_case: content.secondCase,
    apply: content.apply,
    misconceptions: content.misconceptions,
    pitfall: content.pitfall,
    self_task: content.selfTask,
    further_reading: content.furtherReading,
    related: content.related,
  }
})

const quizRows = quizQuestions.map((q) => ({
  id: q.id,
  concept_id: q.conceptId,
  difficulty: q.difficulty,
  question: q.question,
  options: q.options,
  correct_index: q.correctIndex,
  explanation: q.explanation,
}))

async function upsert(table, rows, conflictKey) {
  const { error } = await supabase.from(table).upsert(rows, { onConflict: conflictKey })
  if (error) throw new Error(`${table} upsert failed: ${error.message}`)
  console.log(`✓ ${table}: ${rows.length} 行`)
}

await upsert('concepts', conceptRows, 'id')
await upsert('concept_content', contentRows, 'concept_id')
await upsert('quiz_questions', quizRows, 'id')

console.log('\n全部同步完成。')
