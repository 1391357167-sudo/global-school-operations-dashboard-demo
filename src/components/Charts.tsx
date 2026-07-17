import type { DailyPoint } from '../data/demoData'

function pointsToPath(values: number[], width: number, height: number, pad = 8) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  return values.map((value, index) => {
    const x = pad + (index / Math.max(1, values.length - 1)) * (width - pad * 2)
    const y = pad + (1 - (value - min) / range) * (height - pad * 2)
    return [x, y] as const
  })
}

export function Sparkline({ values, color }: { values: number[]; color: string }) {
  const points = pointsToPath(values, 104, 42, 3)
  const d = points.map(([x, y], index) => `${index ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  return <svg className="sparkline" viewBox="0 0 104 42" role="img" aria-label="指标微型趋势图"><path d={d} fill="none" stroke={color} strokeWidth="2" /></svg>
}

export function TrendChart({ data }: { data: DailyPoint[] }) {
  const width = 760
  const height = 260
  const pad = { l: 46, r: 22, t: 20, b: 34 }
  const max = Math.max(...data.map((point) => point.revenue)) * 1.08
  const points = data.map((point, index) => ({
    x: pad.l + (index / (data.length - 1)) * (width - pad.l - pad.r),
    y: pad.t + (1 - point.revenue / max) * (height - pad.t - pad.b),
    ...point,
  }))
  const line = points.map((p, index) => `${index ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const area = `${line} L${points.at(-1)!.x} ${height - pad.b} L${points[0].x} ${height - pad.b} Z`
  const peak = points.reduce((best, point) => point.revenue > best.revenue ? point : best, points[0])
  const last = points.at(-1)!
  const tickStep = Math.max(1, Math.ceil(max / 4 / 10) * 10)
  const ticks = [0, tickStep, tickStep * 2, tickStep * 3, tickStep * 4]
  const labelIndexes = Array.from(new Set([0, 1, 2, 3, 4, 5].map((step) => Math.round(step * (data.length - 1) / 5))))

  return (
    <svg className="trend-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="月度指标趋势，末期数据回升">
      <defs>
        <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1768ff" stopOpacity=".18" />
          <stop offset="100%" stopColor="#1768ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((tick) => {
        const y = pad.t + (1 - tick / max) * (height - pad.t - pad.b)
        return <g key={tick}><line x1={pad.l} y1={y} x2={width - pad.r} y2={y} stroke="#e8edf5" /><text x={pad.l - 10} y={y + 4} textAnchor="end" className="axis-label">{tick}</text></g>
      })}
      <path d={area} fill="url(#area-fill)" />
      <path d={line} fill="none" stroke="#1768ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {points.filter((_, i) => i % 3 === 0).map((p) => <circle key={p.label} cx={p.x} cy={p.y} r="3" fill="#fff" stroke="#1768ff" strokeWidth="2" />)}
      <circle cx={peak.x} cy={peak.y} r="5" fill="#fff" stroke="#1768ff" strokeWidth="3" />
      <g className="chart-annotation"><rect x={Math.max(peak.x - 48, 50)} y={peak.y - 44} width="96" height="27" rx="6" /><text x={Math.max(peak.x, 98)} y={peak.y - 26} textAnchor="middle">阶段高点 {peak.revenue}</text></g>
      <circle cx={last.x} cy={last.y} r="5" fill="#1768ff" />
      {labelIndexes.map((i) => <text key={i} x={points[i].x} y={height - 8} textAnchor="middle" className="axis-label">{points[i].label}</text>)}
    </svg>
  )
}

export function MiniBars({ values }: { values: number[] }) {
  const max = Math.max(...values)
  return <div className="mini-bars" aria-hidden="true">{values.map((value, i) => <span key={i} style={{ height: `${Math.max(18, value / max * 100)}%` }} />)}</div>
}
