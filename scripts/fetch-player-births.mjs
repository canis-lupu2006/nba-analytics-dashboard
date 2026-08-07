import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DATA = join(ROOT, 'src', 'data')

const players = JSON.parse(readFileSync(join(DATA, 'players_2026.json'), 'utf8'))
const outPath = join(DATA, 'player_births.json')
const cache = existsSync(outPath) ? JSON.parse(readFileSync(outPath, 'utf8')) : {}

const BATCH = 20
const DELAY_MS = 250

async function fetchBio(id) {
  const res = await fetch(`https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba/athletes/${id}`)
  if (res.status === 429) {
    await new Promise((r) => setTimeout(r, 5000))
    return fetchBio(id)
  }
  if (!res.ok) return { age: null, birthDate: null, height: null, weight: null, experience: null, salary: null }
  const j = await res.json()
  return {
    age: j.age ?? null,
    birthDate: j.dateOfBirth ? j.dateOfBirth.slice(0, 10) : null,
    height: j.height ?? null,
    weight: j.weight ?? null,
    experience: j.experience?.years ?? null,
    salary: j.contract?.salary ?? null,
  }
}

let done = 0
const total = players.length

for (let i = 0; i < players.length; i += BATCH) {
  const batch = players.slice(i, i + BATCH)
  await Promise.all(
    batch.map(async (p) => {
      if (cache[p.id] && cache[p.id].salary != null) return
      cache[p.id] = await fetchBio(p.id)
      done++
    }),
  )
  console.log(`progress ${done}/${total}`)
  await new Promise((r) => setTimeout(r, DELAY_MS))
}

writeFileSync(outPath, JSON.stringify(cache, null, 2))
const filled = Object.values(cache).filter((v) => v.age != null).length
const withSalary = Object.values(cache).filter((v) => v.salary != null).length
console.log(`Done. ${filled}/${total} with age, ${withSalary}/${total} with salary. Saved to ${outPath}`)
