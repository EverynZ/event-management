import CrudView from '../components/CrudView.jsx'
import { useStore } from '../store.jsx'

export default function Objekti() {
  const { objekti, narudzbe } = useStore()
  return (
    <CrudView
      naslov="Objekti"
      novi="Novi objekt"
      store={objekti}
      prazno="Još nema objekata."
      fields={[
        { name: 'naziv', label: 'Naziv objekta', required: true },
        { name: 'grad', label: 'Grad', required: true },
        { name: 'adresa', label: 'Adresa', required: true },
        { name: 'kapacitet', label: 'Kapacitet (gostiju)', type: 'number', required: true },
        { name: 'cijena', label: 'Cijena najma (€)', type: 'number', required: true },
      ]}
      columns={[
        { key: 'naziv', label: 'Naziv' },
        { render: (o) => `${o.adresa}, ${o.grad}`, label: 'Lokacija' },
        { key: 'kapacitet', label: 'Kapacitet' },
        { render: (o) => `${o.cijena} €`, label: 'Cijena' },
      ]}
      validate={(v) => {
        const g = {}
        if (Number(v.kapacitet) < 1) g.kapacitet = 'Kapacitet mora biti veći od 0'
        if (Number(v.cijena) < 0) g.cijena = 'Cijena ne može biti negativna'
        return g
      }}
      blokirajBrisanje={(o) =>
        narudzbe.items.some((n) => n.objektId === o.id) ? 'Objekt je rezerviran u narudžbi i ne može se obrisati.' : null
      }
    />
  )
}
