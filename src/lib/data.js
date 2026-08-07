import teamsJson from '../data/teams.json'
import gamesJson from '../data/games_2025.json'
import playersJson from '../data/players_2026.json'
import birthsJson from '../data/player_births.json'

export const teams = teamsJson
export const games = gamesJson
export const players = playersJson.map((p) => ({ ...p, ...birthsJson[p.id] }))

export const SEASON = 2025
