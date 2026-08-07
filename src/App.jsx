import { useState } from 'react'
import { teams, games, SEASON } from './lib/data'
import { buildStandings } from './lib/standings'
import Standings from './components/Standings'
import Players from './components/Players'
import './App.css'

const teamsById = Object.fromEntries(teams.map((t) => [t.id, t]))
const standings = buildStandings(games, teamsById)

function App() {
  const [tab, setTab] = useState('standings')

  return (
    <div className="app">
      <header className="topbar">
        <h1>NBA Analytics Dashboard</h1>
        <nav className="tabs">
          <button className={tab === 'standings' ? 'active' : ''} onClick={() => setTab('standings')}>
            Classement
          </button>
          <button className={tab === 'players' ? 'active' : ''} onClick={() => setTab('players')}>
            Joueurs
          </button>
        </nav>
      </header>

      <main>
        {tab === 'standings' && <Standings standings={standings} teamsById={teamsById} />}
        {tab === 'players' && <Players season={SEASON} players={players} />}
      </main>

      <footer className="footer">
        AQX Sports Analytics Data Bowl 3.0 · Données : balldontlie.io &amp; sportsdataverse (ESPN)
      </footer>
    </div>
  )
}

export default App
