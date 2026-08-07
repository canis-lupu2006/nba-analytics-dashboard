import { useMemo } from 'react'
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const COLORS = {
  accent: '#e8593c',
  accent2: '#ff8f5a',
  grid: '#2a2f3c',
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
      <div style={{ fontWeight: 700, marginBottom: 2 }}>{p.label}</div>
      <div>
        {p.wins}V - {p.losses}D
      </div>
      <div>
        <b style={{ color: COLORS.accent2 }}>{p.pct}%</b>
      </div>
    </div>
  )
}

export function TeamWinCurve({ games, teamId }) {
  const data = useMemo(() => {
    const byDate = new Map()
    for (const g of games) {
      if (g.postseason || g.status !== 'Final') continue
      const won =
        (g.home_team.id === teamId && g.home_team_score > g.visitor_team_score) ||
        (g.visitor_team.id === teamId && g.visitor_team_score > g.home_team_score)
      const lost =
        (g.home_team.id === teamId && g.home_team_score < g.visitor_team_score) ||
        (g.visitor_team.id === teamId && g.visitor_team_score < g.home_team_score)
      if (!won && !lost) continue
      byDate.set(g.date, (byDate.get(g.date) || 0) + (won ? 1 : -1))
    }
    let wins = 0
    let losses = 0
    const points = [...byDate.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, delta]) => {
        wins += delta > 0 ? 1 : 0
        losses += delta < 0 ? 1 : 0
        const gp = wins + losses
        return {
          date,
          label: date.slice(5).replace('-', '/'),
          wins,
          losses,
          pct: gp ? Math.round((wins / gp) * 1000) / 10 : 0,
        }
      })
    return points
  }, [games, teamId])

  if (data.length === 0) {
    return (
      <div className="card chart-card">
        <h3>Évolution de la saison</h3>
        <p className="chart-note">Aucun match joué pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="card chart-card">
      <h3>Évolution de la saison — % de victoires</h3>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fill: COLORS.text, fontSize: 11 }} minTickGap={40} />
            <YAxis domain={[0, 100]} tick={{ fill: COLORS.text, fontSize: 11 }} unit="%" />
            <Tooltip content={<ChartTooltip />} />
            <Line
              type="monotone"
              dataKey="pct"
              stroke={COLORS.accent2}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: COLORS.accent }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="chart-note">
        Dernier match : {data[data.length - 1].label} — {data[data.length - 1].wins}V {data[data.length - 1].losses}D
      </p>
    </div>
  )
}
