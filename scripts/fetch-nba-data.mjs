import { writeFile, mkdir } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const API = 'https://api.balldontlie.io/v1'
const API_KEY = process.env.VITE_BALLDONTLE_API_KEY || ''

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DATA_DIR = resolve(ROOT, 'src', 'data')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function get(path) {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: API_KEY },
  })
  if (res.status === 429) {
    console.log('  rate-limited, waiting 60s...')
    await sleep(60000)
    return get(path)
  }
  if (!res.ok) throw new Error(`${res.status} on ${path}`)
  return res.json()
}

if (!API_KEY) {
  console.error('Clé API manquante. Définissez VITE_BALLDONTLE_API_KEY.')
  process.exit(1)
}

await mkdir(DATA_DIR, { recursive: true })

console.log('Fetching teams...')
const teams = await get('/teams?per_page=100')
await writeFile(resolve(DATA_DIR, 'teams.json'), JSON.stringify(teams.data))
console.log(`  ${teams.data.length} teams saved`)

console.log('Fetching games season 2025...')
const allGames = []
let cursor = 1
let page = 0
while (true) {
  page += 1
  const json = await get(
    `/games?seasons[]=2025&per_page=100&cursor=${cursor}&postseason=false`,
  )
  allGames.push(...json.data)
  console.log(`  page ${page}: +${json.data.length} (total ${allGames.length})`)
  if (!json.meta.next_cursor) break
  cursor = json.meta.next_cursor
  if (page >= 20) {
    console.log('  safety limit reached')
    break
  }
  await sleep(12000)
}

await writeFile(resolve(DATA_DIR, 'games_2025.json'), JSON.stringify(allGames))
console.log(`Done. ${allGames.length} games saved to src/data/games_2025.json`)
