import { NavLink, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Klijenti from './pages/Klijenti.jsx'
import Objekti from './pages/Objekti.jsx'
import Narudzbe from './pages/Narudzbe.jsx'

export default function App() {
  return (
    <>
      <header className="navbar">
        <Link to="/" className="brand">Event<span>·</span>Management<small className="autor">Everyn Zagorec Mrđa</small></Link>
        <nav>
          <NavLink to="/" end>Pregled</NavLink>
          <NavLink to="/narudzbe">Narudžbe</NavLink>
          <NavLink to="/klijenti">Klijenti</NavLink>
          <NavLink to="/objekti">Objekti</NavLink>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/narudzbe" element={<Narudzbe />} />
          <Route path="/klijenti" element={<Klijenti />} />
          <Route path="/objekti" element={<Objekti />} />
        </Routes>
      </main>
    </>
  )
}
