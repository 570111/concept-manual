import { concepts, type Category } from './concepts'

export type QuizDifficulty = 'basic' | 'advanced'

export type QuizQuestion = {
  id: string
  conceptId: string
  difficulty: QuizDifficulty
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export const difficultyLabels: Record<QuizDifficulty, string> = {
  basic: '基础题',
  advanced: '应用题',
}

export const quizQuestions: QuizQuestion[] = [
  // 沉没成本谬误
  {
    id: 'sunk-cost-1',
    conceptId: 'sunk-cost',
    difficulty: 'basic',
    question: '"沉没成本"指的是？',
    options: ['已经支付且无法收回的成本', '未来还需要支付的成本', '预期能带来的收益', '选择一个选项所放弃的机会'],
    correctIndex: 0,
    explanation: '沉没成本是已经发生、无论后续怎么选都无法收回的支出，理性决策应该只考虑未来的成本和收益，不该被它绑架。',
  },
  {
    id: 'sunk-cost-2',
    conceptId: 'sunk-cost',
    difficulty: 'advanced',
    question: '你报了一门网课，学了两节课发现完全不适合自己，但因为交了很贵的学费，还是逼自己学完剩下的18节课。这种心理最可能是？',
    options: ['沉没成本谬误', '幸存者偏差', '边际效用递减', '羊群效应'],
    correctIndex: 0,
    explanation: '已经交的学费是沉没成本，无法收回，理性判断应该只看"接下来继续学"本身是否值得，而不是被已经花掉的钱绑架。',
  },
  // 邓宁-克鲁格效应
  {
    id: 'dunning-kruger-1',
    conceptId: 'dunning-kruger',
    difficulty: 'basic',
    question: '邓宁-克鲁格效应描述的现象是？',
    options: ['能力欠缺的人容易高估自己，真正的专家反而更清楚自己的局限', '能力越强的人越自信，能力越弱的人越自卑', '学得越多，自信心持续线性上升', '专家总是比新手更容易犯错'],
    correctIndex: 0,
    explanation: '能力不足的人往往缺乏"意识到自己能力不足"所需要的那部分能力，因而容易高估自己；真正的高手因为见过更高的山，反而更清楚自己的局限。',
  },
  {
    id: 'dunning-kruger-2',
    conceptId: 'dunning-kruger',
    difficulty: 'advanced',
    question: '下面哪种说法最符合邓宁-克鲁格效应曲线的描述？',
    options: ['刚入门时信心达到高峰，深入学习后信心先下降后回升', '信心会随着能力提升一直线性增长，没有波动', '能力越强，信心越低，不存在回升阶段', '信心水平和能力完全无关'],
    correctIndex: 0,
    explanation: '曲线大致是：刚入门信心飙升到"愚昧之峰"，学得越多信心反而跌入"绝望之谷"，最后随真正精通慢慢爬回理性的自信。',
  },
  // 幸存者偏差
  {
    id: 'survivorship-bias-1',
    conceptId: 'survivorship-bias',
    difficulty: 'basic',
    question: '"幸存者偏差"最经典的例子是？',
    options: ['二战中统计学家建议给弹孔少的部位加装甲，而不是弹孔多的部位', '沙丁鱼运输中放入鲶鱼提高存活率', '键盘QWERTY布局的由来', '巴纳姆的马戏团营销语录'],
    correctIndex: 0,
    explanation: '中弹在机头和发动机的飞机根本没能飞回来统计，真正该加固的是"看不见的"弹孔少的部位，而不是返航飞机上弹孔密集的地方。',
  },
  {
    id: 'survivorship-bias-2',
    conceptId: 'survivorship-bias',
    difficulty: 'advanced',
    question: '你在网上看到一套"创业方法论"，评论区全是用这套方法成功的人现身说法。这时候最应该警惕的是？',
    options: ['这些成功案例可能只是幸存下来的少数样本，看不到用同样方法失败的人', '这是典型的锚定效应', '这属于帕金森定律', '这是路径依赖的体现'],
    correctIndex: 0,
    explanation: '你能看到的成功案例，本身就是被筛选过的"幸存者"，同样方法论下失败的人通常不会主动现身说法，据此判断方法论有效需要更完整的样本。',
  },
  // 锚定效应
  {
    id: 'anchoring-1',
    conceptId: 'anchoring',
    difficulty: 'basic',
    question: '锚定效应指的是？',
    options: ['人做数值判断时会被最初接触到的数字影响，即使这个数字和判断本身无关', '人总是低估自己接触到的第一个数字', '只有专业人士才会受到数字锚点的影响', '谈判中先出价的一方总是吃亏'],
    correctIndex: 0,
    explanation: '第一个看到的数字会变成后续判断的参照点，把估值"拽"向它附近，即使这个数字本身和问题毫无逻辑关系。',
  },
  {
    id: 'anchoring-2',
    conceptId: 'anchoring',
    difficulty: 'advanced',
    question: '商场里衣服标"原价1999，现价599"，这种定价策略主要利用了？',
    options: ['锚定效应，让1999元成为参照点，衬托599元显得划算', '幸存者偏差', '帕金森定律', '破窗效应'],
    correctIndex: 0,
    explanation: '即便1999元从未真实成交过，它依然会在消费者心里"扎根"成为参照锚点，让599元显得格外便宜。',
  },
  // 巴纳姆效应
  {
    id: 'barnum-effect-1',
    conceptId: 'barnum-effect',
    difficulty: 'basic',
    question: '巴纳姆效应指的是？',
    options: ['人容易把模糊、笼统又偏正面的描述，当成是对自己独一无二的精准描述', '人总是不相信任何性格测试的结果', '只有轻信的人才会被星座描述打动', '描述越具体，人越容易觉得"说的就是我"'],
    correctIndex: 0,
    explanation: '这类描述用词宽泛又正面，几乎能套在任何人身上，而人天生倾向于"对号入座"，描述反而是越模糊越容易让人觉得准。',
  },
  {
    id: 'barnum-effect-2',
    conceptId: 'barnum-effect',
    difficulty: 'advanced',
    question: '心理学家 Bertram Forer 的实验里，学生们给同一份"通用性格描述"打出很高的准确度分数，这个实验主要揭示了？',
    options: ['模糊笼统又偏正面的描述，几乎能让所有人都觉得"很准"', '学生普遍缺乏基本的心理学素养', '性格测试在任何情况下都不可信', '邓宁-克鲁格效应的存在'],
    correctIndex: 0,
    explanation: '每个学生拿到的都是同一份描述，却普遍打出高准确度分数，说明这类描述的"准确感"来自措辞的宽泛，而不是真的分析了每个人。',
  },
  // 差序格局
  {
    id: 'differential-mode-1',
    conceptId: 'differential-mode',
    difficulty: 'basic',
    question: '"差序格局"这个概念由谁提出，用来描述什么？',
    options: ['费孝通，中国传统社会以自己为中心、按亲疏远近向外扩散的人际结构', '卡尼曼，人的认知偏差', '帕累托，社会财富分配规律', '西奥迪尼，说服他人的心理技巧'],
    correctIndex: 0,
    explanation: '费孝通在《乡土中国》中提出，中国人的人际关系像水面涟漪一圈圈往外推，越靠近中心越亲、越往外越淡。',
  },
  {
    id: 'differential-mode-2',
    conceptId: 'differential-mode',
    difficulty: 'advanced',
    question: '差序格局理论认为，中国人处理人情往来时，最核心的判断依据是？',
    options: ['和对方关系的亲疏远近，越靠近"自己"这个中心，责任和信任浓度越高', '完全依照法律和正式合同规定', '对方的社会地位高低', '所有人一视同仁，权利义务完全相同'],
    correctIndex: 0,
    explanation: '这与西方社会常见的"团体格局"（边界清晰、对所有成员一视同仁）不同，差序格局按亲疏远近层层往外推。',
  },
  // 羊群效应
  {
    id: 'herd-effect-1',
    conceptId: 'herd-effect',
    difficulty: 'basic',
    question: '羊群效应最常用来解释的现象是？',
    options: ['人在缺乏独立判断依据时，倾向于模仿大多数人的行为，比如股市追涨杀跌', '团队里引入新人激活活力', '已经流行很久的事物更可能继续流行', '小的失序信号会诱发更大的破坏'],
    correctIndex: 0,
    explanation: '当人无法独立判断真实价值、或觉得"这么多人不可能都错"时，会放弃自己的判断，直接模仿多数人的行为。',
  },
  {
    id: 'herd-effect-2',
    conceptId: 'herd-effect',
    difficulty: 'advanced',
    question: '你路过两家奶茶店，一家排长队，一家空荡荡，你没有任何了解就走向排队的那家，这种行为主要体现了？',
    options: ['羊群效应', '破窗效应', '帕金森定律', '路径依赖'],
    correctIndex: 0,
    explanation: '在完全不了解产品本身的情况下，仅凭"很多人在排队"这一从众信号做决定，是羊群效应的典型场景。',
  },
  // 破窗效应
  {
    id: 'broken-windows-1',
    conceptId: 'broken-windows',
    difficulty: 'basic',
    question: '破窗效应最初是在什么领域被提出的？',
    options: ['犯罪学，解释环境中的小失序信号如何诱发更大范围的违规行为', '经济学，解释资源分配规律', '心理学，解释性格测试为何显得准确', '气象学，解释系统对初始条件的敏感性'],
    correctIndex: 0,
    explanation: '由犯罪学家 James Q. Wilson 和 George Kelling 在1982年提出，未被纠正的小失序会传递"这里没人管"的信号，诱发更严重的破坏。',
  },
  {
    id: 'broken-windows-2',
    conceptId: 'broken-windows',
    difficulty: 'advanced',
    question: '团队群聊里第一条广告刷屏没人管，很快出现了第二条、第三条类似的广告。这种现象最适合用哪个概念解释？',
    options: ['破窗效应', '边际效用递减', '巴纳姆效应', '囚徒困境'],
    correctIndex: 0,
    explanation: '第一条没人管的广告，就像那扇没修的破窗户，向所有人传递了"这里没规矩"的信号，导致失序不断扩散。',
  },
  // 鲶鱼效应
  {
    id: 'catfish-effect-1',
    conceptId: 'catfish-effect',
    difficulty: 'basic',
    question: '"鲶鱼效应"这个比喻最初来源于？',
    options: ['渔民在沙丁鱼运输的鱼舱里放入鲶鱼，激活沙丁鱼的活力、提高存活率', '心理学家做的性格测试实验', '经济学家对财富分配的观察', '气象学家对天气系统的模拟'],
    correctIndex: 0,
    explanation: '沙丁鱼为了躲避鲶鱼这个天敌会不停游动，反而提高了长途运输中的存活率，后来被借用来形容组织中的"搅局者"效应。',
  },
  {
    id: 'catfish-effect-2',
    conceptId: 'catfish-effect',
    difficulty: 'advanced',
    question: '一个长期沉闷的团队，因为新加入一位风格迥异、经常提出不同意见的成员而重新变得有活力，这最适合用来解释的概念是？',
    options: ['鲶鱼效应', '沉没成本谬误', '选择悖论', '差序格局'],
    correctIndex: 0,
    explanation: '这位新成员扮演了"搅局者"的角色，打破了团队一潭死水的沉闷状态，激活了整体的讨论质量和竞争意识。',
  },
  // 选择悖论
  {
    id: 'paradox-of-choice-1',
    conceptId: 'paradox-of-choice',
    difficulty: 'basic',
    question: '"选择悖论"指的是？',
    options: ['选项超过一定数量后，反而会让人更难决策、满意度更低、更容易后悔', '选择越多，人一定会越满意', '完全没有选择时，人的满意度最高', '选择的数量和满意度无关'],
    correctIndex: 0,
    explanation: '选项太多需要花更多认知资源去比较，选定之后还会不断想起"没选的那些是不是更好"，反而降低满意度、增加决策后悔。',
  },
  {
    id: 'paradox-of-choice-2',
    conceptId: 'paradox-of-choice',
    difficulty: 'advanced',
    question: '心理学研究发现，追求"够好就行"的决策心态，通常比追求"必须找到最优解"的心态带来更高的幸福感，前者被称为？',
    options: ['满足者', '最大化者', '幸存者', '从众者'],
    correctIndex: 0,
    explanation: '"满足者"接受一个不错的选择就停止比较，"最大化者"则耗尽心力寻找理论上的最优解，研究发现前者通常更幸福。',
  },
  // 边际效用递减
  {
    id: 'diminishing-utility-1',
    conceptId: 'diminishing-utility',
    difficulty: 'basic',
    question: '"边际效用递减"指的是？',
    options: ['同一物品每多消费一单位，这一单位带来的额外满足感会随已有数量增多而逐渐降低', '商品数量越多价格一定越贵', '满足感会随时间推移而持续增加', '只适用于食物类消费'],
    correctIndex: 0,
    explanation: '第一块披萨最香，吃到第五块可能已经腻了——同样的东西拥有得越多，每多一份带来的满足感越小，这是经济学最基础的规律之一。',
  },
  {
    id: 'diminishing-utility-2',
    conceptId: 'diminishing-utility',
    difficulty: 'advanced',
    question: '"多为体验类消费花钱，少为物品类消费花钱"这条建议，主要基于什么原理？',
    options: ['体验类消费的边际效用递减得比物质消费慢，更能持久带来满足感', '体验类消费的价格总是更便宜', '物品类消费不存在边际效用', '这和边际效用递减无关，只是个人喜好问题'],
    correctIndex: 0,
    explanation: '物质消费的边际效用递减得快，而每次内容不同的体验（旅行、学新技能）能更持久地带来满足感。',
  },
  // 二八法则
  {
    id: 'pareto-principle-1',
    conceptId: 'pareto-principle',
    difficulty: 'basic',
    question: '二八法则最初是帕累托在观察什么现象时提出的？',
    options: ['意大利大部分土地掌握在少数人手中的财富分配规律', '沙丁鱼运输死亡率', '电影票房和口碑的关系', '键盘布局的演变'],
    correctIndex: 0,
    explanation: '帕累托在19世纪末观察到意大利80%的土地掌握在20%的人手里，后来被引申为"少数关键、多数次要"的普遍规律。',
  },
  {
    id: 'pareto-principle-2',
    conceptId: 'pareto-principle',
    difficulty: 'advanced',
    question: '复盘工作后发现，你80%的业绩其实来自20%的核心客户。根据二八法则，接下来更合理的做法是？',
    options: ['把更多精力和资源向这20%的核心客户倾斜，同时不完全放弃另外80%', '立刻放弃剩下80%的客户，把所有精力都投入核心客户', '平均分配精力给所有客户，避免厚此薄彼', '这个规律只适用于财富分配，不能用于客户管理'],
    correctIndex: 0,
    explanation: '二八法则提醒你找到关键的少数、优先倾斜资源，但不代表可以完全无视次要的80%，它们有时也有不可忽视的价值。',
  },
  // 帕金森定律
  {
    id: 'parkinsons-law-1',
    conceptId: 'parkinsons-law',
    difficulty: 'basic',
    question: '帕金森定律描述的现象是？',
    options: ['工作量会自动膨胀，直到填满所有可用的完成时间', '工作效率会随着时间推移持续下降', '团队规模越大，效率一定越高', '只有官僚机构才会出现这种现象'],
    correctIndex: 0,
    explanation: '给一件事一周时间，你会刚好用掉一周；给一天，往往也能刚好做完——工作会自动膨胀到填满给它的时间。',
  },
  {
    id: 'parkinsons-law-2',
    conceptId: 'parkinsons-law',
    difficulty: 'advanced',
    question: '想提高完成一份报告的效率，根据帕金森定律，比较有效的做法是？',
    options: ['给自己设置一个比"感觉需要的时间"更短的截止时间', '尽量不设置截止时间，让自己充分发挥', '时间给得越充裕，效率一定越高', '效率只取决于个人能力，和截止时间长短无关'],
    correctIndex: 0,
    explanation: '压缩截止时间能逼自己提前排除干扰、聚焦核心步骤，往往能在不明显牺牲质量的前提下提高效率。',
  },
  // 囚徒困境
  {
    id: 'prisoners-dilemma-1',
    conceptId: 'prisoners-dilemma',
    difficulty: 'basic',
    question: '囚徒困境揭示的核心现象是？',
    options: ['每个人都做出对自己最优的选择，最终集体结果却可能比"都合作"更差', '只要双方都追求个人利益最大化，集体结果一定最优', '合作在任何情况下都不如背叛划算', '这个模型只适用于犯罪审讯场景'],
    correctIndex: 0,
    explanation: '理性分析下"背叛"对每个个体都是更优策略，但双方都选择背叛，结果反而比双方都选择合作更糟。',
  },
  {
    id: 'prisoners-dilemma-2',
    conceptId: 'prisoners-dilemma',
    difficulty: 'advanced',
    question: '在长期重复的博弈（比如长期合作关系）中，学者发现哪种策略长期表现最稳定？',
    options: ['先释放合作善意，之后模仿对方上一轮的选择（以牙还牙）', '无论对方怎么选，自己永远选择背叛', '无论对方怎么选，自己永远选择合作、绝不还击', '随机选择合作或背叛'],
    correctIndex: 0,
    explanation: '政治学家 Robert Axelrod 的经典实验发现，"先合作、再模仿对方上一次选择"的策略能同时兼顾合作意愿和自我保护，长期表现最好。',
  },
  // 登门槛效应
  {
    id: 'foot-in-the-door-1',
    conceptId: 'foot-in-the-door',
    difficulty: 'basic',
    question: '"登门槛效应"指的是？',
    options: ['先让对方答应一个小请求，之后更容易让对方答应一个大得多的请求', '先提一个大到会被拒绝的请求，再退让到真正想要的小请求', '门槛设置得越高，通过的人满意度越高', '这个效应只对陌生人有效，对熟人无效'],
    correctIndex: 0,
    explanation: '一旦做出了承诺或行动，人会不自觉调整自我认知去配合它，这种认知会让后续更大的请求显得顺理成章。',
  },
  {
    id: 'foot-in-the-door-2',
    conceptId: 'foot-in-the-door',
    difficulty: 'advanced',
    question: '想帮自己养成每天锻炼的习惯，根据登门槛效应，比较有效的起步方式是？',
    options: ['先从每天5个俯卧撑这种几乎不会失败的小目标开始，再逐步加量', '一开始就把目标定为每天锻炼一小时', '目标设置的高低和最终能否坚持下来没有关系', '应该先设定惩罚机制，而不是从小请求开始'],
    correctIndex: 0,
    explanation: '先完成一个小到几乎不会失败的目标，能建立"我是会锻炼的人"的自我认知，为后续加大强度打下心理基础。',
  },
  // 拆屋效应
  {
    id: 'door-in-the-face-1',
    conceptId: 'door-in-the-face',
    difficulty: 'basic',
    question: '"拆屋效应"指的是？',
    options: ['先提一个大到几乎一定被拒绝的请求，再退让到真正想要的小请求，提高对方答应的概率', '先答应一个小请求，逐步引导对方答应更大的请求', '通过不断重复请求来消磨对方的耐心', '只在书面谈判中有效，口头请求无效'],
    correctIndex: 0,
    explanation: '心理学家 Robert Cialdini 的实验发现，先提大请求被拒后再提小请求，比直接提小请求的成功率更高。',
  },
  {
    id: 'door-in-the-face-2',
    conceptId: 'door-in-the-face',
    difficulty: 'advanced',
    question: '拆屋效应能生效，主要依赖下面哪两种心理机制？',
    options: ['互惠式让步 和 对比效应', '沉没成本谬误 和 幸存者偏差', '锚定效应 和 边际效用递减', '路径依赖 和 破窗效应'],
    correctIndex: 0,
    explanation: '对方退了一步会觉得你也该配合退让（互惠式让步），第二个请求在大请求的对比下也显得格外小（对比效应）。',
  },
  // 林迪效应
  {
    id: 'lindy-effect-1',
    conceptId: 'lindy-effect',
    difficulty: 'basic',
    question: '林迪效应主要适用于哪类事物？',
    options: ['靠信息和文化传承延续、不会自然衰老的事物，比如书籍、观念、制度', '所有有生命的生物体', '只适用于食品保质期的预测', '只适用于股票价格走势预测'],
    correctIndex: 0,
    explanation: '这类事物已经存在的时间越长，代表它经受住了越多轮时间考验和竞争淘汰，未来预期存在的时间反而越长。',
  },
  {
    id: 'lindy-effect-2',
    conceptId: 'lindy-effect',
    difficulty: 'advanced',
    question: '根据林迪效应的逻辑，下面哪种判断更合理？',
    options: ['一本已经流传了上百年、依然被反复阅读的经典著作，未来大概率还会继续流传很长时间', '一个人的寿命越长，未来还能活的时间也应该越长', '一款刚上市一个月的新产品，因为足够新，未来存活时间一定比经典产品长', '林迪效应对任何事物都适用，包括人的寿命'],
    correctIndex: 0,
    explanation: '林迪效应只适用于非生物、靠文化传承延续的事物，人和生物体有自然寿命限制，不适用这个逻辑。',
  },
  // 黑天鹅效应
  {
    id: 'black-swan-1',
    conceptId: 'black-swan',
    difficulty: 'basic',
    question: '"黑天鹅事件"指的是？',
    options: ['极其罕见、事先几乎无法预测，但一旦发生会造成极端冲击的事件', '任何让人感到意外的坏消息', '历史上从未发生过、永远也不会发生的事件', '只在金融市场中才会出现的现象'],
    correctIndex: 0,
    explanation: '黑天鹅事件之所以危险，恰恰是因为它落在人们"根据过去经验建立的认知范围"之外，事后又总能找到看似合理的解释。',
  },
  {
    id: 'black-swan-2',
    conceptId: 'black-swan',
    difficulty: 'advanced',
    question: '应对"黑天鹅"风险，比较合理的做法是？',
    options: ['不把方案完全建立在"一切按常规发展"的假设上，预留应急资金和灵活性', '因为无法预测，所以不需要做任何准备', '把所有资源集中投入单一最优选项，追求效率最大化', '只需要参考历史数据里出现过的最坏情况就足够了'],
    correctIndex: 0,
    explanation: '黑天鹅事件的本质是"前所未见"，历史数据无法涵盖它，预留冗余和灵活性是应对这种不确定性最朴素有效的方法。',
  },
  // 路径依赖
  {
    id: 'path-dependence-1',
    conceptId: 'path-dependence',
    difficulty: 'basic',
    question: '"路径依赖"最经典的例子是？',
    options: ['QWERTY键盘布局，尽管不是打字效率最优的排列，但因为使用者太多难以被替换', '沙丁鱼运输中的鲶鱼效应', '二战轰炸机装甲统计案例', '拆屋效应的谈判策略'],
    correctIndex: 0,
    explanation: 'QWERTY布局最初为解决机械打字机卡键问题设计，并非效率最优，但因为已被大量采纳，转换成本太高而一直沿用至今。',
  },
  {
    id: 'path-dependence-2',
    conceptId: 'path-dependence',
    difficulty: 'advanced',
    question: '团队里有人说"这个流程一直都是这么做的，别改了"，这句话背后最可能反映的是？',
    options: ['路径依赖——不一定是因为这个流程最优，而是切换成本太高、没人愿意承担改动的阵痛', '幸存者偏差', '拆屋效应', '边际效用递减'],
    correctIndex: 0,
    explanation: '很多流程延续下来不是因为它是最优解，而是因为改动的学习成本和磨合成本太高，产生了自我强化的路径依赖惯性。',
  },
  // 蝴蝶效应
  {
    id: 'butterfly-effect-1',
    conceptId: 'butterfly-effect',
    difficulty: 'basic',
    question: '"蝴蝶效应"最初是在哪个领域被发现的？',
    options: ['气象学，计算机模拟天气系统时发现对初始条件的极度敏感性', '心理学性格测试实验', '经济学财富分配研究', '犯罪学社区治理研究'],
    correctIndex: 0,
    explanation: '气象学家 Edward Lorenz 发现输入数值的极小差异，经过系统内部层层非线性放大，会导致长期预测结果天壤之别。',
  },
  {
    id: 'butterfly-effect-2',
    conceptId: 'butterfly-effect',
    difficulty: 'advanced',
    question: '蝴蝶效应最容易被误用的方式是？',
    options: ['认为"所有微小的事都注定会引发巨大后果"，忽略了大多数变化会被系统缓冲吸收', '用来解释混沌系统对初始条件的敏感性', '用来提醒人们复杂系统难以被精确长期预测', '用来说明某些关键节点具有以小博大的杠杆效应'],
    correctIndex: 0,
    explanation: '现实中绝大多数微小变化会被系统的缓冲机制吸收，只有处于"混沌系统临界点"上的特定情形才真正符合蝴蝶效应。',
  },
]

export function getQuestionsByConcept(conceptId: string): QuizQuestion[] {
  return quizQuestions.filter((q) => q.conceptId === conceptId)
}

export function getQuestionsByCategory(category: Category): QuizQuestion[] {
  const ids = new Set(concepts.filter((c) => c.category === category).map((c) => c.id))
  return quizQuestions.filter((q) => ids.has(q.conceptId))
}

export function countByDifficulty(category: Category): { basic: number; advanced: number } {
  const qs = getQuestionsByCategory(category)
  return {
    basic: qs.filter((q) => q.difficulty === 'basic').length,
    advanced: qs.filter((q) => q.difficulty === 'advanced').length,
  }
}
