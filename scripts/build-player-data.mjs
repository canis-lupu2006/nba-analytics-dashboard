import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const csvPath = process.argv[2]
const DATA_DIR = resolve(ROOT, 'src', 'data')

const lines = readFileSync(csvPath, 'utf8').trim().split('\n')
const [header, ...body] = lines
const cols = header.split(',').map((c) => c.trim())

function rowObj(csvLine) {
  const parts = csvLine.split(',')
  const obj = {}
  cols.forEach((c, i) => (obj[c] = parts[i]))
  return obj
}

const rows = body.map(rowObj)

const byPlayer = new Map()
for (const r of rows) {
  if (!byPlayer.has(r.athlete_id)) {
    byPlayer.set(r.athlete_id, {
      id: r.athlete_id,
      name: r.athlete_display_name,
      position: r.athlete_position_abbreviation,
      jersey: r.athlete_jersey,
      team: r.team_display_name,
      teamSlug: r.team_slug,
      teamId: r.team_id,
      averages: {},
      misc: {},
    })
  }
  const entry = byPlayer.get(r.athlete_id)
  if (r.category === 'averages') entry.averages[r.stat_label] = Number(r.display_value)
  if (r.category === 'miscellaneous') entry.misc[r.stat_label] = Number(r.display_value)
}

const num = (v) => (v == null || Number.isNaN(v) ? null : v)

const players = [...byPlayer.values()]
  .map((p) => {
    const a = p.averages
    return {
      id: p.id,
      name: p.name,
      position: p.position,
      jersey: num(p.jersey),
      team: p.team,
      teamId: Number(p.teamId),
      games: num(a.GP),
      min: num(a.MIN),
      pts: num(a.PTS),
      reb: num(a.REB),
      ast: num(a.AST),
      stl: num(a.STL),
      blk: num(a.BLK),
      tov: num(a.TO),
      pf: num(a.PF),
      fgPct: num(a['FG%']),
      threePct: num(a['3P%']),
      ftPct: num(a['FT%']),
      dd2: num(p.misc.DD2),
      td3: num(p.misc.TD3),
      astTo: num(p.misc['AST/TO']),
    }
  })
  .filter((p) => p.team && p.games > 0)

players.sort((a, b) => (b.pts || 0) - (a.pts || 0))
writeFileSync(resolve(DATA_DIR, 'players_2026.json'), JSON.stringify(players))
console.log(`${players.length} players saved to src/data/players_2026.json`)
