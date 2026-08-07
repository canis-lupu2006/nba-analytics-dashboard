import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import TeamPage from './pages/TeamPage'
import PlayerPage from './pages/PlayerPage'
import LoadingScreen from './components/LoadingScreen'
import './App.css'

function App() {
  const [phase, setPhase] = useState('loading')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('fading'), 1900)
    const t2 = setTimeout(() => setPhase('done'), 2600)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    <>
      {phase !== 'done' && <LoadingScreen fading={phase === 'fading'} />}
      <BrowserRouter>
        <div className="app">
          <header className="topbar">
            <Link to="/" className="brand">
              <img src="/LOGOO.jpg" alt="NBA Analytics" className="brand-logo" />
              <span>NBA Analytics</span>
            </Link>
            <nav className="tabs">
              <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>
                Équipes
              </NavLink>
            </nav>
          </header>

          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/team/:id" element={<TeamPage />} />
              <Route path="/player/:id" element={<PlayerPage />} />
            </Routes>
          </main>

          <footer className="footer">
            AQX Sports Analytics Data Bowl 3.0 · Données : balldontlie.io &amp; sportsdataverse (ESPN)
          </footer>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
