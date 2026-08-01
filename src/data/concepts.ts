export type Category = 'bias' | 'social' | 'economy' | 'strategy' | 'systems'

export type ConceptMeta = {
  id: string
  icon: string
  title: string
  aka: string
  summary: string
  category: Category
}

export const categoryOrder: Category[] = ['bias', 'social', 'economy', 'strategy', 'systems']

export const categoryInfo: Record<Category, { label: string; desc: string; numeral: string }> = {
  bias: {
    label: '认知偏误',
    desc: '大脑天生的思维捷径，平时省力好用，但在关键判断上会悄悄把你带偏。',
    numeral: 'A',
  },
  social: {
    label: '社会与人际',
    desc: '一群人聚在一起时会自发形成的规律——关系怎么排序、氛围怎么扩散、风气怎么形成。',
    numeral: 'B',
  },
  economy: {
    label: '经济与决策',
    desc: '资源有限、选项太多时，怎么分配精力和金钱才划算的底层规律。',
    numeral: 'C',
  },
  strategy: {
    label: '博弈与影响',
    desc: '人和人之间的互动、说服、谈判，背后其实都有可以拆解的套路。',
    numeral: 'D',
  },
  systems: {
    label: '系统与演化',
    desc: '跳出单次事件，看事情在更长时间尺度上是怎么发展、怎么被历史选择的。',
    numeral: 'E',
  },
}

export const concepts: ConceptMeta[] = [
  // ---------- 认知偏误 ----------
  {
    id: 'sunk-cost',
    icon: '🎬',
    title: '沉没成本谬误',
    aka: 'Sunk Cost Fallacy',
    summary: '电影难看还是硬看完，只因为票已经买了——已经花出去的，不该再影响你现在的选择。',
    category: 'bias',
  },
  {
    id: 'dunning-kruger',
    icon: '🎢',
    title: '邓宁-克鲁格效应',
    aka: 'Dunning-Kruger Effect',
    summary: '刚学会一点皮毛的人往往最自信，真正的高手反而更清楚自己不懂什么。',
    category: 'bias',
  },
  {
    id: 'survivorship-bias',
    icon: '✈️',
    title: '幸存者偏差',
    aka: 'Survivorship Bias',
    summary: '你只看到了成功者在台上分享经验，那些同样努力却失败的人，早就没了声音。',
    category: 'bias',
  },
  {
    id: 'anchoring',
    icon: '⚓',
    title: '锚定效应',
    aka: 'Anchoring Effect',
    summary: '先看到的第一个数字，会像锚一样把你后面所有的判断都拽向它附近。',
    category: 'bias',
  },
  {
    id: 'barnum-effect',
    icon: '🔮',
    title: '巴纳姆效应',
    aka: 'Barnum Effect',
    summary: '"你外表坚强，内心其实很敏感"——这种放之四海而皆准的话，为什么听起来像专门在说你。',
    category: 'bias',
  },
  // ---------- 社会与人际 ----------
  {
    id: 'differential-mode',
    icon: '💧',
    title: '差序格局',
    aka: '费孝通《乡土中国》',
    summary: '中国人的人情往来，像水面涟漪一圈圈往外推，越靠近中心越亲、越往外越淡。',
    category: 'social',
  },
  {
    id: 'herd-effect',
    icon: '🐑',
    title: '羊群效应',
    aka: 'Herd Behavior',
    summary: '一家店门口排队，路过的人会不自觉也想排——我们默认"大家都在做的，应该没错"。',
    category: 'social',
  },
  {
    id: 'broken-windows',
    icon: '🪟',
    title: '破窗效应',
    aka: 'Broken Windows Theory',
    summary: '一扇破窗户没人修，很快整栋楼的窗户都会被砸——小的失序如果没人管，会迅速扩散成大的失序。',
    category: 'social',
  },
  {
    id: 'catfish-effect',
    icon: '🐟',
    title: '鲶鱼效应',
    aka: 'Catfish Effect',
    summary: '沙丁鱼运输途中容易死气沉沉，放一条鲶鱼进去搅局，反而能让整群鱼都活跃起来。',
    category: 'social',
  },
  // ---------- 经济与决策 ----------
  {
    id: 'paradox-of-choice',
    icon: '🍦',
    title: '选择悖论',
    aka: 'Paradox of Choice',
    summary: '奶茶店菜单从5款变成50款，你不会更满意，只会在点单窗口前纠结更久、事后更容易后悔。',
    category: 'economy',
  },
  {
    id: 'diminishing-utility',
    icon: '🍕',
    title: '边际效用递减',
    aka: 'Diminishing Marginal Utility',
    summary: '饿的时候第一块披萨最香，吃到第五块可能已经想吐——同样的东西，拥有得越多，每多一份带来的满足感越小。',
    category: 'economy',
  },
  {
    id: 'pareto-principle',
    icon: '📊',
    title: '二八法则',
    aka: 'Pareto Principle',
    summary: '你80%的成果，往往来自你20%最关键的努力——剩下80%的时间精力，可能都花在了边角料上。',
    category: 'economy',
  },
  {
    id: 'parkinsons-law',
    icon: '⏳',
    title: '帕金森定律',
    aka: "Parkinson's Law",
    summary: '一份报告给你一周，你会刚好用掉一周；给你一天，你往往也能刚好做完——工作会自动膨胀到填满你给它的时间。',
    category: 'economy',
  },
  // ---------- 博弈与影响 ----------
  {
    id: 'prisoners-dilemma',
    icon: '🔒',
    title: '囚徒困境',
    aka: "Prisoner's Dilemma",
    summary: '两个人如果都替对方着想，结果会更好；但每个人只顾自己最优时，反而一起把日子过差了。',
    category: 'strategy',
  },
  {
    id: 'foot-in-the-door',
    icon: '🚪',
    title: '登门槛效应',
    aka: 'Foot-in-the-Door Technique',
    summary: '先答应一个小请求的人，更容易在之后答应一个大得多的请求——先让脚迈进门，门就很难再关上。',
    category: 'strategy',
  },
  {
    id: 'door-in-the-face',
    icon: '🏚️',
    title: '拆屋效应',
    aka: 'Door-in-the-Face Technique',
    summary: '先提一个大到会被拒绝的要求，再退让到真正想要的那个——鲁迅说的"拆屋效应"，是反过来的登门槛。',
    category: 'strategy',
  },
  // ---------- 系统与演化 ----------
  {
    id: 'lindy-effect',
    icon: '📜',
    title: '林迪效应',
    aka: 'Lindy Effect',
    summary: '一本书已经流传了100年，它很可能再流传100年——经受住时间考验的东西，存在得越久，往往还能存在更久。',
    category: 'systems',
  },
  {
    id: 'black-swan',
    icon: '🦢',
    title: '黑天鹅效应',
    aka: 'Black Swan Theory',
    summary: '欧洲人见过再多白天鹅，也无法排除黑天鹅的存在——极端罕见的事件一旦发生，冲击力会远超所有人的预期。',
    category: 'systems',
  },
  {
    id: 'path-dependence',
    icon: '🚂',
    title: '路径依赖',
    aka: 'Path Dependence',
    summary: '键盘为什么是QWERTY这种"反效率"排列？因为一旦大家都习惯了，换掉的成本比将就用下去还高。',
    category: 'systems',
  },
  {
    id: 'butterfly-effect',
    icon: '🦋',
    title: '蝴蝶效应',
    aka: 'Butterfly Effect',
    summary: '巴西的一只蝴蝶扇动翅膀，理论上可能在得州引发一场龙卷风——复杂系统里，微小的起点差异会被逐级放大。',
    category: 'systems',
  },
]

export function getConcept(id: string): ConceptMeta | undefined {
  return concepts.find((c) => c.id === id)
}

export function getConceptsByCategory(category: Category): ConceptMeta[] {
  return concepts.filter((c) => c.category === category)
}
