import { readFileSync } from 'node:fs'
import { buildStandings } from '../src/lib/standings.js'

const games = JSON.parse(readFileSync('src/data/games_2025.json', 'utf8'))
const teams = JSON.parse(readFileSync('src/data/teams.json', 'utf8'))
const byId = Object.fromEntries(teams.map((t) => [t.id, t]))

const s = buildStandings(games, byId)
console.log(
  'EST top5:',
  s.east
    .slice(0, 5)
    .map((r) => `${r.name} W${r.wins} L${r.losses} ${(r.wins / (r.wins + r.losses)).toFixed(3)}`)
    .join(' | '),
)
console.log(
  'WEST top5:',
  s.west
    .slice(0, 5)
    .map((r) => `${r.name} W${r.wins} L${r.losses} ${(r.wins / (r.wins + r.losses)).toFixed(3)}`)
    .join(' | '),
)
const total =
  s.east.reduce((a, r) => a + r.wins + r.losses, 0) +
  s.west.reduce((a, r) => a + r.wins + r.losses, 0)
console.log('Total W+L:', total, '(attendu ~2460 pour 1230 matchs)')
