import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLeague } from '../context/useLeague'

function fmt(n) {
  return n == null ? '–' : Number(n).toFixed(1)
}

function formatHeight(inches) {
  if (inches == null) return '–'
  const cm = Math.round(inches * 2.54)
  const ft = Math.floor(inches / 12)
  const rest = inches % 12
  return `${ft}′${rest}″ (${cm} cm)`
}

function formatWeight(lbs) {
  if (lbs == null) return '–'
  const kg = Math.round(lbs * 0.4536)
  return `${kg} kg (${lbs} lb)`
}

function formatSalary(v) {
  if (v == null) return '–'
  if (v === 0) return 'Not reported'
  return `$${(v / 1000000).toFixed(1)}M`
}

function formatDate(d) {
  if (!d) return '–'
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
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
  const league = useLeague()
  const { teams, players, logo, photo, route } = league
  const { id } = useParams()
  const [showDetails, setShowDetails] = useState(false)
  const player = players.find((p) => p.id === Number(id))

  if (!player) {
    return (
      <div className="team-page">
        <Link to={route} className="back-link">← Back</Link>
        <p className="muted">Player not found.</p>
      </div>
    )
  }

  const team = teams.find((t) => t.full_name === player.team)
  const gp = player.games || 0
  const mpg = player.min

  return (
    <div className="team-page">
      {team && (
        <Link to={`${route}/team/${team.id}`} className="back-link">← {team.full_name}</Link>
      )}

      <div className="player-header">
        <div className="player-photo-wrap">
          <img
            className="player-photo"
            src={photo(player.id)}
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
          {team && <img className="team-logo-xl" src={logo(team.abbreviation)} alt={team.full_name} />}
          <div>
            <h1>{player.name}</h1>
            <p className="team-sub">
              {team ? team.full_name : player.team} · Position {player.position} · #{player.jersey ?? '–'}
              {player.age ? ` · ${player.age} yrs` : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="stat-grid">
        <StatBox label="Points per game" value={fmt(player.pts)} sub={`in ${gp} games`} />
        <StatBox label="Rebounds per game" value={fmt(player.reb)} />
        <StatBox label="Assists per game" value={fmt(player.ast)} />
        <StatBox label="Minutes per game" value={fmt(mpg)} />
        <StatBox label="Steals" value={fmt(player.stl)} />
        <StatBox label="Blocks" value={fmt(player.blk)} />
      </div>

      <div className="card">
        <h3>Shooting</h3>
        <div className="stat-grid small">
          <StatBox label="FG% made" value={fmt(player.fgPct) + '%'} />
          <StatBox label="3PT" value={fmt(player.threePct) + '%'} />
          <StatBox label="Free throws" value={fmt(player.ftPct) + '%'} />
          <StatBox label="Assists/TO" value={fmt(player.astTo)} />
        </div>
      </div>

      <button
        type="button"
        className={`details-toggle${showDetails ? ' open' : ''}`}
        onClick={() => setShowDetails((v) => !v)}
        aria-expanded={showDetails}
      >
        <span className="details-toggle-icon" aria-hidden="true" />
        <span>Player details</span>
        <span className="details-chevron" aria-hidden="true">▾</span>
      </button>

      {showDetails && (
        <div className="details-panel">
          <div className="stat-grid small">
            <StatBox label="Date of birth" value={formatDate(player.birthDate)} sub={player.age ? ` ${player.age} yrs` : ''} />
            <StatBox label="Height" value={formatHeight(player.height)} />
            <StatBox label="Weight" value={formatWeight(player.weight)} />
            <StatBox label="Experience" value={player.experience == null ? '–' : `${player.experience} seasons`} />
            <StatBox label="Salary" value={formatSalary(player.salary)} />
          </div>
        </div>
      )}

      <div className="card">
        <h3>Extras</h3>
        <div className="stat-grid small">
          <StatBox label="Double-doubles" value={player.dd2 ?? '–'} />
          <StatBox label="Triple-doubles" value={player.td3 ?? '–'} />
        </div>
      </div>
    </div>
  )
}
