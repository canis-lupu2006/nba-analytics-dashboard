import { useMemo } from 'react'
import { LeagueContext } from './LeagueContext'

export function LeagueProvider({ league, children }) {
  const value = useMemo(() => league, [league])
  return <LeagueContext.Provider value={value}>{children}</LeagueContext.Provider>
}
