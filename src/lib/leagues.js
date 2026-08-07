import nbaTeamsJson from '../data/teams.json'
import nbaGamesJson from '../data/games_2025.json'
import nbaPlayersJson from '../data/players_2026.json'
import nbaBirthsJson from '../data/player_births.json'
import wnbaTeamsJson from '../data/wnba/teams.json'
import wnbaGamesJson from '../data/wnba/games.json'
import wnbaPlayersJson from '../data/wnba/players.json'

const NBA_LOGO_ALIASES = { NOP: 'NO', UTA: 'UTAH' }

export const LEAGUES = {
  nba: {
    key: 'nba',
    label: 'NBA',
    route: '',
    base: '/',
    teams: nbaTeamsJson,
    games: nbaGamesJson,
    players: nbaPlayersJson.map((p) => ({ ...p, ...nbaBirthsJson[p.id] })),
    logo: (abbr) =>
      `https://a.espncdn.com/i/teamlogos/nba/500/${NBA_LOGO_ALIASES[abbr] || abbr}.png`,
    photo: (id) =>
      `https://a.espncdn.com/combiner/i?img=i/headshots/nba/players/full/${id}.png&w=220&h=254`,
    seasonLabel: '2025-26 Season',
  },
  wnba: {
    key: 'wnba',
    label: 'WNBA',
    route: '/wnba',
    base: '/wnba',
    teams: wnbaTeamsJson,
    games: wnbaGamesJson,
    players: wnbaPlayersJson,
    logo: (abbr) => `https://a.espncdn.com/i/teamlogos/wnba/500/${abbr.toLowerCase()}.png`,
    photo: (id) =>
      `https://a.espncdn.com/combiner/i?img=i/headshots/wnba/players/full/${id}.png&w=220&h=254`,
    seasonLabel: '2026 Season',
  },
}

export function leagueByRoute(pathname) {
  return pathname.startsWith('/wnba') ? LEAGUES.wnba : LEAGUES.nba
}
