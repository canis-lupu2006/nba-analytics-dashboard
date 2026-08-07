import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const csvPath = process.argv[2]
const DATA_DIR = resolve(ROOT, 'src', 'data')

const STAR_PLAYERS = [
  'Nikola Jokic',
  'Giannis Antetokounmpo',
  'Luka Doncic',
  'Shai Gilgeous-Alexander',
  'Anthony Edwards',
  'Jayson Tatum',
  'Stephen Curry',
  'LeBron James',
  'Kevin Durant',
  'Victor Wembanyama',
  'Joel Embiid',
  'Ja Morant',
  'Devin Booker',
  'Donovan Mitchell',
  'Chet Holmgren',
  'Jalen Brunson',
  'Anthony Davis',
  'Tyrese Maxey',
  'Cade Cunningham',
]

const lines = readFileSync(csvPath, 'utf8').trim().split('\n')
const [header, ...body] = lines
const cols = header.split(',').map((c) => c.trim())

function rowObj(csvLine) {
  const parts = csvLine.split(',')
  const obj = {}
  cols.forEach((c, i) => (obj[c] = parts[i]))
  return obj
}

function find(rows, name, category, statLabel) {
  const hit = rows.find(
    (r) =>
      r.athlete_display_name === name &&
      r.category === category &&
      r.stat_label === statLabel,
  )
  return hit ? hit.display_value : null
}

const rows = body.map(rowObj)
const players = []
const seen = new Set()

for (const name of STAR_PLAYERS) {
  const sample = rows.find((r) => r.athlete_display_name === name)
  if (!sample) {
    console.log(`  introuvable: ${name}`)
    continue
  }
  if (seen.has(name)) continue
  seen.add(name)

  players.push({
    name: sample.athlete_display_name,
    position: sample.athlete_position_abbreviation,
    team: sample.team_display_name,
    games: Number(find(rows, name, 'averages', 'GP')) || null,
    pts: Number(find(rows, name, 'averages', 'PTS')) || null,
    reb: Number(find(rows, name, 'averages', 'REB')) || null,
    ast: Number(find(rows, name, 'averages', 'AST')) || null,
    stl: Number(find(rows, name, 'averages', 'STL')) || null,
    blk: Number(find(rows, name, 'averages', 'BLK')) || null,
    min: Number(find(rows, name, 'averages', 'MIN')) || null,
    fgPct: Number(find(rows, name, 'averages', 'FG%')) || null,
    threePct: Number(find(rows, name, 'averages', '3P%')) || null,
    ftPct: Number(find(rows, name, 'averages', 'FT%')) || null,
    tov: Number(find(rows, name, 'averages', 'TO')) || null,
    doubleDoubles: Number(find(rows, name, 'miscellaneous', 'DD2')) || null,
    tripleDoubles: Number(find(rows, name, 'miscellaneous', 'TD3')) || null,
    astTo: Number(find(rows, name, 'miscellaneous', 'AST/TO')) || null,
    scEff: Number(find(rows, name, 'miscellaneous', 'SC-EFF')) || null,
  })
}

players.sort((a, b) => (b.pts || 0) - (a.pts || 0))
writeFileSync(
  resolve(DATA_DIR, 'players_2026.json'),
  JSON.stringify(players, null, 2),
)
console.log(`${players.length} players saved to src/data/players_2026.json`)
