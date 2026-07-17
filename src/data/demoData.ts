export type FilterState = {
  terminal: string
  exam: string
}

export type DailyPoint = {
  label: string
  revenue: number
  learners: number
}

export type Tone = 'blue' | 'green' | 'violet' | 'amber'

export type Kpi = {
  label: string
  value: number
  delta: number
  tone: Tone
  suffix?: string
  deltaSuffix?: string
}

export type RankingItem = { name: string; value: number }
export type FunnelItem = { label: string; value: number; rate: number }
export type TableRow = { name: string; metric: number; growth: number; share: number }

export type PageProfile = {
  title: string
  insight: string
  insightAccent: string
  summary: string
  kpis: Kpi[]
  trendTitle: string
  trendKey: string
  rankTitle: string
  rankings: RankingItem[]
  funnelTitle: string
  funnel: FunnelItem[]
  tableTitle: string
  tableMetric: string
  rows: TableRow[]
  questions: string[]
}

export const selectOptions = {
  terminal: ['全部终端', '课堂 APP', '题库 APP', '小程序'],
  exam: ['全部考试', '八大考试', '一级建造师', '二级建造师', '中级经济师', '监理工程师', '注册安全工程师', '其他考试'],
}

const terminalMultiplier: Record<string, number> = {
  全部终端: 1,
  '课堂 APP': 0.82,
  '题库 APP': 0.68,
  小程序: 0.54,
}

const examMultiplier: Record<string, number> = {
  全部考试: 1,
  八大考试: 0.78,
  一级建造师: 0.34,
  二级建造师: 0.27,
  中级经济师: 0.22,
  监理工程师: 0.16,
  注册安全工程师: 0.14,
  其他考试: 0.31,
}

export const trendSeries: DailyPoint[] = [
  { label: '2025-07', revenue: 258, learners: 312 },
  { label: '2025-08', revenue: 272, learners: 329 },
  { label: '2025-09', revenue: 289, learners: 348 },
  { label: '2025-10', revenue: 301, learners: 361 },
  { label: '2025-11', revenue: 294, learners: 353 },
  { label: '2025-12', revenue: 326, learners: 382 },
  { label: '2026-01', revenue: 341, learners: 398 },
  { label: '2026-02', revenue: 319, learners: 371 },
  { label: '2026-03', revenue: 354, learners: 411 },
  { label: '2026-04', revenue: 338, learners: 396 },
  { label: '2026-05', revenue: 361, learners: 428 },
  { label: '2026-06', revenue: 392, learners: 467 },
]

const commonRows: TableRow[] = [
  { name: '课堂 APP', metric: 168420, growth: 12.8, share: 42.9 },
  { name: '题库 APP', metric: 134860, growth: -3.6, share: 34.4 },
  { name: '小程序', metric: 89230, growth: 18.5, share: 22.7 },
]

const conversionFunnel: FunnelItem[] = [
  { label: '注册人数', value: 185420, rate: 100 },
  { label: '加微人数', value: 68420, rate: 36.9 },
  { label: '外呼人数', value: 42680, rate: 62.4 },
  { label: '接通人数', value: 27310, rate: 64.0 },
  { label: '销转人数', value: 5860, rate: 21.5 },
]

export const pageProfiles: Record<string, PageProfile> = {
  运营总览: {
    title: '职教运营总览',
    insight: '6 月活跃环比回升', insightAccent: '8.6%',
    summary: '课堂 APP 与小程序贡献主要增量，但题库 APP 新增仍低于上月，建议继续排查注册链路。',
    kpis: [
      { label: '流量营收（元）', value: 12860000, delta: 11.8, tone: 'blue' },
      { label: '注册人数', value: 185420, delta: 7.4, tone: 'green' },
      { label: '新增人数', value: 124680, delta: 4.2, tone: 'violet' },
      { label: '活跃人数', value: 392510, delta: 8.6, tone: 'amber' },
    ],
    trendTitle: '新增 / 活跃月度趋势', trendKey: '活跃人数（千）',
    rankTitle: '终端活跃贡献',
    rankings: [{ name: '课堂 APP', value: 168420 }, { name: '题库 APP', value: 134860 }, { name: '小程序', value: 89230 }],
    funnelTitle: '注册 → 加微 → 外呼 → 接通 → 销转', funnel: conversionFunnel,
    tableTitle: '终端核心指标', tableMetric: '活跃人数', rows: commonRows,
    questions: ['最近几个月课堂 APP 活跃是不是下降了？', '题库 APP 新增为什么承压？', '哪个终端贡献了最多活跃？', '6 月整体表现有什么异常？'],
  },
  流量营收: {
    title: '流量营收分析',
    insight: '6 月流量营收环比增长', insightAccent: '11.8%',
    summary: '课程投放与自然流量共同回升，小程序 RPC 改善明显，题库 APP 客单价仍需关注。',
    kpis: [
      { label: '流量营收（元）', value: 12860000, delta: 11.8, tone: 'blue' },
      { label: '订单量', value: 58420, delta: 9.3, tone: 'green' },
      { label: 'RPC（元）', value: 16.8, delta: 2.4, tone: 'violet' },
      { label: '客单价（元）', value: 220.1, delta: -1.6, tone: 'amber' },
    ],
    trendTitle: '营收 + RPC 月度趋势', trendKey: '流量营收（万元）',
    rankTitle: '注册来源营收贡献',
    rankings: [{ name: '自然流量', value: 4680000 }, { name: '课程投放', value: 3920000 }, { name: '社群运营', value: 2460000 }, { name: '裂变活动', value: 1800000 }],
    funnelTitle: '访问 → 下单 → 支付', funnel: [{ label: '访问用户', value: 762400, rate: 100 }, { label: '下单用户', value: 86420, rate: 11.3 }, { label: '支付用户', value: 58420, rate: 67.6 }],
    tableTitle: '终端营收排行', tableMetric: '营收金额', rows: [{ name: '课堂 APP', metric: 5960000, growth: 13.2, share: 46.3 }, { name: '题库 APP', metric: 4210000, growth: 3.1, share: 32.7 }, { name: '小程序', metric: 2690000, growth: 22.6, share: 21.0 }],
    questions: ['6 月营收增长主要来自哪里？', '题库 APP 客单价为什么下降？', '小程序 RPC 是否改善？', '哪个注册来源贡献最高？'],
  },
  新增活跃: {
    title: '新增活跃分析',
    insight: '活跃回升，但题库 APP 新增环比下降', insightAccent: '3.6%',
    summary: '课堂 APP 和小程序活跃同向增长，题库 APP 注册到新增环节存在明显缺口。',
    kpis: [
      { label: '注册人数', value: 185420, delta: 7.4, tone: 'blue' },
      { label: '新增人数', value: 124680, delta: 4.2, tone: 'green' },
      { label: '活跃人数', value: 392510, delta: 8.6, tone: 'violet' },
      { label: '付费用户占比', value: 28.4, delta: 1.8, tone: 'amber', suffix: '%', deltaSuffix: 'pp' },
    ],
    trendTitle: '注册 / 新增 / 活跃月度趋势', trendKey: '活跃人数（千）',
    rankTitle: '终端活跃人数', rankings: [{ name: '课堂 APP', value: 168420 }, { name: '题库 APP', value: 134860 }, { name: '小程序', value: 89230 }],
    funnelTitle: '注册 → 新增 → 活跃', funnel: [{ label: '注册人数', value: 185420, rate: 100 }, { label: '新增人数', value: 124680, rate: 67.2 }, { label: '活跃人数', value: 392510, rate: 100 }],
    tableTitle: '终端新增活跃对比', tableMetric: '活跃人数', rows: commonRows,
    questions: ['题库 APP 新增为什么下降？', '课堂 APP 活跃趋势怎么样？', '新增和活跃是不是同向？', '哪个终端拖累最明显？'],
  },
  场景活跃: {
    title: '场景活跃分析',
    insight: '做题与直播场景贡献活跃增量', insightAccent: '62.4%',
    summary: '核心学习场景渗透率提升，课程详情浏览增长较慢，建议结合终端进一步拆分。',
    kpis: [
      { label: '场景活跃人数', value: 284620, delta: 9.8, tone: 'blue' },
      { label: '做题场景渗透率', value: 62.4, delta: 4.1, tone: 'green', suffix: '%', deltaSuffix: 'pp' },
      { label: '直播场景渗透率', value: 38.6, delta: 2.8, tone: 'violet', suffix: '%', deltaSuffix: 'pp' },
      { label: '课程场景渗透率', value: 31.2, delta: -0.7, tone: 'amber', suffix: '%', deltaSuffix: 'pp' },
    ],
    trendTitle: '核心场景活跃趋势', trendKey: '场景活跃（千）',
    rankTitle: '行为事件活跃排行', rankings: [{ name: '做题行为', value: 177620 }, { name: '观看直播', value: 109860 }, { name: '进入课程', value: 88840 }, { name: '学习中心', value: 72420 }],
    funnelTitle: '访问 → 进入场景 → 深度行为', funnel: [{ label: '访问用户', value: 392510, rate: 100 }, { label: '场景用户', value: 284620, rate: 72.5 }, { label: '深度用户', value: 156840, rate: 55.1 }],
    tableTitle: '核心场景排行', tableMetric: '活跃人数', rows: [{ name: '做题行为', metric: 177620, growth: 14.8, share: 62.4 }, { name: '观看直播', metric: 109860, growth: 11.2, share: 38.6 }, { name: '进入课程', metric: 88840, growth: -1.3, share: 31.2 }],
    questions: ['哪些场景活跃增长最快？', '题库 APP 做题场景怎么样？', '直播和课程场景是否同向？', '哪个场景出现异常？'],
  },
  留存分析: {
    title: '留存分析',
    insight: '新增用户 7 日留存提升', insightAccent: '2.6pp',
    summary: '课堂 APP 的次日与 7 日留存改善，小程序 30 日留存仍偏低。',
    kpis: [
      { label: '次日留存率', value: 42.8, delta: 3.2, tone: 'blue', suffix: '%', deltaSuffix: 'pp' },
      { label: '3 日留存率', value: 31.6, delta: 2.9, tone: 'green', suffix: '%', deltaSuffix: 'pp' },
      { label: '7 日留存率', value: 24.3, delta: 2.6, tone: 'violet', suffix: '%', deltaSuffix: 'pp' },
      { label: '30 日留存率', value: 12.8, delta: -0.8, tone: 'amber', suffix: '%', deltaSuffix: 'pp' },
    ],
    trendTitle: '新增用户留存趋势', trendKey: '7 日留存率',
    rankTitle: '终端 7 日留存', rankings: [{ name: '课堂 APP', value: 28.6 }, { name: '题库 APP', value: 23.4 }, { name: '小程序', value: 17.2 }],
    funnelTitle: '新增 → 次日 → 7 日 → 30 日', funnel: [{ label: '新增用户', value: 124680, rate: 100 }, { label: '次日留存', value: 53368, rate: 42.8 }, { label: '7 日留存', value: 30307, rate: 24.3 }, { label: '30 日留存', value: 15959, rate: 12.8 }],
    tableTitle: '终端留存对比', tableMetric: '7 日留存人数', rows: [{ name: '课堂 APP', metric: 18240, growth: 3.8, share: 28.6 }, { name: '题库 APP', metric: 8430, growth: 1.2, share: 23.4 }, { name: '小程序', metric: 3637, growth: -0.8, share: 17.2 }],
    questions: ['哪个终端 7 日留存最好？', '小程序 30 日留存为什么低？', '留存是否持续改善？', '哪些场景能提升留存？'],
  },
  题库特权卡: {
    title: '题库特权卡分析',
    insight: '特权卡收入增长，但二转仍有提升空间', insightAccent: '14.2%',
    summary: '月度订单和收入保持增长，做题与模考功能使用率最高，体验卡后续转化仍偏低。',
    kpis: [
      { label: '特权卡收入（元）', value: 2864000, delta: 14.2, tone: 'blue' },
      { label: '特权卡订单量', value: 26420, delta: 12.7, tone: 'green' },
      { label: '功能使用人数', value: 68420, delta: 9.6, tone: 'violet' },
      { label: '付费二转率', value: 18.6, delta: 1.4, tone: 'amber', suffix: '%', deltaSuffix: 'pp' },
    ],
    trendTitle: '特权卡订单与收入趋势', trendKey: '特权卡收入（万元）',
    rankTitle: '功能使用排行', rankings: [{ name: '章节练习', value: 46820 }, { name: '模拟考试', value: 38240 }, { name: '错题本', value: 27960 }, { name: '智能组卷', value: 18820 }],
    funnelTitle: '体验卡 → 付费卡 → 二次购买', funnel: [{ label: '体验卡用户', value: 68420, rate: 100 }, { label: '付费卡用户', value: 26420, rate: 38.6 }, { label: '二次购买', value: 4914, rate: 18.6 }],
    tableTitle: '功能使用情况', tableMetric: '使用人数', rows: [{ name: '章节练习', metric: 46820, growth: 12.6, share: 68.4 }, { name: '模拟考试', metric: 38240, growth: 8.7, share: 55.9 }, { name: '错题本', metric: 27960, growth: 6.2, share: 40.9 }],
    questions: ['特权卡收入为什么增长？', '哪些功能使用率最高？', '付费二转表现怎么样？', '体验卡后续转化哪里有问题？'],
  },
  转化加微: {
    title: '转化 / 加微 / 私域分析',
    insight: '加微率改善，但接通到销转仍是主要损耗', insightAccent: '21.5%',
    summary: '注册到加微转化提升，外呼接通率稳定，销转率仍受线索质量影响。',
    kpis: [
      { label: '注册人数', value: 185420, delta: 7.4, tone: 'blue' },
      { label: '加微人数', value: 68420, delta: 12.1, tone: 'green' },
      { label: '接通人数', value: 27310, delta: 5.8, tone: 'violet' },
      { label: '销转人数', value: 5860, delta: -1.3, tone: 'amber' },
    ],
    trendTitle: '注册与加微月度趋势', trendKey: '加微人数（千）',
    rankTitle: '终端加微贡献', rankings: [{ name: '课堂 APP', value: 29680 }, { name: '题库 APP', value: 22420 }, { name: '小程序', value: 16320 }],
    funnelTitle: '注册 → 加微 → 外呼 → 接通 → 销转', funnel: conversionFunnel,
    tableTitle: '终端转化对比', tableMetric: '销转人数', rows: [{ name: '课堂 APP', metric: 2780, growth: 8.2, share: 47.4 }, { name: '题库 APP', metric: 1820, growth: -6.4, share: 31.1 }, { name: '小程序', metric: 1260, growth: 13.7, share: 21.5 }],
    questions: ['加微率最近有没有改善？', '哪个终端销转率最低？', '接通到销转为什么损耗大？', '题库 APP 私域转化怎么样？'],
  },
  '数据 Agent': {} as PageProfile,
}

pageProfiles['数据 Agent'] = pageProfiles['运营总览']

export function deriveDemo(filters: FilterState, activePage: string) {
  const factor = (terminalMultiplier[filters.terminal] ?? 1) * (examMultiplier[filters.exam] ?? 1)
  const profile = pageProfiles[activePage] || pageProfiles['运营总览']
  return {
    factor,
    profile,
    scaled: trendSeries.map((point) => ({ ...point, revenue: Math.round(point.revenue * factor), learners: Math.round(point.learners * factor) })),
    kpis: profile.kpis.map((item) => ({ ...item, value: item.suffix ? item.value + (factor - 1) * 2 : Math.round(item.value * factor) })),
    rankings: profile.rankings.map((item) => ({ ...item, value: Math.round(item.value * factor) })),
    rows: profile.rows.map((row) => ({ ...row, metric: Math.round(row.metric * factor) })),
    funnel: profile.funnel.map((item) => ({ ...item, value: Math.round(item.value * factor) })),
  }
}

export function answerQuestion(question: string, filters: FilterState, activePage: string) {
  const scope = [filters.terminal, filters.exam].filter((item) => !item.startsWith('全部')).join('、') || '全部终端与考试'
  const lower = question.toLowerCase()
  if (activePage === '转化加微' || /加微|外呼|接通|销转|私域/.test(lower)) return {
    title: '接通到销转是私域链路的主要损耗点',
    body: `${scope}的注册到加微率为 36.9%，接通到销转率仅 21.5%；题库 APP 的线索质量和外呼跟进效率相对较弱。`,
    evidence: ['加微率 36.9%', '接通率 64.0%', '销转率 21.5%'],
  }
  if (activePage === '题库特权卡' || /特权卡|体验卡|二转|章节练习|模拟考试/.test(lower)) return {
    title: '特权卡增长由订单量与核心功能使用共同驱动',
    body: `${scope}的特权卡收入环比增长 14.2%，章节练习和模拟考试使用率最高；体验卡到付费卡转化为 38.6%，付费二转率为 18.6%。`,
    evidence: ['特权卡收入 +14.2%', '体验转付费 38.6%', '付费二转 18.6%'],
  }
  if (/营收|rpc|客单价|收入/.test(lower)) return {
    title: '营收增长主要来自课堂 APP 与小程序',
    body: `${scope}的流量营收环比增长 11.8%，课程投放和自然流量贡献主要增量；题库 APP 客单价下降 1.6%，抵消了部分订单增长。`,
    evidence: ['流量营收 +11.8%', '订单量 +9.3%', '题库客单价 -1.6%'],
  }
  if (activePage === '场景活跃' || /场景|做题|直播|课程/.test(lower)) return {
    title: '做题和直播是活跃增长最快的核心场景',
    body: `${scope}中，做题场景渗透率达到 62.4%，直播场景为 38.6%；课程场景环比下降 0.7 个百分点，需要继续拆分终端排查。`,
    evidence: ['做题 62.4%', '直播 38.6%', '课程 -0.7pp'],
  }
  if (activePage === '留存分析' || /留存/.test(lower)) return {
    title: '短期留存改善，30 日留存仍需关注',
    body: `${scope}的 7 日留存率提升 2.6 个百分点，课堂 APP 改善最明显；小程序 30 日留存仍偏低。`,
    evidence: ['次日 42.8%', '7 日 24.3%', '30 日 12.8%'],
  }
  if (/题库|下降|承压|拖累/.test(lower)) return {
    title: '题库 APP 新增是当前主要拖累项',
    body: `${scope}中，题库 APP 活跃环比下降 3.6%，注册到新增的转化缺口扩大；课堂 APP 和小程序保持增长，整体活跃仍回升 8.6%。`,
    evidence: ['题库活跃 -3.6%', '课堂活跃 +12.8%', '小程序活跃 +18.5%'],
  }
  const profile = pageProfiles[activePage] || pageProfiles['运营总览']
  return {
    title: `${profile.title}：当前核心指标整体改善`,
    body: `${scope}中，6 月活跃环比回升 8.6%，流量营收增长 11.8%；题库 APP 新增仍是主要风险项。`,
    evidence: ['活跃 +8.6%', '营收 +11.8%', '题库新增承压'],
  }
}
