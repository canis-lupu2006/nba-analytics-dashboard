import { players } from '../lib/data'

function fmt(n) {
  return n == null ? '–' : Number(n).toFixed(1)
}

export default function Players() {
  const rows = [...players].sort((a, b) => (b.pts || 0) - (a.pts || 0))

  return (
    <div className="card">
      <h3>Stats des joueurs vedettes — saison 2025-26</h3>
      <table className="standings-table">
        <thead>
          <tr>
            <th>Joueur</th>
            <th>Équipe</th>
            <th>MJ</th>
            <th>PPG</th>
            <th>RPG</th>
            <th>APG</th>
            <th>SPG</th>
            <th>BPG</th>
            <th>FG%</th>
            <th>3P%</th>
            <th>FT%</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name}>
              <td className="team">
                <span>{r.name}</span>
                <span className="player-pos">{r.position}</span>
              </td>
              <td>{r.team}</td>
              <td>{r.games}</td>
              <td>{fmt(r.pts)}</td>
              <td>{fmt(r.reb)}</td>
              <td>{fmt(r.ast)}</td>
              <td>{fmt(r.stl)}</td>
              <td>{fmt(r.blk)}</td>
              <td>{fmt(r.fgPct)}%</td>
              <td>{fmt(r.threePct)}%</td>
              <td>{fmt(r.ftPct)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
