import { Link } from 'react-router-dom'
import { useStore, formatDatum } from '../store.jsx'

export default function Dashboard() {
  const { klijenti, objekti, narudzbe } = useStore()
  const danas = new Date().toISOString().slice(0, 10)
  const nadolazece = narudzbe.items
    .filter((n) => n.datum >= danas && n.status !== 'Otkazano')
    .sort((a, b) => a.datum.localeCompare(b.datum))
    .slice(0, 5)
  const ime = (lista, id, polje) => lista.items.find((x) => x.id === id)?.[polje] ?? '—'

  const stat = [
    { broj: narudzbe.items.length, tekst: 'Narudžbi', to: '/narudzbe' },
    { broj: klijenti.items.length, tekst: 'Klijenata', to: '/klijenti' },
    { broj: objekti.items.length, tekst: 'Objekata', to: '/objekti' },
  ]

  return (
    <section>
      <div className="hero">
        <h1>Organizacija vjenčanja, krštenja i rođendana</h1>
        <p>Jedno mjesto za klijente, objekte i narudžbe događaja.</p>
      </div>

      <div className="stats">
        {stat.map((s) => (
          <Link to={s.to} key={s.tekst} className="card stat">
            <b>{s.broj}</b>
            <span>{s.tekst}</span>
          </Link>
        ))}
      </div>

      <h2>Nadolazeći događaji</h2>
      <div className="card table-wrap">
        {nadolazece.length === 0 ? (
          <p className="muted pad">Nema nadolazećih događaja.</p>
        ) : (
          <table>
            <thead><tr><th>Datum</th><th>Vrsta</th><th>Klijent</th><th>Objekt</th></tr></thead>
            <tbody>
              {nadolazece.map((n) => (
                <tr key={n.id}>
                  <td>{formatDatum(n.datum)}</td>
                  <td><span className={`badge vrsta-${n.vrsta}`}>{n.vrsta}</span></td>
                  <td>{ime(klijenti, n.klijentId, 'ime')}</td>
                  <td>{ime(objekti, n.objektId, 'naziv')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}
