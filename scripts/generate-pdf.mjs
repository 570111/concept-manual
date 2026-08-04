import { concepts, categoryOrder, categoryInfo } from '../src/data/concepts.ts'
import { conceptContent } from '../src/data/conceptContent.ts'
import { getQuestionsByConcept } from '../src/data/quiz.ts'
import { categoryColor } from '../src/lib/graphLayout.ts'
import { writeFileSync } from 'node:fs'

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const catNumeral = { bias: 'A', social: 'B', economy: 'C', strategy: 'D', systems: 'E', thinking: 'F', communication: 'G' }

// 每道题的正确答案在原始数据里都是选项0（网站端靠前端随机打乱），静态PDF要在生成时就固定打乱一次，
// 否则印出来的答案会全部是"A"。用题目id做种子，保证每次重新生成结果一致。
function hashSeed(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffledQuestion(q) {
  const rand = mulberry32(hashSeed(q.id))
  const arr = q.options.map((text, i) => ({ text, isCorrect: i === q.correctIndex }))
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return { options: arr.map((x) => x.text), correctIndex: arr.findIndex((x) => x.isCorrect) }
}

function coverPage() {
  const chips = categoryOrder
    .map(
      (cat) =>
        `<a class="cover-chip" href="#cat-${cat}" style="border-color:${categoryColor[cat]}44;color:${categoryColor[cat]}">
          <span class="dot" style="background:${categoryColor[cat]}"></span>${esc(categoryInfo[cat].label)}
        </a>`,
    )
    .join('')
  return `
  <section class="page cover">
    <div class="cover-inner">
      <div class="cover-mark">🔭</div>
      <h1>破局手册</h1>
      <p class="cover-sub">用 ${concepts.length} 个思维模型，看懂生活里那些说不清的规则</p>
      <p class="cover-desc">为什么排队的人越多你越想排？为什么道歉的话术总能戳中你？为什么有些老规矩明明不方便却一直没人改？<br/>
      这些现象背后都有名字、有原理。每个概念用一个生活场景讲透，讲完还告诉你怎么在自己的生活里用上。</p>
      <div class="cover-chips">${chips}</div>
    </div>
    <div class="cover-footer">配套互动练习与关系图谱，访问 570111.github.io/concept-manual</div>
  </section>`
}

function usagePage() {
  return `
  <section class="page usage">
    <h2 class="section-title">如何使用这本手册</h2>
    <div class="usage-grid">
      <div class="usage-item">
        <div class="usage-num">1</div>
        <h3>先读场景</h3>
        <p>每个概念都从一个具体的生活场景开始——先别急着看原理，代入场景想一想"这是不是也发生在我身上"。</p>
      </div>
      <div class="usage-item">
        <div class="usage-num">2</div>
        <h3>再看原理</h3>
        <p>"这是什么"部分讲清楚概念的来源和核心逻辑，用大白话说明白，不需要任何专业背景。</p>
      </div>
      <div class="usage-item">
        <div class="usage-num">3</div>
        <h3>学怎么用</h3>
        <p>每个概念配2-3条具体可执行的应用建议，以及一条"别用错"的边界提醒——理解一个概念，既要知道怎么用，也要知道什么时候不该用。</p>
      </div>
      <div class="usage-item">
        <div class="usage-num">4</div>
        <h3>最后自测</h3>
        <p>全书60个概念对应120道题，统一收在书末"综合自测卷"里，只有题目、不带答案——学完再做，效果比边学边看答案好得多。答案和解析在自测卷后面单独一节。</p>
      </div>
    </div>
    <div class="usage-tip">
      <strong>建议节奏：</strong>每天学1-2个概念，别贪多。60个概念分成A-G共7大类，可以按顺序学，也可以直接跳到你最需要的那一类。
      学完一类，就去自测卷里做对应那一类的题，比全部学完再一次性测验更容易发现薄弱点。
      文中彩色标签是可点击的内部链接（在支持超链接的PDF阅读器/平板中），点"相关概念"或"去做自测题"能直接跳转过去。
    </div>
  </section>`
}

function tocPage() {
  const sections = categoryOrder
    .map((cat) => {
      const items = concepts
        .filter((c) => c.category === cat)
        .map((c) => `<a class="toc-item" href="#concept-${c.id}"><span>${c.icon}</span>${esc(c.title)}</a>`)
        .join('')
      return `
      <div class="toc-section">
        <a class="toc-cat-title" href="#cat-${cat}" style="color:${categoryColor[cat]}">
          <span class="toc-cat-badge" style="background:${categoryColor[cat]}">${catNumeral[cat]}</span>
          ${esc(categoryInfo[cat].label)}
        </a>
        <div class="toc-items">${items}</div>
      </div>`
    })
    .join('')
  return `
  <section class="page toc">
    <h2 class="section-title">目录</h2>
    ${sections}
    <div class="toc-section">
      <a class="toc-cat-title" href="#exam-questions" style="color:#0f172a">
        <span class="toc-cat-badge" style="background:#0f172a">✎</span>
        综合自测卷 + 参考答案与解析
      </a>
    </div>
  </section>`
}

function dividerPage(cat) {
  const items = concepts.filter((c) => c.category === cat)
  return `
  <section class="page divider" id="cat-${cat}" style="background:linear-gradient(160deg, ${categoryColor[cat]}17, #ffffff)">
    <div class="divider-badge" style="background:${categoryColor[cat]}">${catNumeral[cat]}</div>
    <h2 style="color:${categoryColor[cat]}">${esc(categoryInfo[cat].label)}</h2>
    <p class="divider-desc">${esc(categoryInfo[cat].desc)}</p>
    <div class="divider-list">
      ${items.map((c) => `<span class="divider-chip">${c.icon} ${esc(c.title)}</span>`).join('')}
    </div>
  </section>`
}

function conceptPage(c) {
  const content = conceptContent[c.id]
  const color = categoryColor[c.category]
  const applyHtml = content.apply
    .map(
      (a, i) => `
      <div class="apply-item">
        <span class="apply-num" style="background:${color}">${i + 1}</span>
        <div><div class="apply-title">${esc(a.title)}</div><div class="apply-body">${esc(a.body)}</div></div>
      </div>`,
    )
    .join('')
  const relatedHtml = content.related
    .map((id) => {
      const rc = concepts.find((x) => x.id === id)
      if (!rc) return ''
      return `<a class="related-chip" href="#concept-${id}">${rc.icon} ${esc(rc.title)}</a>`
    })
    .join('')
  const misconceptionsHtml = content.misconceptions
    .map((m) => `<div class="misconception-item"><span class="misconception-x">✗</span>${esc(m)}</div>`)
    .join('')
  return `
  <section class="page concept-page" id="concept-${c.id}">
    <div class="concept-header">
      <div class="concept-icon" style="background:${color}22">${c.icon}</div>
      <div>
        <span class="tag" style="background:${color}">${esc(categoryInfo[c.category].label)}</span>
        <h2>${esc(c.title)}</h2>
        <div class="aka">${esc(c.aka)}</div>
      </div>
    </div>

    <div class="story-box">
      <div class="box-label">📖 生活场景</div>
      <p>${esc(content.story)}</p>
    </div>

    <div class="explain-box">
      <div class="box-label" style="color:${color}">这是什么</div>
      <p>${esc(content.explain)}</p>
    </div>

    <div class="realcase-box">
      <div class="box-label">📚 ${esc(content.realCase.title)}</div>
      <p>${esc(content.realCase.body)}</p>
    </div>

    <div class="apply-box">
      <div class="box-label" style="color:${color}">怎么用</div>
      ${applyHtml}
    </div>

    ${misconceptionsHtml ? `<div class="misconception-box"><div class="box-label">常见误解</div>${misconceptionsHtml}</div>` : ''}

    <div class="pitfall-box">
      <div class="box-label">⚠️ 别用错</div>
      <p>${esc(content.pitfall)}</p>
    </div>

    ${relatedHtml ? `<div class="related-row"><span class="related-label">关联概念</span>${relatedHtml}</div>` : ''}

    <a class="quiz-link" href="#quiz-${c.id}" style="border-color:${color}44;color:${color}">🎯 去做这个概念的自测题 →</a>
  </section>`
}

function backCoverPage() {
  return `
  <section class="page cover backcover">
    <div class="cover-inner">
      <div class="cover-mark">🔭</div>
      <h2>想边学边练？</h2>
      <p class="cover-desc">配套网站提供交互式测验、错题本、按分类的关系图谱，还有"今日一个概念"每日打卡。<br/>
      访问 <strong>570111.github.io/concept-manual</strong> 免费使用。</p>
      <p class="backcover-note">本手册内容为通俗化学习资料，不构成专业心理咨询、法律或投资建议。</p>
    </div>
  </section>`
}

function examIntroPage() {
  return `
  <section class="page exam-intro" id="exam-questions">
    <div class="divider-badge" style="background:#0f172a">✎</div>
    <h2>综合自测卷</h2>
    <p class="divider-desc">
      全书60个概念、共120道题，按前面的7大类顺序排列。建议先把整本书学完，再来做这份自测卷——
      每题只标了题号，不标答案，做完一整类/一整份之后，再翻到最后的"参考答案与解析"对答案。<br/><br/>
      也可以从任意一个概念页点"去做这个概念的自测题"直接跳转过来。
    </p>
  </section>`
}

function examQuestionsSection() {
  let n = 0
  const blocks = categoryOrder
    .map((cat) => {
      const items = concepts.filter((c) => c.category === cat)
      const qHtml = items
        .map((c) => {
          const qs = getQuestionsByConcept(c.id)
          return qs
            .map((q, i) => {
              n++
              const anchor = i === 0 ? ` id="quiz-${c.id}"` : ''
              const shuffled = shuffledQuestion(q)
              return `
              <div class="exam-q"${anchor}>
                <div class="exam-q-text"><span class="exam-q-num">${n}.</span> ${esc(q.question)}</div>
                <div class="exam-opts">
                  ${shuffled.options.map((opt, oi) => `<span class="exam-opt">${String.fromCharCode(65 + oi)}. ${esc(opt)}</span>`).join('')}
                </div>
              </div>`
            })
            .join('')
        })
        .join('')
      return `
      <div class="exam-cat">
        <div class="exam-cat-header" style="color:${categoryColor[cat]}">
          <span class="exam-cat-badge" style="background:${categoryColor[cat]}">${catNumeral[cat]}</span>
          ${esc(categoryInfo[cat].label)}
        </div>
        <div class="exam-grid">${qHtml}</div>
      </div>`
    })
    .join('')
  return `<section class="page exam-questions"><h2 class="section-title">自测题目</h2>${blocks}</section>`
}

function answerKeySection() {
  let n = 0
  const blocks = categoryOrder
    .map((cat) => {
      const items = concepts.filter((c) => c.category === cat)
      const aHtml = items
        .map((c) => {
          const qs = getQuestionsByConcept(c.id)
          return qs
            .map((q) => {
              n++
              const shuffled = shuffledQuestion(q)
              return `
              <div class="answer-item">
                <div class="answer-head"><span class="answer-num">${n}.</span> <span class="answer-letter">${String.fromCharCode(65 + shuffled.correctIndex)}</span></div>
                <div class="answer-explain">${esc(q.explanation)}</div>
              </div>`
            })
            .join('')
        })
        .join('')
      return `
      <div class="answer-cat">
        <div class="exam-cat-header" style="color:${categoryColor[cat]}">
          <span class="exam-cat-badge" style="background:${categoryColor[cat]}">${catNumeral[cat]}</span>
          ${esc(categoryInfo[cat].label)}
        </div>
        <div class="answer-grid">${aHtml}</div>
      </div>`
    })
    .join('')
  return `<section class="page answer-key"><h2 class="section-title">参考答案与解析</h2>${blocks}</section>`
}

const css = `
@page { size: A4; margin: 15mm 16mm 16mm 16mm; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: "Microsoft YaHei", "PingFang SC", "Segoe UI", sans-serif;
  color: #1e293b;
  font-size: 9.6pt;
  line-height: 1.5;
}
h1, h2, h3 { margin: 0; }
p { margin: 0.4em 0; }
a { text-decoration: none; color: inherit; }
.page { page-break-after: always; position: relative; }
.page:last-of-type { page-break-after: auto; }

/* Cover */
.cover { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 248mm; text-align: center; }
.cover-inner { max-width: 150mm; }
.cover-mark { font-size: 40pt; }
.cover h1 { font-size: 34pt; font-weight: 800; color: #0f172a; margin-top: 6pt; }
.cover-sub { font-size: 14pt; font-weight: 700; color: #059669; margin-top: 10pt; }
.cover-desc { font-size: 10.5pt; color: #64748b; margin-top: 14pt; line-height: 1.9; }
.cover-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 6pt; margin-top: 22pt; }
.cover-chip { display: flex; align-items: center; gap: 5pt; border: 1.4pt solid; border-radius: 999px; padding: 4pt 12pt; font-size: 9pt; font-weight: 700; }
.cover-chip .dot { width: 6pt; height: 6pt; border-radius: 50%; }
.cover-footer { position: absolute; bottom: 14mm; font-size: 8.5pt; color: #94a3b8; }
.backcover .cover-desc { font-size: 11pt; }
.backcover-note { font-size: 8pt; color: #94a3b8; margin-top: 24pt; }

/* Usage page */
.section-title { font-size: 20pt; font-weight: 800; color: #0f172a; margin-bottom: 14pt; }
.usage-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12pt; }
.usage-item { border: 1.2pt solid #e2e8f0; border-radius: 10pt; padding: 12pt 14pt; }
.usage-num { display: inline-flex; align-items: center; justify-content: center; width: 20pt; height: 20pt; border-radius: 50%; background: #10b981; color: #fff; font-weight: 800; font-size: 10pt; }
.usage-item h3 { font-size: 12pt; margin-top: 8pt; color: #0f172a; }
.usage-item p { font-size: 9.3pt; color: #475569; margin-top: 4pt; }
.usage-tip { margin-top: 18pt; background: #f0fdf4; border: 1.2pt solid #bbf7d0; border-radius: 10pt; padding: 12pt 14pt; font-size: 9.3pt; color: #166534; line-height: 1.8; }

/* TOC */
.toc-section { margin-bottom: 12pt; break-inside: avoid; }
.toc-cat-title { display: flex; align-items: center; gap: 7pt; font-size: 12.5pt; font-weight: 800; margin-bottom: 6pt; }
.toc-cat-badge { display: inline-flex; align-items: center; justify-content: center; width: 16pt; height: 16pt; border-radius: 50%; color: #fff; font-size: 8.5pt; font-weight: 800; }
.toc-items { display: flex; flex-wrap: wrap; gap: 5pt 10pt; padding-left: 23pt; }
.toc-item { font-size: 9.3pt; color: #334155; display: flex; align-items: center; gap: 3pt; }

/* Divider */
.divider { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 248mm; text-align: center; }
.divider-badge { width: 38pt; height: 38pt; border-radius: 50%; color: #fff; font-size: 16pt; font-weight: 800; display: flex; align-items: center; justify-content: center; }
.divider h2 { font-size: 24pt; font-weight: 800; margin-top: 12pt; }
.divider-desc { font-size: 10.5pt; color: #64748b; margin-top: 8pt; max-width: 130mm; line-height: 1.8; }
.divider-list { display: flex; flex-wrap: wrap; justify-content: center; gap: 6pt; margin-top: 20pt; max-width: 150mm; }
.divider-chip { font-size: 8.8pt; background: #f1f5f9; border-radius: 999px; padding: 4pt 10pt; color: #475569; }

/* Concept page */
.concept-header { display: flex; align-items: flex-start; gap: 10pt; margin-bottom: 10pt; }
.concept-icon { width: 34pt; height: 34pt; border-radius: 9pt; font-size: 18pt; display: flex; align-items: center; justify-content: center; flex: none; }
.concept-header h2 { font-size: 17pt; font-weight: 800; margin-top: 3pt; }
.aka { font-size: 8.5pt; color: #94a3b8; margin-top: 1pt; }
.tag { display: inline-block; color: #fff; font-size: 7.8pt; font-weight: 700; padding: 1.5pt 8pt; border-radius: 999px; }
.box-label { font-size: 8.6pt; font-weight: 800; color: #64748b; margin-bottom: 2pt; }
.story-box, .explain-box, .realcase-box, .apply-box, .misconception-box, .pitfall-box { margin-bottom: 6pt; break-inside: avoid; }
.story-box { background: #f8fafc; border-radius: 8pt; padding: 6pt 10pt; font-size: 9pt; color: #334155; }
.explain-box p, .pitfall-box p, .realcase-box p { font-size: 9pt; color: #334155; margin: 0.25em 0; }
.realcase-box { background: #ecfdf5; border-left: 3pt solid #10b981; border-radius: 6pt; padding: 6pt 10pt; }
.realcase-box p { color: #065f46; }
.pitfall-box { background: #fffbeb; border-left: 3pt solid #f59e0b; border-radius: 6pt; padding: 6pt 10pt; }
.misconception-box { display: flex; flex-direction: column; gap: 3pt; }
.misconception-item { display: flex; gap: 5pt; font-size: 8.6pt; color: #64748b; border: 1pt solid #e2e8f0; border-radius: 6pt; padding: 4pt 8pt; }
.misconception-x { flex: none; color: #cbd5e1; }
.apply-item { display: flex; gap: 6pt; margin-top: 4pt; }
.apply-num { flex: none; width: 13pt; height: 13pt; border-radius: 50%; color: #fff; font-size: 7.5pt; font-weight: 800; display: flex; align-items: center; justify-content: center; margin-top: 1pt; }
.apply-title { font-size: 9.2pt; font-weight: 700; color: #0f172a; }
.apply-body { font-size: 8.6pt; color: #64748b; margin-top: 1pt; }
.related-row { display: flex; align-items: center; flex-wrap: wrap; gap: 4pt; margin-bottom: 10pt; }
.related-label { font-size: 8.2pt; color: #94a3b8; font-weight: 700; margin-right: 2pt; }
.related-chip { font-size: 8.2pt; background: #f1f5f9; border-radius: 999px; padding: 2pt 8pt; color: #334155; }
.quiz-link { display: inline-block; border: 1.2pt solid; border-radius: 999px; padding: 4pt 12pt; font-size: 8.6pt; font-weight: 700; }

/* Exam intro */
.exam-intro { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 248mm; text-align: center; }
.exam-intro h2 { font-size: 22pt; font-weight: 800; color: #0f172a; margin-top: 12pt; }

/* Exam questions + answer key */
.exam-cat, .answer-cat { break-before: page; }
.exam-cat:first-of-type, .answer-cat:first-of-type { break-before: auto; }
.exam-cat-header { display: flex; align-items: center; gap: 7pt; font-size: 13pt; font-weight: 800; margin: 4pt 0 8pt; }
.exam-cat-badge, .toc-cat-badge, .answer-cat .exam-cat-badge { display: inline-flex; align-items: center; justify-content: center; width: 17pt; height: 17pt; border-radius: 50%; color: #fff; font-size: 8.8pt; font-weight: 800; }
.exam-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3pt 12pt; }
.exam-q { break-inside: avoid; margin-bottom: 7pt; }
.exam-q-num { font-weight: 800; color: #0f172a; }
.exam-q-text { font-size: 8.9pt; color: #1e293b; line-height: 1.45; }
.exam-opts { display: grid; gap: 1pt; margin-top: 2pt; padding-left: 12pt; }
.exam-opt { font-size: 8.3pt; color: #64748b; line-height: 1.4; }
.answer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3pt 12pt; }
.answer-item { break-inside: avoid; margin-bottom: 6pt; font-size: 8.3pt; }
.answer-head { font-weight: 800; }
.answer-num { color: #0f172a; }
.answer-letter { color: #059669; }
.answer-explain { color: #64748b; margin-top: 1pt; line-height: 1.4; }
`

let body = coverPage() + usagePage() + tocPage()
for (const cat of categoryOrder) {
  body += dividerPage(cat)
  for (const c of concepts.filter((x) => x.category === cat)) {
    body += conceptPage(c)
  }
}
body += examIntroPage() + examQuestionsSection() + answerKeySection()
body += backCoverPage()

const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<title>破局手册</title>
<style>${css}</style>
</head>
<body>${body}</body>
</html>`

writeFileSync(new URL('../pdf-build/booklet.html', import.meta.url), html)
console.log('wrote pdf-build/booklet.html, length', html.length)
