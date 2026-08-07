import { useMemo } from 'react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const COLORS = {
  accent: '#e8593c',
  accent2: '#ff8f5a',
  grid: '#2a2f3c',
  text: '#9aa1b1',
  textBright: '#ffffff',
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
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
      <div style={{ fontWeight: 700, marginBottom: 2 }}>{label}</div>
      {payload.map((entry, i) => (
        <div key={i}>
          {entry.name}: <b style={{ color: COLORS.accent2 }}>{entry.value}</b>
        </div>
      ))}
    </div>
  )
}

export function PlayerRadar({ player }) {
  const stats = useMemo(() => {
    const keys = ['pts', 'reb', 'ast', 'stl', 'blk']
    const values = keys.map((k) => ({ k, v: player[k] }))
    const max = Math.max(...values.map((x) => x.v).filter((v) => v != null), 1)
    return values.map(({ k, v }) => ({
      stat: { pts: 'Points', reb: 'Rebonds', ast: 'Passes', stl: 'Interceptions', blk: 'Contres' }[k],
      value: v == null ? 0 : Number(v.toFixed(1)),
      scale: v == null ? 0 : Number((v / max).toFixed(2)),
    }))
  }, [player])

  if (player.pts == null) {
    return (
      <div className="card chart-card">
        <h3>Profil de la joueuse / du joueur</h3>
        <p className="chart-note">Aucune statistique de saison disponible.</p>
      </div>
    )
  }

  return (
    <div className="card chart-card">
      <h3>Profil de la joueuse / du joueur</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={stats} outerRadius="70%">
            <PolarGrid stroke={COLORS.grid} />
            <PolarAngleAxis dataKey="stat" tick={{ fill: COLORS.text, fontSize: 12 }} />
            <PolarRadiusAxis domain={[0, 1]} tick={false} axisLine={false} />
            <Radar dataKey="scale" stroke={COLORS.accent} fill={COLORS.accent} fillOpacity={0.35} strokeWidth={2} />
            <Tooltip content={<ChartTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <p className="chart-note">
        Valeurs normalisées par rapport à la meilleure statistique ({stats.reduce((a, b) => (b.value > a.value ? b : a)).value})
      </p>
    </div>
  )
}
