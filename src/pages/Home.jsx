import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { teams, players } from '../lib/data'
import { teamLogo } from '../lib/logos'
import { playerPhoto } from '../lib/photos'

export default function Home() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null
    return players
      .filter((p) => p.name.toLowerCase().includes(q))
      .sort((a, b) => (b.pts || 0) - (a.pts || 0))
      .slice(0, 12)
  }, [query])

  return (
    <div className="home">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher un joueur (ex: Doncic, LeBron, Wembanyama…)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        {results && (
          <div className="search-results">
            {results.length === 0 && <div className="no-result">Aucun joueur trouvé</div>}
            {results.map((p) => (
              <Link key={p.id} to={`/player/${p.id}`} className="search-item">
                <img
                  className="player-thumb"
                  src={playerPhoto(p.id)}
                  alt={p.name}
                  loading="lazy"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
                <span className="search-name">{p.name}</span>
                <span className="search-meta">
                  {p.team} · {p.games} MJ · {p.pts?.toFixed(1)} PPG
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <h2 className="section-title">Équipes NBA — Saison 2025-26</h2>
      <div className="teams-grid">
        {teams.map((t) => (
          <Link key={t.id} to={`/team/${t.id}`} className="team-card">
            <img
              className="team-logo-lg"
              src={teamLogo(t.abbreviation)}
              alt={t.full_name}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.visibility = 'hidden'
              }}
            />
            <span className="team-card-name">{t.full_name}</span>
            <span className="team-card-conf">{t.conference} · {t.division}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
