export function buildStandings(games, teamsById) {
  const rows = new Map()
  const byDate = [...games].sort((a, b) => a.date.localeCompare(b.date))
  const isRegular = (g) => g.postseason === false && g.status === 'Final'

  for (const game of byDate) {
    if (!isRegular(game)) continue

    const { home_team, visitor_team, home_team_score, visitor_team_score } = game

    for (const [team, scored, allowed] of [
      [home_team, home_team_score, visitor_team_score, visitor_team],
      [visitor_team, visitor_team_score, home_team_score, home_team],
    ]) {
      if (scored == null || allowed == null) continue
      const id = team.id
      if (!rows.has(id)) {
        rows.set(id, {
          id,
          name: teamsById[id]?.full_name || team.full_name,
          conference: teamsById[id]?.conference || team.conference,
          division: teamsById[id]?.division || team.division,
          wins: 0,
          losses: 0,
          pf: 0,
          pa: 0,
          streak: 0,
          lastGameWin: null,
        })
      }
      const row = rows.get(id)
      row.pf += scored
      row.pa += allowed
      if (scored > allowed) {
        row.wins += 1
        if (row.lastGameWin === true) {
          row.streak += 1
        } else {
          row.streak = 1
        }
        row.lastGameWin = true
      } else {
        row.losses += 1
        if (row.lastGameWin === false) {
          row.streak -= 1
        } else {
          row.streak = -1
        }
        row.lastGameWin = false
      }
    }
  }

  const sortKey = (r) => r.wins / Math.max(1, r.wins + r.losses)

  const east = [...rows.values()].filter((r) => r.conference === 'East').sort((a, b) => sortKey(b) - sortKey(a))
  const west = [...rows.values()].filter((r) => r.conference === 'West').sort((a, b) => sortKey(b) - sortKey(a))

  return { east, west }
}

export function pct(row) {
  const gp = row.wins + row.losses
  return gp === 0 ? '0.000' : (row.wins / gp).toFixed(3).slice(1)
}

export function diff(row) {
  return row.pf - row.pa
}
