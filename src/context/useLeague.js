import { useContext } from 'react'
import { LeagueContext } from './LeagueContext'

export function useLeague() {
  return useContext(LeagueContext)
}
