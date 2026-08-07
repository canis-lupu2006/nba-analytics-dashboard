import { Link, useParams } from 'react-router-dom'
import { useLeague } from '../context/useLeague'
import { buildStandings } from '../lib/standings'

function fmt(n) {
  return n == null ? '–' : Number(n).toFixed(1)
}

export default function TeamPage() {
  const league = useLeague()
  const { teams, players, games, logo, photo, route } = league
  const { id } = useParams()

  const teamsById = Object.fromEntries(teams.map((t) => [t.id, t]))
  const team = teamsById[Number(id)]

  if (!team) {
    return <p className="muted">Team not found.</p>
  }

  const roster = players
    .filter((p) => p.team === team.full_name)
    .sort((a, b) => (b.pts || 0) - (a.pts || 0))

  const standings = buildStandings(games, teamsById)
  const conf = standings[team.conference === 'East' ? 'east' : 'west'] || []
  const row = conf.find((r) => r.id === team.id)
  const rank = row ? conf.indexOf(row) + 1 : null

  return (
    <div className="team-page">
      <Link to={route} className="back-link">← All teams</Link>

      <div className="team-header">
        <img className="team-logo-xl" src={logo(team.abbreviation)} alt={team.full_name} />
        <div>
          <h1>{team.full_name}</h1>
          <p className="team-sub">
            {team.conference} · {team.division || 'League'} · {rank ? `#${rank} in conference` : ''}
            {row ? ` — ${row.wins}W ${row.losses}L` : ''}
          </p>
        </div>
      </div>

      <h2 className="section-title">Roster · {roster.length} players</h2>
      <div className="card">
        <table className="standings-table">
          <thead>
            <tr>
              <th>Player</th>
              <th>POS</th>
              <th>Age</th>
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
                  <Link to={`${route}/player/${p.id}`} className="player-link">
                    <img
                      className="player-thumb"
                      src={photo(p.id)}
                      alt={p.name}
                      loading="lazy"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                    <span>{p.name}</span>
                    <span className="chevron">›</span>
                  </Link>
                </td>
                <td>{p.position}</td>
                <td>{p.age ?? '–'}</td>
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
