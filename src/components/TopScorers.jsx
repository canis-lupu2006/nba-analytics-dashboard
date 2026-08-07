import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const COLORS = {
  accent: '#e8593c',
  accent2: '#ff8f5a',
  text: '#9aa1b1',
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div
      style={{
        background: '#171a22',
        border: '1px solid #262b38',
        borderRadius: 8,
        padding: '6px 10px',
        fontSize: 13,
        color: '#d7d9e0',
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 2 }}>{p.name}</div>
      <div>
        {p.team} · {p.pts.toFixed(1)} PPG
      </div>
    </div>
  )
}

export function TopScorers({ players, league }) {
  const data = useMemo(() => {
    return players
      .filter((p) => p.pts != null && p.games > 0)
      .sort((a, b) => b.pts - a.pts)
      .slice(0, 10)
      .map((p) => ({ name: p.name, team: p.team, pts: p.pts }))
  }, [players])

  return (
    <div className="card chart-card">
      <h3>Top 10 scoreurs — {league.label}</h3>
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 10 }}>
            <XAxis type="number" tick={{ fill: COLORS.text, fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={150} tick={{ fill: COLORS.text, fontSize: 11 }} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="pts" fill={COLORS.accent} radius={[0, 6, 6, 0]} barSize={14} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
