import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { previewConcepts } from '../data/previewContent'
import StoryCard from '../components/StoryCard'
import Callout from '../components/Callout'

const PURCHASE_URL = 'https://www.goofish.com/item?id=1070546163337'
const PRICE_TEXT = '¥16.9'

const stats = [
  { num: '100', label: '个思维模型' },
  { num: '400', label: '道自测题' },
  { num: '7', label: '大分类' },
  { num: '1', label: '份PDF可打印' },
]

const included = [
  { icon: '📖', title: '100个概念完整讲解', desc: '每个概念：生活场景 → 原理讲透 → 真实案例（有名有姓有年份，不是编的）→ 怎么用 → 常见误解 → 别用错的边界。' },
  { icon: '📄', title: 'PDF完整版可下载打印', desc: '不想盯着手机看的话，PDF版本可以直接打印出来，通勤路上、睡前都能翻。' },
  { icon: '✏️', title: '400道自测题', desc: '学完不是看看就过，配套测验帮你检验是不是真的懂了，错题自动收进错题本。' },
  { icon: '🕸️', title: '概念关系图谱', desc: '100个概念不是孤立的，图谱能看清楚哪些概念互相关联，顺藤摸瓜学得更快。' },
  { icon: '📅', title: '每日一个概念', desc: '不知道从哪学起？打开首页就有当天推荐的概念，每天5分钟。' },
]

const faqs = [
  { q: '买了之后怎么用？', a: '拍下商品后，我会私信发给你一个专属访问密钥（形如 PJSC-XXXX-XXXX-XXXX），打开网站输入密钥就能直接看全部内容，手机电脑都能用，不限设备、不限次数。' },
  { q: '密钥丢了怎么办？', a: '联系我补发就行，密钥本身不占用什么成本，正常情况都能处理。' },
  { q: '内容是自己编的还是有依据的？', a: '每个概念都配了真实案例，标注了研究者、年份、机构或事件，不是空对空的道理，也不是AI瞎编的鸡汤。' },
  { q: '能退款吗？', a: '虚拟内容一旦发货很难"退货"，介意的话可以先看上面的免费试读部分，觉得内容不是你想要的就不用拍。' },
]

export default function Preview() {
  useEffect(() => {
    const target = window.location.hash.slice(1) || new URLSearchParams(window.location.search).get('s')
    if (!target) return
    const el = document.getElementById(target)
    el?.scrollIntoView()
  }, [])

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
    <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.12),transparent)]" />
    <div className="relative mx-auto w-full max-w-2xl space-y-10 px-4 py-8">
      <header className="flex items-center gap-2 text-lg font-semibold text-white">
        <span className="text-xl">🔭</span>
        破局手册
      </header>

      <section className="text-center">
        <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
          用100个思维模型
          <br />
          看懂生活里那些说不清的规则
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-400">
          为什么排队的人越多你越想排？为什么道歉的话术总能戳中你？为什么有些老规矩明明不方便却一直没人改？
          这些现象背后都有名字、有原理、有真实案例——不是鸡汤，是能直接用的思维工具。
        </p>
        <div className="mt-6 grid grid-cols-4 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="tech-card py-3">
              <div className="text-xl font-extrabold text-emerald-400">{s.num}</div>
              <div className="text-[11px] text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="text-center">
          <h2 className="text-lg font-bold text-white">先免费看3个完整概念</h2>
          <p className="mt-1 text-xs text-slate-500">不删减、不打码，跟付费后看到的正文一模一样</p>
        </div>
        {previewConcepts.map((c) => (
          <div key={c.id} id={`preview-${c.id}`} className="tech-card space-y-3 !rounded-3xl p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-emerald-500/10 text-2xl ring-1 ring-emerald-500/20">
                {c.icon}
              </div>
              <div>
                <div className="text-xs font-medium text-emerald-400">{c.category}</div>
                <h3 className="text-base font-bold text-white">
                  {c.title} <span className="text-xs font-normal text-slate-500">{c.aka}</span>
                </h3>
              </div>
            </div>

            <StoryCard>
              <p>{c.story}</p>
            </StoryCard>

            <div className="space-y-2">
              <div className="text-sm font-bold text-white">这是什么</div>
              <p className="text-sm leading-relaxed text-slate-300">{c.explain}</p>
            </div>

            <Callout tone="good" title={`📚 ${c.realCase.title}`}>
              {c.realCase.body}
            </Callout>

            <div className="space-y-2">
              <div className="text-sm font-bold text-white">怎么用</div>
              {c.apply.map((a, i) => (
                <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
                  <div className="flex items-start gap-2">
                    <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-emerald-500/15 text-[10px] font-bold text-emerald-300 ring-1 ring-emerald-400/40">
                      {i + 1}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-white">{a.title}</div>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{a.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-500">常见误解</div>
              {c.misconceptions.map((m, i) => (
                <div key={i} className="flex gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs leading-relaxed text-slate-300">
                  <span className="flex-none text-slate-600">✗</span>
                  {m}
                </div>
              ))}
            </div>

            <Callout tone="warn" title="⚠️ 别用错了">
              {c.pitfall}
            </Callout>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-emerald-500/25 bg-emerald-500/5 p-5 shadow-[0_0_30px_-14px_rgba(16,185,129,0.6)]">
        <h2 className="text-center text-lg font-bold text-white">完整版包含什么</h2>
        <div className="mt-4 space-y-3">
          {included.map((item) => (
            <div key={item.title} className="flex gap-3">
              <div className="text-xl">{item.icon}</div>
              <div>
                <div className="text-sm font-semibold text-white">{item.title}</div>
                <div className="text-xs leading-relaxed text-slate-400">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="tech-card !rounded-3xl p-6 text-center">
        <div className="text-3xl font-extrabold text-white">{PRICE_TEXT}</div>
        <p className="mt-1 text-xs text-slate-500">一次付费，永久可用，密钥不限设备、不限次数</p>
        <a
          href={PURCHASE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-4 inline-block w-full text-center"
        >
          去闲鱼拍下 →
        </a>
        <p className="mt-3 text-xs text-slate-500">拍下后私信发密钥，一般几分钟内处理</p>
        <Link to="/login" className="mt-4 block text-xs font-medium text-emerald-400 hover:underline">
          已经买过？直接输入密钥登录 →
        </Link>
      </section>

      <section className="space-y-3">
        <h2 className="text-center text-lg font-bold text-white">常见问题</h2>
        {faqs.map((f) => (
          <div key={f.q} className="tech-card p-4">
            <div className="text-sm font-semibold text-white">{f.q}</div>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">{f.a}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-slate-800 pt-4 text-center text-xs text-slate-500">
        本手册内容为通俗化学习资料，不构成专业心理咨询、法律或投资建议
      </footer>
    </div>
    </div>
  )
}
