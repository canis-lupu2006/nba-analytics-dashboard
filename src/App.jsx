import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import TeamPage from './pages/TeamPage'
import PlayerPage from './pages/PlayerPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="topbar">
          <Link to="/" className="brand">
            NBA Analytics Dashboard
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
  )
}

export default App
