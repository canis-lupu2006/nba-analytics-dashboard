import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLeague } from '../context/useLeague'

function normalize(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u2018\u2019\u0060\u00b4]/g, "'")
}

export default function Home() {
  const league = useLeague()
  const { teams, players, logo, photo, route, seasonLabel } = league
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = normalize(query)
    if (!q) return null
    return players
      .filter((p) => normalize(p.name).includes(q))
      .sort((a, b) => (b.pts || 0) - (a.pts || 0))
      .slice(0, 12)
  }, [query, players])

  return (
    <div className="home">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher une joueuse / un joueur…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        {results && (
          <div className="search-results">
            {results.length === 0 && (
              <div className="no-result">
                Aucune joueuse / aucun joueur trouvé — seuls les joueurs avec stats {seasonLabel} sont inclus
              </div>
            )}
            {results.map((p) => (
              <Link key={p.id} to={`${route}/player/${p.id}`} className="search-item">
                <img
                  className="player-thumb"
                  src={photo(p.id)}
                  alt={p.name}
                  loading="lazy"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
                <span className="search-name">{p.name}</span>
                <span className="search-meta">
                  {p.team} · {p.age ? `${p.age} ans` : `${p.games} MJ`} · {p.pts?.toFixed(1)} PPG
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <h2 className="section-title">
        Équipes {league.label} — {seasonLabel}
      </h2>
      <div className="teams-grid">
        {teams.map((t) => (
          <Link key={t.id} to={`${route}/team/${t.id}`} className="team-card">
            <img
              className="team-logo-lg"
              src={logo(t.abbreviation)}
              alt={t.full_name}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.visibility = 'hidden'
              }}
            />
            <span className="team-card-name">{t.full_name}</span>
            <span className="team-card-conf">
              {t.conference} · {t.division || 'Ligue'}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
