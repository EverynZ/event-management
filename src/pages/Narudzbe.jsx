import CrudView from '../components/CrudView.jsx'
import { useStore, formatDatum } from '../store.jsx'

export const VRSTE = ['Vjenčanje', 'Krštenje', 'Rođendan']
export const STATUSI = ['Na čekanju', 'Potvrđeno', 'Završeno', 'Otkazano']
const danas = () => new Date().toISOString().slice(0, 10)

export default function Narudzbe() {
  const { klijenti, objekti, narudzbe } = useStore()
  const klijent = (id) => klijenti.items.find((k) => k.id === id)?.ime ?? '—'
  const objekt = (id) => objekti.items.find((o) => o.id === id)?.naziv ?? '—'

  const validate = (v, editing) => {
    const g = {}
    if (v.datum < danas() && !(editing && editing.datum === v.datum)) g.datum = 'Datum ne može biti u prošlosti'
    const o = objekti.items.find((x) => x.id === Number(v.objektId))
    if (Number(v.gosti) < 1) g.gosti = 'Unesite broj gostiju'
    else if (o && Number(v.gosti) > o.kapacitet) g.gosti = `Objekt prima najviše ${o.kapacitet} gostiju`
    const zauzet = narudzbe.items.some(
      (n) => n.id !== editing?.id && n.objektId === Number(v.objektId) && n.datum === v.datum && n.status !== 'Otkazano'
    )
    if (zauzet && v.status !== 'Otkazano') g.datum = 'Objekt je već rezerviran na taj datum'
    return g
  }

  return (
    <CrudView
      naslov="Narudžbe"
      novi="Nova narudžba"
      store={narudzbe}
      prazno="Još nema narudžbi."
      validate={validate}
      fields={[
        { name: 'klijentId', label: 'Klijent (tko naručuje)', type: 'select', asNumber: true, required: true, options: klijenti.items.map((k) => ({ value: k.id, label: k.ime })) },
        { name: 'objektId', label: 'Objekt (gdje se održava)', type: 'select', asNumber: true, required: true, options: objekti.items.map((o) => ({ value: o.id, label: `${o.naziv} (${o.grad})` })) },
        { name: 'vrsta', label: 'Što se naručuje', type: 'select', required: true, options: VRSTE.map((v) => ({ value: v, label: v })) },
        { name: 'datum', label: 'Datum', type: 'date', required: true },
        { name: 'gosti', label: 'Broj gostiju', type: 'number', required: true },
        { name: 'status', label: 'Status', type: 'select', required: true, default: 'Na čekanju', options: STATUSI.map((s) => ({ value: s, label: s })) },
        { name: 'avans', label: 'Avans uplaćen', type: 'checkbox' },
        { name: 'napomena', label: 'Napomena', type: 'textarea' },
      ]}
      columns={[
        { render: (n) => formatDatum(n.datum), label: 'Datum' },
        { render: (n) => <span className={`badge vrsta-${n.vrsta}`}>{n.vrsta}</span>, label: 'Vrsta' },
        { render: (n) => klijent(n.klijentId), label: 'Klijent' },
        { render: (n) => objekt(n.objektId), label: 'Objekt' },
        { key: 'gosti', label: 'Gosti' },
        { render: (n) => (n.avans ? 'Da' : 'Ne'), label: 'Avans' },
        { render: (n) => <span className={`status s-${n.status.replace(/\s/g, '')}`}>{n.status}</span>, label: 'Status' },
      ]}
    />
  )
}
