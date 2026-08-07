import { Link, useParams } from 'react-router-dom'
import { teams, players } from '../lib/data'
import { teamLogo } from '../lib/logos'
import { playerPhoto } from '../lib/photos'

const teamsById = Object.fromEntries(teams.map((t) => [t.id, t]))

function fmt(n) {
  return n == null ? '–' : Number(n).toFixed(1)
}

function StatBox({ label, value, sub }) {
  return (
    <div className="stat-box">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
      {sub && <span className="stat-sub">{sub}</span>}
    </div>
  )
}

export default function PlayerPage() {
  const { id } = useParams()
  const player = players.find((p) => p.id === Number(id))

  if (!player) {
    return (
      <div className="team-page">
        <Link to="/" className="back-link">← Retour</Link>
        <p className="muted">Joueur introuvable.</p>
      </div>
    )
  }

  const team = Object.values(teamsById).find((t) => t.full_name === player.team)
  const gp = player.games || 0
  const mpg = player.min

  return (
    <div className="team-page">
      <Link to={`/team/${team.id}`} className="back-link">← {team.full_name}</Link>

      <div className="player-header">
        <div className="player-photo-wrap">
          <img
            className="player-photo"
            src={playerPhoto(player.id)}
            alt={player.name}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextElementSibling.style.display = 'flex'
            }}
          />
          <div className="player-photo-fallback">
            <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
              <circle cx="32" cy="32" r="29" fill="#2a2f3c" stroke="#4a5164" strokeWidth="2.5" />
              <path d="M3 32h58" stroke="#4a5164" strokeWidth="2" fill="none" />
              <path d="M12 8c8 12 8 36 0 48M52 8c-8 12-8 36 0 48" stroke="#4a5164" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>
        <div className="team-header">
          <img className="team-logo-xl" src={teamLogo(team.abbreviation)} alt={team.full_name} />
          <div>
            <h1>{player.name}</h1>
            <p className="team-sub">
              {team.full_name} · Poste {player.position} · #{player.jersey ?? '–'}
            </p>
          </div>
        </div>
      </div>

      <div className="stat-grid">
        <StatBox label="Points / match" value={fmt(player.pts)} sub={`en ${gp} matchs`} />
        <StatBox label="Rebonds / match" value={fmt(player.reb)} />
        <StatBox label="Passes / match" value={fmt(player.ast)} />
        <StatBox label="Minutes / match" value={fmt(mpg)} />
        <StatBox label="Interceptions" value={fmt(player.stl)} />
        <StatBox label="Contres" value={fmt(player.blk)} />
      </div>

      <div className="card">
        <h3>Efficacité au tir</h3>
        <div className="stat-grid small">
          <StatBox label="Tirs réussis" value={fmt(player.fgPct) + '%'} />
          <StatBox label="À 3 points" value={fmt(player.threePct) + '%'} />
          <StatBox label="Lancers francs" value={fmt(player.ftPct) + '%'} />
          <StatBox label="Passes/pertes" value={fmt(player.astTo)} />
        </div>
      </div>

      <div className="card">
        <h3>Bonus</h3>
        <div className="stat-grid small">
          <StatBox label="Double-doubles" value={player.dd2 ?? '–'} />
          <StatBox label="Triple-doubles" value={player.td3 ?? '–'} />
        </div>
      </div>
    </div>
  )
}
