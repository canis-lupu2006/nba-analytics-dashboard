import { Link, useParams } from 'react-router-dom'
import { teams, players, games } from '../lib/data'
import { buildStandings } from '../lib/standings'
import { teamLogo } from '../lib/logos'

const teamsById = Object.fromEntries(teams.map((t) => [t.id, t]))

function fmt(n) {
  return n == null ? '–' : Number(n).toFixed(1)
}

export default function TeamPage() {
  const { id } = useParams()
  const team = teamsById[Number(id)]

  if (!team) {
    return <p className="muted">Équipe introuvable.</p>
  }

  const roster = players
    .filter((p) => p.team === team.full_name)
    .sort((a, b) => (b.pts || 0) - (a.pts || 0))

  const standings = buildStandings(games, teamsById)
  const conf = standings[team.conference === 'East' ? 'east' : 'west']
  const row = conf.find((r) => r.id === team.id)
  const rank = row ? conf.indexOf(row) + 1 : null

  return (
    <div className="team-page">
      <Link to="/" className="back-link">← Toutes les équipes</Link>

      <div className="team-header">
        <img className="team-logo-xl" src={teamLogo(team.abbreviation)} alt={team.full_name} />
        <div>
          <h1>{team.full_name}</h1>
          <p className="team-sub">
            {team.conference} · {team.division} · {rank ? `#${rank} de la conférence` : ''}
            {row ? ` — ${row.wins}V ${row.losses}D` : ''}
          </p>
        </div>
      </div>

      <h2 className="section-title">Effectif · {roster.length} joueurs</h2>
      <div className="card">
        <table className="standings-table">
          <thead>
            <tr>
              <th>Joueur</th>
              <th>POS</th>
              <th>MJ</th>
              <th>PPG</th>
              <th>RPG</th>
              <th>APG</th>
              <th>SPG</th>
              <th>BPG</th>
              <th>FG%</th>
              <th>3P%</th>
            </tr>
          </thead>
          <tbody>
            {roster.map((p) => (
              <tr key={p.id}>
                <td className="team">
                  <Link to={`/player/${p.id}`} className="player-link">
                    <span>{p.name}</span>
                    <span className="chevron">›</span>
                  </Link>
                </td>
                <td>{p.position}</td>
                <td>{p.games}</td>
                <td>{fmt(p.pts)}</td>
                <td>{fmt(p.reb)}</td>
                <td>{fmt(p.ast)}</td>
                <td>{fmt(p.stl)}</td>
                <td>{fmt(p.blk)}</td>
                <td>{fmt(p.fgPct)}%</td>
                <td>{fmt(p.threePct)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
