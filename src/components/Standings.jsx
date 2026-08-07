import { pct, diff } from '../lib/standings'

function TeamRow({ rank, row, team }) {
  return (
    <tr>
      <td className="rank">{rank}</td>
      <td className="team">
        <span className="team-badge">{team.abbreviation}</span>
        <span>{team.full_name}</span>
      </td>
      <td>{row.wins}</td>
      <td>{row.losses}</td>
      <td>{pct(row)}</td>
      <td>{row.streak > 0 ? `W${row.streak}` : `L${Math.abs(row.streak)}`}</td>
      <td>{diff(row) > 0 ? `+${diff(row)}` : diff(row)}</td>
    </tr>
  )
}

function ConferenceTable({ title, rows, teamsById }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <table className="standings-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Équipe</th>
            <th>W</th>
            <th>L</th>
            <th>PCT</th>
            <th>STRK</th>
            <th>DIFF</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <TeamRow key={row.id} rank={i + 1} row={row} team={teamsById[row.id]} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Standings({ standings, teamsById }) {
  if (!standings) return <p className="muted">Chargement du classement…</p>
  return (
    <div className="conferences">
      <ConferenceTable title="Conférence Est" rows={standings.east} teamsById={teamsById} />
      <ConferenceTable title="Conférence Ouest" rows={standings.west} teamsById={teamsById} />
    </div>
  )
}
