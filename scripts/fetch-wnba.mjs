import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'src', 'data', 'wnba')
mkdirSync(OUT, { recursive: true })

const LEAGUE = 'wnba'
const SEASON = 2026
const API = `https://sports.core.api.espn.com/v2/sports/basketball/leagues/${LEAGUE}`

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

async function getJson(url, tries = 5) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`${res.status}`)
      return await res.json()
    } catch (err) {
      if (i === tries - 1) throw err
      await delay(1500 * (i + 1))
    }
  }
}

// ---------- 1. Teams ----------
console.log('Fetching teams...')
const teamList = await getJson(`${API}/teams?limit=50`)
const teams = []
for (const t of teamList.items || []) {
  const detail = await getJson(t.$ref)
  let conference = null
  if (detail.groups) {
    const g = await getJson(detail.groups.$ref)
    conference = g.name.replace(' Conference', '')
    if (conference === 'Western') conference = 'West'
    if (conference === 'Eastern') conference = 'East'
  }
  teams.push({
    id: Number(detail.id),
    conference,
    division: null,
    city: detail.location,
    name: detail.name,
    full_name: detail.displayName,
    abbreviation: detail.abbreviation,
  })
}
const leagueTeams = teams.filter((t) => t.conference === 'East' || t.conference === 'West')
writeFileSync(join(OUT, 'teams.json'), JSON.stringify(leagueTeams, null, 2))
console.log(`Teams: ${leagueTeams.length} (league only, dropped ${teams.length - leagueTeams.length} national teams)`)

// ---------- 2. Games via scoreboard pagination ----------
console.log('Fetching games...')
const games = new Map()
const windows = [
  ['20260401', '20260430'],
  ['20260501', '20260531'],
  ['20260601', '20260630'],
  ['20260701', '20260731'],
  ['20260801', '20260815'],
]
for (const [start, end] of windows) {
  const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/${LEAGUE}/scoreboard?dates=${start}-${end}`
  const j = await getJson(url)
  for (const ev of j.events || []) {
    if (!ev.status?.type?.completed) continue
    const comp = ev.competitions?.[0]
    if (!comp || comp.competitors.length < 2) continue
    const [away, home] = comp.competitors.sort((a, b) => (a.homeAway === 'home' ? 1 : -1) - (b.homeAway === 'home' ? 1 : -1))
    const isPlayoff = ev.season?.type !== 2
    games.set(Number(ev.id), {
      id: Number(ev.id),
      date: ev.date.slice(0, 10),
      season: SEASON,
      status: 'Final',
      status_state: 'final',
      postseason: isPlayoff,
      home_team_score: Number(home.score) || 0,
      visitor_team_score: Number(away.score) || 0,
      datetime: ev.date,
      home_team: { id: Number(home.team.id), full_name: home.team.displayName },
      visitor_team: { id: Number(away.team.id), full_name: away.team.displayName },
    })
  }
  console.log(`  window ${start}-${end}: ${(j.events || []).length} events`)
  await delay(300)
}
const gamesArr = [...games.values()].filter((g) => {
  const known = new Set(leagueTeams.map((t) => t.id))
  return known.has(g.home_team.id) && known.has(g.visitor_team.id)
})
writeFileSync(join(OUT, 'games.json'), JSON.stringify(gamesArr, null, 2))
console.log(`Games: ${gamesArr.length} (dropped ${games.size - gamesArr.length} national-team games)`)

// ---------- 3. Rosters + player bios/stats ----------
console.log('Fetching rosters and player stats...')
const players = []
const seen = new Set()

for (const t of leagueTeams) {
  const rosterRef = `${API}/seasons/${SEASON}/teams/${t.id}/athletes?limit=50`
  const roster = await getJson(rosterRef)
  for (const a of roster.items || []) {
    const aid = Number(a.$ref.match(/athletes\/(\d+)/)?.[1])
    if (!aid || seen.has(aid)) continue
    seen.add(aid)
    const bio = await getJson(`${API}/athletes/${aid}`)
    const statUrl = `${API}/seasons/${SEASON}/types/2/athletes/${aid}/statistics`
    let stat = {}
    try {
      const st = await getJson(statUrl)
      const total = Array.isArray(st.splits) ? (st.splits || []).find((s) => s.type === 'total') : st.splits
      const cats = total?.categories || []
      const get = (catName, statName) => {
        const cat = cats.find((c) => c.name === catName)
        const s = cat?.stats?.find((x) => x.name === statName)
        return s ? Number(s.value) : null
      }
      stat = {
        games: get('general', 'gamesPlayed'),
        min: get('general', 'avgMinutes'),
        pts: get('offensive', 'avgPoints'),
        reb: get('general', 'avgRebounds'),
        ast: get('offensive', 'avgAssists'),
        stl: get('defensive', 'avgSteals'),
        blk: get('defensive', 'avgBlocks'),
        fgPct: get('offensive', 'fieldGoalPct') ?? null,
        threePct: get('offensive', 'threePointPct') ?? null,
        ftPct: get('offensive', 'freeThrowPct') ?? null,
      }
    } catch {
      stat = {}
    }
    players.push({
      id: aid,
      name: bio.fullName,
      position: bio.position?.abbreviation ?? null,
      jersey: bio.jersey ? String(bio.jersey) : null,
      team: t.full_name,
      teamId: t.id,
      age: bio.age ?? null,
      birthDate: bio.dateOfBirth ? bio.dateOfBirth.slice(0, 10) : null,
      height: bio.height ?? null,
      weight: bio.weight ?? null,
      experience: bio.experience?.years ?? null,
      salary: bio.contract?.salary ?? null,
      ...stat,
    })
  }
  console.log(`  roster ${t.full_name}: ${players.length} players so far`)
  await delay(200)
}

writeFileSync(join(OUT, 'players.json'), JSON.stringify(players, null, 2))
const withStats = players.filter((p) => p.pts != null).length
console.log(`Players: ${players.length} (${withStats} with stats)`)
console.log('Saved to src/data/wnba/')
