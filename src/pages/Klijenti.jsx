import CrudView from '../components/CrudView.jsx'
import { useStore } from '../store.jsx'

export default function Klijenti() {
  const { klijenti, narudzbe } = useStore()
  return (
    <CrudView
      naslov="Klijenti"
      novi="Novi klijent"
      store={klijenti}
      prazno="Još nema klijenata."
      fields={[
        { name: 'ime', label: 'Ime i prezime', required: true },
        { name: 'email', label: 'E-mail', type: 'email', required: true },
        { name: 'telefon', label: 'Telefon', required: true },
      ]}
      columns={[
        { key: 'ime', label: 'Ime i prezime' },
        { key: 'email', label: 'E-mail' },
        { key: 'telefon', label: 'Telefon' },
      ]}
      validate={(v) => (/^\S+@\S+\.\S+$/.test(v.email) ? {} : { email: 'Unesite ispravan e-mail' })}
      blokirajBrisanje={(k) =>
        narudzbe.items.some((n) => n.klijentId === k.id) ? 'Klijent ima narudžbe i ne može se obrisati. Prvo obrišite njegove narudžbe.' : null
      }
    />
  )
}
