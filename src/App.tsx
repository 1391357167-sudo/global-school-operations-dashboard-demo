import { useEffect, useMemo, useState } from 'react'
import { Icon } from './components/Icon'
import { TrendChart } from './components/Charts'

type Terminal = '题库 APP' | '课堂 APP' | '小程序'
type Business = '职教' | '青藤 AI'
type LoadState = 'idle' | 'loading' | 'ready'
type FetchMode = 'monthly' | 'realtime'

const terminalOptions: Terminal[] = ['题库 APP', '课堂 APP', '小程序']
const examOptions = ['全部考试', '八大考试', '一级建造师', '二级建造师', '中级经济师', '监理工程师', '注册安全工程师', '其他']
const anchors = [
  ['overview', '数据概览'], ['revenue', '营收'], ['active', '活跃 / 新增'], ['retention', '留存'],
  ['privilege', '特权卡'], ['conversion', '转化 / 加微'],
] as const
const aiAnchors = [['ai-source', '页面浏览'], ['ai-behavior', '浏览行为'], ['ai-conversion', '转化 / 加微']] as const

const trend = [
  ['2025-07', 258, 312], ['2025-08', 272, 329], ['2025-09', 289, 348], ['2025-10', 301, 361],
  ['2025-11', 294, 353], ['2025-12', 326, 382], ['2026-01', 341, 398], ['2026-02', 319, 371],
  ['2026-03', 354, 411], ['2026-04', 338, 396], ['2026-05', 361, 428], ['2026-06', 392, 467],
].map(([label, revenue, learners]) => ({ label: String(label), revenue: Number(revenue), learners: Number(learners) }))

const examRows = [
  ['一级建造师', '12,840', '2,180', '1,824', '¥420K', '230', '14.2%', '+18.4%'],
  ['二级建造师', '10,920', '1,820', '1,420', '¥241K', '170', '13.0%', '+12.6%'],
  ['中级经济师', '8,420', '1,420', '1,180', '¥182K', '155', '14.0%', '+9.2%'],
  ['监理工程师', '7,180', '1,180', '920', '¥147K', '160', '12.8%', '+2.4%'],
  ['注册安全工程师', '9,180', '1,520', '1,128', '¥220K', '195', '12.3%', '+14.6%'],
]

const privilegeRows = [
  ['举一反三', '5,420', '42,180', '50.0%', '+12%'], ['AI 答疑', '4,820', '28,420', '44.5%', '+24%'],
  ['记忆模式', '3,180', '18,420', '29.3%', '+6%'], ['视频首错题', '2,820', '14,180', '26.0%', '-1%'],
  ['高频易错', '1,920', '8,420', '17.7%', '-8%'], ['试卷打印', '820', '2,180', '7.6%', '-12%'],
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function ToggleRow({ checked, label, hint, onChange }: { checked: boolean; label: string; hint?: string; onChange: () => void }) {
  return <button className={`choice-row ${checked ? 'selected' : ''}`} onClick={onChange} type="button">
    <span className="check-box">{checked ? '✓' : ''}</span><span>{label}</span>{hint ? <small>{hint}</small> : null}
  </button>
}

function SideConfig({ business, setBusiness, terminals, setTerminals, ip, setIp, fetchMode, setFetchMode, start, end, setStart, setEnd, realtimeStart, realtimeEnd, setRealtimeStart, setRealtimeEnd, onGenerate, onOpenAgent, status }: {
  business: Business; setBusiness: (value: Business) => void
  terminals: Terminal[]; setTerminals: (value: Terminal[]) => void; start: string; end: string
  ip: string; setIp: (value: string) => void
  fetchMode: FetchMode; setFetchMode: (value: FetchMode) => void
  realtimeStart: string; realtimeEnd: string; setRealtimeStart: (value: string) => void; setRealtimeEnd: (value: string) => void
  setStart: (value: string) => void; setEnd: (value: string) => void; onGenerate: () => void; onOpenAgent: () => void; status: LoadState
}) {
  const allSelected = terminals.length === terminalOptions.length
  const toggleTerminal = (terminal: Terminal) => setTerminals(terminals.includes(terminal) ? terminals.filter((item) => item !== terminal) : [...terminals, terminal])
  const setQuick = (range: 'three' | 'previous' | 'current') => {
    if (range === 'three') { setStart('2026-04'); setEnd('2026-06') }
    if (range === 'previous') { setStart('2026-05'); setEnd('2026-05') }
    if (range === 'current') { setStart('2026-06'); setEnd('2026-06') }
  }
  const setRealtimeQuick = (range: 'three' | 'seven' | 'yesterday' | 'today') => {
    if (range === 'three') { setRealtimeStart('2026-07-14'); setRealtimeEnd('2026-07-16') }
    if (range === 'seven') { setRealtimeStart('2026-07-10'); setRealtimeEnd('2026-07-16') }
    if (range === 'yesterday') { setRealtimeStart('2026-07-15'); setRealtimeEnd('2026-07-15') }
    if (range === 'today') { setRealtimeStart('2026-07-16'); setRealtimeEnd('2026-07-16') }
  }
  return <aside className="config-sidebar">
    <div className="brand"><span className="brand-mark"><i /><i /><i /><i /></span><div><strong>环球网校平台运营数据看板</strong><small>公开作品集 Demo</small></div></div>
    <div className="config-scroll">
      <ConfigGroup number="01" title="业务分类">
        <ToggleRow checked={business === '职教'} label="职教" onChange={() => setBusiness('职教')} /><ToggleRow checked={business === '青藤 AI'} label="青藤 AI" hint="AI 专题页" onChange={() => setBusiness('青藤 AI')} />
      </ConfigGroup>
      <ConfigGroup number="02" title="运营类型">
        <ToggleRow checked={business === '职教'} label="日常运营" onChange={() => setBusiness('职教')} /><ToggleRow checked={business === '青藤 AI'} label="专题运营" onChange={() => setBusiness('青藤 AI')} />
      </ConfigGroup>
      {business === '职教' ? <ConfigGroup number="03" title="终端（多选）" aside="勾几个跑几个">
        <ToggleRow checked={allSelected} label="全部终端" hint="全 3 个" onChange={() => setTerminals(allSelected ? [] : [...terminalOptions])} />
        {terminalOptions.map((terminal) => <ToggleRow key={terminal} checked={terminals.includes(terminal)} label={terminal} onChange={() => toggleTerminal(terminal)} />)}
      </ConfigGroup> : <ConfigGroup number="03" title="IP 筛选" aside="专题页归属">{['全部 IP','陈泽鹏','曹导','shadow'].map((item) => <ToggleRow key={item} checked={ip === item} label={item} onChange={() => setIp(item)} />)}</ConfigGroup>}
      <ConfigGroup number="04" title="取数范围">
        <div className="mode-switch"><button className={fetchMode === 'monthly' ? 'active' : ''} onClick={() => setFetchMode('monthly')}>按月取数</button><button className={fetchMode === 'realtime' ? 'active realtime' : ''} onClick={() => setFetchMode('realtime')}>实时取数</button></div>
        {fetchMode === 'monthly' ? <><label className="month-input"><span>开始月份</span><input type="month" value={start} onChange={(event) => setStart(event.target.value)} /></label><div className="range-arrow">↓</div><label className="month-input"><span>结束月份</span><input type="month" value={end} onChange={(event) => setEnd(event.target.value)} /></label><div className="quick-dates"><button onClick={() => setQuick('three')}>近三月</button><button onClick={() => setQuick('previous')}>上月</button><button onClick={() => setQuick('current')}>本月</button></div></> : <div className="realtime-range"><div className="realtime-hint">⚡ 实时演示数据 · 建议查询不超过 7 天</div><label className="month-input"><span>开始日期</span><input type="date" value={realtimeStart} onChange={(event) => setRealtimeStart(event.target.value)} /></label><div className="range-arrow">↓</div><label className="month-input"><span>结束日期</span><input type="date" value={realtimeEnd} onChange={(event) => setRealtimeEnd(event.target.value)} /></label><div className="quick-dates realtime-quick"><button onClick={() => setRealtimeQuick('three')}>近 3 天</button><button onClick={() => setRealtimeQuick('seven')}>近 7 天</button><button onClick={() => setRealtimeQuick('yesterday')}>昨天</button><button onClick={() => setRealtimeQuick('today')}>今天</button></div></div>}
      </ConfigGroup>
    </div>
    <button className="sidebar-agent-entry" onClick={onOpenAgent}><Icon name="spark" size={18} /><span><b>数据 Agent</b><small>查询当前筛选范围</small></span><i>›</i></button>
    <button className="generate-button" disabled={(business === '职教' && !terminals.length) || status === 'loading'} onClick={onGenerate}>
      {status === 'loading' ? <><span className="button-loader" />正在生成数据…</> : <><Icon name="refresh" size={17} />确定生成数据</>}
    </button>
    <div className="config-foot"><span className={status === 'ready' ? 'online' : ''}>●</span>{status === 'ready' ? '合成数据已生成' : '等待选择条件'}</div>
  </aside>
}

function ConfigGroup({ number, title, aside, children }: { number: string; title: string; aside?: string; children: React.ReactNode }) {
  return <section className="config-group"><header><span>{number}</span><b>{title}</b>{aside ? <small>{aside}</small> : null}</header><div>{children}</div></section>
}

function SectionHeading({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
  return <div className="section-heading"><span>{number}</span><div><h2>{title}</h2><p>{subtitle}</p></div></div>
}

function PanelTitle({ title, note, state = 'ready', onLoad }: { title: string; note?: string; state?: LoadState; onLoad?: () => void }) {
  return <div className="panel-title"><div><h3>{title}</h3>{note ? <p>{note}</p> : null}</div><div className="panel-actions"><span className={`data-badge ${state}`}>{state === 'ready' ? '● 已生成' : state === 'loading' ? '◌ 生成中' : '○ 待生成'}</span><button className="outline-action">导出 CSV</button>{onLoad ? <button className="primary-action" onClick={onLoad}>生成数据</button> : null}</div></div>
}

function Kpi({ label, value, delta, tone = 'blue' }: { label: string; value: string; delta: string; tone?: string }) {
  return <article className={`metric-card ${tone}`}><span>{label}</span><strong>{value}</strong><small className={delta.startsWith('-') ? 'down' : 'up'}>较上期 {delta}</small></article>
}

function EmptyState({ onGenerate }: { onGenerate: () => void }) {
  return <div className="empty-state"><span><Icon name="database" size={25} /></span><h3>先生成一组演示数据</h3><p>选择左侧业务、终端和取数范围，再点击“确定生成数据”。</p><button onClick={onGenerate}>立即生成数据</button></div>
}

function SimpleTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return <div className="table-wrap"><table><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={`${row[0]}-${index}`}>{row.map((cell, cellIndex) => <td key={`${cell}-${cellIndex}`} className={cell.startsWith('+') ? 'up' : cell.startsWith('-') ? 'down' : ''}>{cell}</td>)}</tr>)}</tbody></table></div>
}

function SectionInsight({ label, title, detail, tone = 'blue' }: { label: string; title: string; detail: string; tone?: 'blue' | 'green' | 'amber' | 'purple' }) {
  return <div className={`section-insight ${tone}`}><span>{label}</span><div><b>{title}</b><p>{detail}</p></div><i>→</i></div>
}

function HorizontalBars({ items }: { items: { label: string; value: number; amount: string; delta: string }[] }) {
  const max = Math.max(...items.map((item) => item.value))
  return <div className="horizontal-bars">{items.map((item, index) => <div className="horizontal-row" key={item.label}><span>{item.label}</span><div><i style={{ width: `${item.value / max * 100}%` }} /></div><b>{item.amount}</b><small className={item.delta.startsWith('-') ? 'down' : 'up'}>{item.delta}</small><em>{index + 1}</em></div>)}</div>
}

function RetentionHeatmap() {
  const rows = [
    ['2026-02', '41.2%', '29.8%', '24.1%', '18.9%', '12.0%'], ['2026-03', '41.8%', '30.4%', '24.6%', '19.3%', '12.3%'],
    ['2026-04', '42.1%', '30.9%', '25.2%', '19.7%', '12.5%'], ['2026-05', '42.4%', '31.5%', '25.8%', '20.2%', '12.7%'],
    ['2026-06', '42.8%', '32.1%', '26.4%', '20.8%', '12.8%'],
  ]
  return <div className="retention-heatmap"><div className="heatmap-head"><span>注册月份</span>{['次日', '3 日', '7 日', '14 日', '30 日'].map((item) => <b key={item}>{item}</b>)}</div>{rows.map((row, rowIndex) => <div className="heatmap-row" key={row[0]}><span>{row[0]}</span>{row.slice(1).map((value, index) => <i key={value} style={{ '--heat': `${.18 + (4 - index) * .13 + rowIndex * .025}` } as React.CSSProperties}>{value}</i>)}</div>)}</div>
}

function QingtengDashboard({ ip, moduleState, loadModule }: { ip: string; moduleState: Record<string, LoadState>; loadModule: (id: string) => void }) {
  return <div className="sections ai-sections">
    <section id="ai-source" className="data-section ai-source-section"><SectionHeading number="1" title="AI 专题页浏览与来源渗透" subtitle={`当前 IP：${ip} · 用户来源、页面兴趣与终端渗透`} /><SectionInsight label="本期结论" title="专题页 UV 增长 16.8%，题库 APP 用户兴趣度最高" detail="课堂 APP 带来最多新增访问，题库 APP 的专题页渗透率和人均浏览深度领先。" tone="purple" />
      <div className="data-panel"><PanelTitle title="1.1 页面浏览数据" note="专题页 UV / PV / 人均浏览" state={moduleState['ai-source'] || 'ready'} onLoad={() => loadModule('ai-source')} /><div className="metric-grid"><Kpi label="全端活跃 UV" value="186,230" delta="+8.4%" /><Kpi label="专题页 UV" value="12,345" delta="+16.8%" tone="green" /><Kpi label="专题页 PV" value="28,891" delta="+21.3%" tone="violet" /><Kpi label="人均浏览" value="2.34" delta="+3.8%" tone="amber" /></div></div>
      <div className="ai-source-grid"><div className="data-panel"><PanelTitle title="1.2 终端渗透率" note="专题页 UV / 全端活跃 UV" /><HorizontalBars items={[{label:'题库 APP',value:7.19,amount:'7.19%',delta:'+1.2pp'},{label:'课堂 APP',value:9.77,amount:'9.77%',delta:'+1.8pp'},{label:'小程序',value:4.07,amount:'4.07%',delta:'+0.5pp'}]} /></div><div className="data-panel exam-share"><PanelTitle title="1.3 考试贡献" note="专题页 UV 构成" /><div className="composition-donut ai-donut"><div><strong>12,345</strong><span>专题页 UV</span></div><ul><li><i />建工类 <b>42.8%</b></li><li><i />财经类 <b>31.6%</b></li><li><i />其他考试 <b>25.6%</b></li></ul></div></div></div>
      <div className="data-panel"><PanelTitle title="1.4 专题页 UV / PV 周趋势" /><div className="wide-chart"><TrendChart data={trend.map((item) => ({ ...item, revenue: item.revenue * .78, learners: item.learners * .42 }))} /></div></div>
    </section>

    <section id="ai-behavior" className="data-section ai-behavior-section"><SectionHeading number="2" title="浏览行为" subtitle="场景案例 / 老师卡片 / 课程货架" /><SectionInsight label="本期结论" title="场景案例贡献最高点击，老师卡片加微意向最强" detail="课程货架曝光充足但点击偏低，建议优先优化精品日常版位与课程卡片表达。" tone="green" />
      <div className="data-panel"><PanelTitle title="2.1 CTA 总点击拆分" note="四大行为类型" state={moduleState['ai-behavior'] || 'ready'} onLoad={() => loadModule('ai-behavior')} /><div className="cta-grid">{[['场景案例','1,834','14.9%','blue'],['老师卡片','1,421','11.5%','green'],['课程货架','1,148','9.3%','purple'],['加微','489','4.0%','amber']].map((item) => <article className={item[3]} key={item[0]}><span>{item[0]}</span><strong>{item[1]}</strong><small>点击人数 · {item[2]}</small></article>)}</div></div>
      <div className="ai-behavior-grid"><div className="data-panel"><PanelTitle title="2.2 场景案例 CTA · 需求方向" /><HorizontalBars items={[{label:'职场提效',value:37.5,amount:'687',delta:'+8.4%'},{label:'副业变现',value:29,amount:'532',delta:'+12.1%'},{label:'岗位就业',value:18.4,amount:'338',delta:'+3.2%'},{label:'兴趣日常',value:15.1,amount:'277',delta:'-1.4%'}]} /></div><div className="data-panel"><PanelTitle title="2.3 老师卡片意向" /><SimpleTable headers={['IP', '课程学习', '直播学习', '加微', '合计']} rows={[['陈泽鹏','412','218','142','772'],['曹导','241','122','89','452'],['shadow','196','77','56','329']]} /></div></div>
      <div className="data-panel"><PanelTitle title="2.4 课程货架 · 需求方向 × 版位" /><SimpleTable headers={['需求方向', '免费任学', '超好课', '精品日常', '合计', '占比']} rows={[['职场提效','823','615','396','1,834','37.5%'],['副业变现','632','514','275','1,421','29.0%'],['岗位就业','412','328','162','902','18.4%'],['兴趣日常','387','221','127','735','15.1%']]} /></div>
    </section>

    <section id="ai-conversion" className="data-section ai-conversion-section"><SectionHeading number="3" title="AI 专题页转化" subtitle="专题页 UV → CTA → 课详 → 课程转化 → 加微" /><SectionInsight label="转化诊断" title="CTA 到课详是主要损耗点，加微率保持改善" detail="优先优化场景案例 CTA 与课程货架的落地承接，并按 IP 对比课详后的转化效率。" tone="amber" />
      <div className="data-panel"><PanelTitle title="3.1 五节点转化漏斗" state={moduleState['ai-conversion'] || 'ready'} onLoad={() => loadModule('ai-conversion')} /><div className="conversion-flow">{[['专题页 UV','12,345'],['CTA 点击','4,892'],['课详到达','1,203'],['课程转化','399'],['加微成功','287']].map((item,index) => <div key={item[0]}><span>{item[0]}</span><b>{item[1]}</b>{index < 4 ? <i>→</i> : null}</div>)}</div></div>
      <div className="ai-behavior-grid"><div className="data-panel"><PanelTitle title="3.2 TOP 课程转化" /><SimpleTable headers={['课程', 'IP', '课详', '转化', '转化率']} rows={[['AI 办公提效','陈泽鹏','328','126','38.4%'],['AI 副业实战','曹导','286','94','32.9%'],['AI 求职加速','shadow','218','67','30.7%']]} /></div><div className="data-panel"><PanelTitle title="3.3 加微转化" /><div className="metric-grid two"><Kpi label="加微点击" value="489" delta="+15.2%" /><Kpi label="加微成功率" value="58.7%" delta="+2.4pp" tone="green" /></div></div></div>
    </section>
    <footer>环球网校平台运营数据看板 · 青藤 AI 专题运营 · 全部数据均为固定合成数据</footer>
  </div>
}

function AgentDrawer({ open, onClose, scope, business }: { open: boolean; onClose: () => void; scope: string; business: Business }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('结论：6 月整体活跃延续回升趋势，环比增长 8.6%。\n\n数据依据：课堂 APP 与小程序贡献了主要增量，其中课堂 APP 活跃增长 12.8%，小程序增长 18.5%；题库 APP 新增和活跃仍低于整体水平。\n\n建议：优先拆分题库 APP 的注册完成率、首日启动率和考试类型，定位注册到新增环节的具体流失点。')
  const [asked, setAsked] = useState('')
  const [thinking, setThinking] = useState(false)
  const presets = business === '青藤 AI' ? ['AI 专题页流量怎么样？', '哪个内容点击最好？', 'CTA 转化瓶颈在哪？', '哪个 IP 表现最好？'] : ['最近活跃趋势怎么样？', '营收增长来自哪里？', '题库 APP 新增为什么承压？', '特权卡二转瓶颈在哪？']
  const resolveAnswer = (text: string) => {
    const lower = text.toLowerCase()
    if (business === '青藤 AI') {
      if (/流量|uv|pv|浏览/.test(lower)) return '结论：青藤 AI 专题页流量处于增长阶段，访问规模与浏览深度同步改善。\n\n数据依据：专题页 UV 为 12,345，环比增长 16.8%；PV 为 28,891，环比增长 21.3%；人均浏览达到 2.34 次。课堂 APP 带来最多新增访问，题库 APP 的专题页渗透率和人均浏览深度更高。\n\n建议：课堂 APP 适合继续扩大入口曝光，题库 APP 则应重点承接高意向用户，增加课程卡片和加微入口的转化引导。'
      if (/内容|点击|场景|卡片/.test(lower)) return '结论：场景案例是当前最大的点击来源，老师卡片则表现出更强的后链路意向。\n\n数据依据：场景案例点击人数为 1,834，占四类 CTA 的最高比例；老师卡片点击人数为 1,421，但其课程学习、直播学习和加微意向更加集中。课程货架点击人数为 1,148，曝光与点击之间仍存在差距。\n\n建议：保留场景案例作为主要流量入口，同时强化老师卡片的课程和加微承接；课程货架应优先测试标题、封面和版位排序。'
      if (/转化|cta|瓶颈|漏斗/.test(lower)) return '结论：专题页最大的转化损耗发生在 CTA 点击到课详到达阶段。\n\n数据依据：12,345 名专题页访客产生 4,892 次 CTA 点击，但最终只有 1,203 次课详到达，阶段转化率为 24.6%；课详到课程转化为 33.2%，相对稳定。\n\n原因判断：CTA 表达与落地内容可能存在预期差异，也可能存在加载速度或跳转链路问题。\n\n建议：按 CTA 类型、终端和 IP 拆分到达率，并优先测试按钮文案、落地页首屏及跳转性能。'
      if (/ip|陈泽鹏|曹导|shadow/.test(lower)) return '结论：陈泽鹏目前是综合表现最好的 IP，既有较高内容兴趣，也有更完整的转化承接。\n\n数据依据：陈泽鹏老师卡片意向合计 772，其中课程学习 412、直播学习 218、加微 142，三项均领先；曹导合计 452，排名第二；shadow 合计 329，流量规模和后链路转化仍有提升空间。\n\n建议：陈泽鹏适合承担主推内容和高意向课程，曹导可继续扩大直播场景，shadow 应先优化课程定位和卡片卖点。'
      return '结论：当前青藤 AI 专题页整体流量增长，但流量增长尚未完全转化为课详和课程转化。\n\n数据依据：专题页 UV 环比增长 16.8%，场景案例贡献最高点击；CTA 到课详阶段转化率仅 24.6%，是当前最明显的链路损耗。\n\n建议：下一步可以分别从流量来源、内容点击、IP 表现和转化漏斗四个方向继续追问，我会结合当前筛选范围给出对应分析。'
    }
    if (/活跃|新增|注册|趋势/.test(lower)) return '结论：6 月活跃规模明显回升，但不同终端之间的增长并不均衡。\n\n数据依据：活跃人数为 392,510，环比增长 8.6%；课堂 APP 与小程序贡献主要增量，分别增长 12.8% 和 18.5%。题库 APP 新增仍然承压，注册到新增的转化缺口有所扩大。\n\n建议：保持课堂 APP 和小程序的增长动作，同时重点拆分题库 APP 的注册完成、首日启动和首次做题链路。'
    if (/营收|订单|rpc|客单价/.test(lower)) return '结论：本期营收增长主要由订单规模推动，而不是客单价提升。\n\n数据依据：流量营收为 1,286 万元，环比增长 11.8%；订单量增长 9.3%，RPC 增长 2.4%，客单价则小幅下降 1.6%。课堂 APP 贡献总营收的 46.3%，自然流量和课程投放是主要增长来源。\n\n建议：继续放大高转化来源，同时关注题库 APP 客单价下降，按考试和课程类型排查低价订单占比。'
    if (/题库|承压|下降/.test(lower)) return '结论：题库 APP 的压力主要集中在注册到新增以及首次核心行为的激活阶段。\n\n数据依据：题库 APP 活跃环比下降 3.6%，而课堂 APP 和小程序保持增长；整体注册规模增长，但题库 APP 新增没有同步改善，说明问题不在流量入口，而在注册后的承接。\n\n建议：按考试类型检查注册完成率、首日启动率和首次做题率，并对新用户首日路径进行漏斗对比。'
    if (/特权卡|体验卡|二转|续费/.test(lower)) return '结论：特权卡体验卡二转的主要瓶颈在激活后的深度使用，而不是领取或激活。\n\n数据依据：体验卡领取 7,020，激活 5,756，激活率达到 82%；但深度使用仅 2,648，从激活到深度使用流失 54%。最终转付费 410，整体二转率为 5.84%。\n\n建议：重点优化激活后 7 天的功能引导，围绕举一反三、AI 答疑等高渗透功能设计任务和触达。'
    if (/留存/.test(lower)) return '结论：短期留存持续改善，但长期留存仍未形成同步增长。\n\n数据依据：次日留存为 42.8%，较上期提升 1.4 个百分点；7 日留存为 26.4%，提升 2.6 个百分点；30 日留存仅 12.8%，并较上期下降 0.6 个百分点。\n\n建议：继续保留首周有效动作，同时针对第 8—30 天增加学习计划、做题提醒和课程回访，改善长期回访。'
    return '结论：当前职教业务整体表现改善，但终端之间仍存在结构性差异。\n\n数据依据：营收环比增长 11.8%，活跃增长 8.6%；课堂 APP 和小程序表现较好，题库 APP 新增和长期留存仍是主要风险项。\n\n建议：可以继续问我营收、活跃、留存、题库 APP 或特权卡，我会按照当前终端、考试和取数范围提供更具体的演示分析。'
  }
  const ask = (input?: string) => {
    const text = (input ?? question).trim()
    if (!text || thinking) return
    setAsked(text); setQuestion(''); setThinking(true)
    window.setTimeout(() => { setAnswer(resolveAnswer(text)); setThinking(false) }, 420)
  }
  return <aside className={`agent-drawer ${open ? 'open' : ''}`}><header><div><b>数据 Agent</b><span>{scope}</span></div><button onClick={onClose}>×</button></header><div className="agent-body"><div className="agent-greeting-card"><Icon name="spark" size={18} /><div><b>{business === '青藤 AI' ? '青藤 AI 专题分析助手' : '职教运营分析助手'}</b><span>点击推荐问题，或在下方自由提问</span></div></div><div className="agent-suggestions">{presets.map((item) => <button key={item} onClick={() => ask(item)}>{item}<span>›</span></button>)}</div>{asked ? <div className="user-question">{asked}</div> : null}<div className={`agent-bubble ${thinking ? 'thinking' : ''}`}>{thinking ? <><span className="thinking-dots"><i /><i /><i /></span>正在分析当前筛选范围…</> : answer}<small>基于当前页面固定合成数据 · Demo 预设问答</small></div></div><form onSubmit={(event) => { event.preventDefault(); ask() }}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="询问当前数据…" /><button type="submit" disabled={thinking}><Icon name="send" size={17} /></button></form></aside>
}

export default function App() {
  const [business, setBusiness] = useState<Business>('职教')
  const [terminals, setTerminals] = useState<Terminal[]>(['题库 APP', '课堂 APP'])
  const [ip, setIp] = useState('全部 IP')
  const [fetchMode, setFetchMode] = useState<FetchMode>('monthly')
  const [start, setStart] = useState('2026-06')
  const [end, setEnd] = useState('2026-06')
  const [realtimeStart, setRealtimeStart] = useState('2026-07-14')
  const [realtimeEnd, setRealtimeEnd] = useState('2026-07-16')
  const [exam, setExam] = useState('全部考试')
  const [status, setStatus] = useState<LoadState>('idle')
  const [moduleState, setModuleState] = useState<Record<string, LoadState>>({})
  const [agentOpen, setAgentOpen] = useState(false)
  const [generatedAt, setGeneratedAt] = useState('尚未生成')
  const hasQuestionBank = terminals.includes('题库 APP')
  const activeRange = fetchMode === 'monthly' ? `${start} ～ ${end}` : `${realtimeStart} ～ ${realtimeEnd}`
  const scope = useMemo(() => business === '青藤 AI' ? `${activeRange} · 青藤 AI · ${ip}` : `${activeRange} · ${terminals.join('、') || '未选终端'} · ${exam}`, [business, activeRange, terminals, exam, ip])

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('business', business === '青藤 AI' ? 'qingteng' : 'zhijiao'); params.set('mode', fetchMode); params.set('start', fetchMode === 'monthly' ? start : realtimeStart); params.set('end', fetchMode === 'monthly' ? end : realtimeEnd); params.set('terminal', terminals.join(',')); params.set('exam', exam); params.set('ip', ip)
    window.history.replaceState(null, '', `?${params.toString()}`)
  }, [business, fetchMode, start, end, realtimeStart, realtimeEnd, terminals, exam, ip])

  const generate = () => {
    if ((business === '职教' && !terminals.length) || status === 'loading') return
    setStatus('loading')
    window.setTimeout(() => {
      setStatus('ready'); setGeneratedAt('2026-07-16 14:30'); setModuleState(Object.fromEntries([...anchors, ...aiAnchors].map(([id]) => [id, 'ready'])))
    }, 720)
  }

  const loadModule = (id: string) => {
    setModuleState((current) => ({ ...current, [id]: 'loading' }))
    window.setTimeout(() => setModuleState((current) => ({ ...current, [id]: 'ready' })), 520)
  }

  const ready = status === 'ready'
  return <div className="original-shell">
    <SideConfig business={business} setBusiness={(value) => { setBusiness(value); setStatus('idle') }} terminals={terminals} setTerminals={setTerminals} ip={ip} setIp={setIp} fetchMode={fetchMode} setFetchMode={(value) => { setFetchMode(value); setStatus('idle') }} start={start} end={end} setStart={setStart} setEnd={setEnd} realtimeStart={realtimeStart} realtimeEnd={realtimeEnd} setRealtimeStart={setRealtimeStart} setRealtimeEnd={setRealtimeEnd} onGenerate={generate} onOpenAgent={() => setAgentOpen(true)} status={status} />
    <main className="data-workspace">
      <header className="workspace-head"><div><h1>{business === '青藤 AI' ? '青藤 AI · 专题运营' : '职教 · 日常运营'}</h1><p>{business === '青藤 AI' ? 'AI 专题页浏览、行为与转化分析' : '按原看板数据维度制作的公开合成数据 Demo'}</p></div><button className="agent-entry" onClick={() => setAgentOpen(true)}><Icon name="spark" size={17} />问数据 Agent</button></header>
      <div className="context-bar"><span className="path">{business} <b>·</b> {business === '青藤 AI' ? '专题运营 · AI 专题页' : '日常运营 · 终端日常'}</span><span>{fetchMode === 'monthly' ? '月份' : '实时日期'}</span><strong>{activeRange}</strong>{business === '青藤 AI' ? <><span>IP</span><strong>{ip}</strong></> : <><span>终端</span><strong>{terminals.length === 3 ? '全部终端' : terminals.join('、') || '未选择'}</strong><span>考试</span><select value={exam} onChange={(event) => setExam(event.target.value)}>{examOptions.map((item) => <option key={item}>{item}</option>)}</select></>}<small>数据更新：{generatedAt}</small></div>
      <nav className="anchor-bar">{(business === '青藤 AI' ? aiAnchors : anchors.filter(([id]) => id !== 'privilege' || hasQuestionBank)).map(([id, label]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}</nav>

      {!ready ? <EmptyState onGenerate={generate} /> : business === '青藤 AI' ? <QingtengDashboard ip={ip} moduleState={moduleState} loadModule={loadModule} /> : <div className="sections">
        <section id="overview" className="data-section overview-section"><SectionHeading number="0" title="数据概览" subtitle="本次生成范围 · 业务分析地图 · 数据状态" /><div className="scope-summary"><div><span>业务</span><b>职教 · 日常运营</b></div><div><span>终端</span><b>{terminals.join('、')}</b></div><div><span>{fetchMode === 'monthly' ? '按月取数' : '实时取数'}</span><b>{activeRange}</b></div><div><span>数据性质</span><b>固定合成数据</b></div></div><div className="analysis-map">{[
          ['revenue','01','营收','流量、终端与考试拆分','¥1,286万','blue'], ['active','02','活跃 / 新增','注册、活跃与场景渗透','39.3万','green'], ['retention','03','留存','注册与场景回访','42.8%','purple'], ...(hasQuestionBank ? [['privilege','04','特权卡','功能使用与体验卡二转','14.4%','amber']] : []), ['conversion','05','转化 / 私域','加微、课详与课程转化','58.8%','cyan'],
        ].map((item) => <button key={item[0]} className={String(item[5])} onClick={() => scrollTo(String(item[0]))}><small>{item[1]}</small><b>{item[2]}</b><span>{item[3]}</span><strong>{item[4]}</strong><i>查看分析 →</i></button>)}</div><div className="notice">本 Demo 保留原看板分析结构和交互流程，所有数值均为公开展示用合成数据，不连接公司后台。</div></section>

        <section id="revenue" className="data-section revenue-section"><SectionHeading number="1" title="营收" subtitle="流量营收（按注册来源） + 终端营收（按当前活跃终端）+ 八大考试拆分" /><SectionInsight label="本期结论" title="营收环比增长 11.8%，课堂 APP 贡献接近一半" detail="订单量增长快于客单价，增长主要由自然流量、课程投放和课堂 APP 共同驱动。" />
          <div className="data-panel"><PanelTitle title="1.1 流量营收" note="按注册来源 / 考试拆分" state={moduleState.revenue || 'idle'} onLoad={() => loadModule('revenue')} /><div className="metric-grid"><Kpi label="流量营收" value="¥12,860,000" delta="+11.8%" /><Kpi label="订单量" value="58,420" delta="+9.3%" tone="green" /><Kpi label="RPC" value="¥16.8" delta="+2.4%" tone="violet" /><Kpi label="客单价" value="¥220.1" delta="-1.6%" tone="amber" /></div><div className="dual-charts"><div><h4>订单量月度走势</h4><TrendChart data={trend} /></div><div><h4>营收 + RPC 月度走势</h4><TrendChart data={trend.map((item) => ({ ...item, revenue: item.revenue * 1.12 }))} /></div></div><details><summary>详细指标表（11 组指标全展开）</summary><SimpleTable headers={['月份', '访客数', '下单人数', '订单量', '营收', 'RPC']} rows={trend.slice(-4).map((item) => [item.label, `${item.learners * 182}`, `${item.revenue * 38}`, `${item.revenue * 44}`, `¥${item.revenue * 3280}`, `${(item.revenue / 21).toFixed(1)}`])} /></details></div>
          <div className="data-panel"><PanelTitle title="1.2 终端营收" note="按用户活跃终端拆分" state={moduleState.revenue || 'idle'} onLoad={() => loadModule('revenue')} /><div className="visual-split"><div><h4>终端营收构成</h4><HorizontalBars items={[{label:'课堂 APP',value:46.3,amount:'¥596万',delta:'+13.2%'},{label:'题库 APP',value:32.7,amount:'¥421万',delta:'+3.1%'},{label:'小程序',value:21,amount:'¥269万',delta:'+22.6%'}].filter((item) => terminals.includes(item.label as Terminal))} /></div><div className="composition-donut"><div><strong>¥1,286万</strong><span>总营收</span></div><ul><li><i />课堂 APP <b>46.3%</b></li><li><i />题库 APP <b>32.7%</b></li><li><i />小程序 <b>21.0%</b></li></ul></div></div></div>
          <div className="data-panel revenue-exam-panel"><PanelTitle title="1.3 八大考试营收拆分" note="营收模块内 · 各考试营收、活跃与付费效率横向对比" state={moduleState.revenue || 'idle'} onLoad={() => loadModule('revenue')} /><SimpleTable headers={['考试', '活跃 UV', '注册量', '订单量', '金额', 'ARPU', '付费率', '营收同比']} rows={examRows} /></div>
        </section>

        <section id="active" className="data-section active-section"><SectionHeading number="2" title="活跃 / 新增" subtitle="月度透视 · 同比 · 趋势 · 考试拆分 · 场景渗透" /><SectionInsight label="本期结论" title="活跃回升 8.6%，题库 APP 新增仍然承压" detail="课堂 APP 与小程序贡献主要增量；题库 APP 需要继续排查注册到新增的转化缺口。" tone="green" />
          <div className="data-panel"><PanelTitle title="2.1 新增活跃" state={moduleState.active || 'idle'} onLoad={() => loadModule('active')} /><div className="terminal-tabs">{terminals.map((terminal, index) => <button className={index === 0 ? 'active' : ''} key={terminal}>{terminal}</button>)}</div><div className="metric-grid three"><Kpi label="注册人数" value="185,420" delta="+7.4%" /><Kpi label="新增人数" value="124,680" delta="+4.2%" tone="green" /><Kpi label="活跃人数" value="392,510" delta="+8.6%" tone="violet" /></div><div className="wide-chart"><h4>注册 / 新增 / 活跃月度趋势</h4><TrendChart data={trend} /></div></div>
          <div className="data-panel"><PanelTitle title="2.2 场景活跃" note="渗透率 = 该场景活跃 / 总活跃" state={moduleState.active || 'idle'} onLoad={() => loadModule('active')} /><HorizontalBars items={[{label:'做题',value:62.4,amount:'244,920',delta:'+6.8%'},{label:'直播',value:38.6,amount:'151,490',delta:'+4.1%'},{label:'课程学习',value:31.8,amount:'124,680',delta:'-0.7%'},{label:'搜索',value:22.5,amount:'88,320',delta:'+2.3%'}]} /><div className="chart-footnote">条形长度表示场景渗透率 · 右侧为活跃人数与较上期变化</div></div>
        </section>

        <section id="retention" className="data-section retention-section"><SectionHeading number="3" title="留存" subtitle="注册 → 活跃留存 + 活跃场景留存" /><SectionInsight label="本期结论" title="短期留存持续改善，30 日留存仍是主要短板" detail="6 月次日与 7 日留存均改善，但长期回访尚未同步提升。" tone="purple" /><div className="data-panel"><PanelTitle title="3.1 注册活跃留存矩阵" note="颜色越深代表留存率越高" state={moduleState.retention || 'idle'} onLoad={() => loadModule('retention')} /><div className="metric-grid three"><Kpi label="次日留存" value="42.8%" delta="+1.4pp" /><Kpi label="7 日留存" value="26.4%" delta="+2.6pp" tone="green" /><Kpi label="30 日留存" value="12.8%" delta="-0.6pp" tone="amber" /></div><RetentionHeatmap /></div><div className="data-panel"><PanelTitle title="3.2 活跃场景留存" note="按做题、直播、课程学习拆分" state={moduleState.retention || 'idle'} onLoad={() => loadModule('retention')} /><HorizontalBars items={[{label:'做题 · 7日',value:29.4,amount:'29.4%',delta:'+2.1pp'},{label:'直播 · 7日',value:25.1,amount:'25.1%',delta:'+1.4pp'},{label:'课程 · 7日',value:22.6,amount:'22.6%',delta:'-0.3pp'}]} /></div></section>

        {hasQuestionBank ? <section id="privilege" className="data-section privilege-section"><SectionHeading number="4" title="题库 APP · 特权卡" subtitle="仅在勾选题库 APP 时展示 · 特权卡量 / 渗透率 / 6 功能 / 体验卡二转" /><SectionInsight label="题库专属" title="体验卡领取增长 24.1%，但激活后的深度使用流失明显" detail="激活到深度使用流失 54%，是体验卡二转链路的首要优化节点。" tone="amber" /><div className="terminal-only-label"><Icon name="course" size={15} />题库 APP 专属业务</div><div className="data-panel"><PanelTitle title="4.1 特权卡概览" state={moduleState.privilege || 'idle'} onLoad={() => loadModule('privilege')} /><div className="metric-grid"><Kpi label="特权卡用户" value="10,840" delta="+18.6%" /><Kpi label="渗透率" value="14.4%" delta="+2.1pp" tone="green" /><Kpi label="付费特权卡" value="3,820" delta="+8.9%" tone="violet" /><Kpi label="体验卡领取" value="7,020" delta="+24.1%" tone="amber" /></div><div className="privilege-grid"><div><h4>4.2 六大特权卡功能</h4><SimpleTable headers={['功能位', '人数', '次数', '渗透率', '同比']} rows={privilegeRows} /></div><div className="mini-funnel"><h4>4.3 体验卡二转漏斗</h4>{[['领取','7,020','100%'],['激活','5,756','82.0%'],['深度使用','2,648','46.0%'],['续费意向','662','25.0%'],['转付费','410','5.84%']].map((item, index) => <div key={item[0]} style={{ width: `${100 - index * 10}%` }}><span>{item[0]}</span><b>{item[1]}</b><small>{item[2]}</small></div>)}<p>瓶颈：激活 → 深度使用流失 54%</p></div></div></div></section> : null}

        <section id="conversion" className="data-section conversion-section"><SectionHeading number="5" title="转化 / 加微 / 私域" subtitle="加微点击率 / 成功率 / 课详到达 / 课程转化" /><SectionInsight label="本期结论" title="加微成功率改善，但课详到课程转化仍有明显损耗" detail="建议优先拆分课程、考试和终端，定位课详到达后的转化差异。" tone="amber" /><div className="data-panel"><PanelTitle title="5.1 转化与加微" state={moduleState.conversion || 'idle'} onLoad={() => loadModule('conversion')} /><div className="metric-grid"><Kpi label="加微点击人数" value="5,820" delta="+12.1%" /><Kpi label="加微点击率" value="7.7%" delta="+0.4pp" tone="green" /><Kpi label="实际加微人数" value="3,420" delta="+8.9%" tone="violet" /><Kpi label="加微成功率" value="58.8%" delta="+1.8pp" tone="amber" /></div><div className="conversion-flow">{[['活跃用户','75,530'],['加微点击','5,820'],['实际加微','3,420'],['课详到达','1,203'],['课程转化','399']].map((item, index) => <div key={item[0]}><span>{item[0]}</span><b>{item[1]}</b>{index < 4 ? <i>→</i> : null}</div>)}</div><div className="operation-note"><b>链路瓶颈</b><p>课详到达 → 课程转化仅 33.2%。当前重点关注加微点击率、加微成功率、课详到达和课程转化。</p></div></div></section>
        <footer>环球网校平台运营数据看板 · 作品集 Demo · 保留原看板信息架构 · 全部数据均为固定合成数据</footer>
      </div>}
    </main>
    <AgentDrawer open={agentOpen} onClose={() => setAgentOpen(false)} scope={scope} business={business} />
  </div>
}
