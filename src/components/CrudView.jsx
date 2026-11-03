import { useState } from 'react'

// Generički prikaz s punim CRUD-om: popis (Read), obrazac za novi zapis (Create),
// uređivanje (Update) i brisanje (Delete).
export default function CrudView({ naslov, novi, store, fields, columns, validate, blokirajBrisanje, prazno }) {
  const zadano = (f) => f.default ?? (f.type === 'checkbox' ? false : '')
  const empty = Object.fromEntries(fields.map((f) => [f.name, zadano(f)]))
  const [values, setValues] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [errors, setErrors] = useState({})
  const [open, setOpen] = useState(false)
  const [poruka, setPoruka] = useState('')

  const otvoriNovi = () => { setEditing(null); setValues(empty); setErrors({}); setPoruka(''); setOpen(true) }
  const otvoriUredi = (item) => {
    setEditing(item)
    setValues(Object.fromEntries(fields.map((f) => [f.name, item[f.name] ?? zadano(f)])))
    setErrors({}); setPoruka(''); setOpen(true)
  }
  const zatvori = () => { setOpen(false); setEditing(null); setErrors({}) }

  const promijeni = (e) => setValues({ ...values, [e.target.name]: e.target.value })

  const spremi = (e) => {
    e.preventDefault()
    const g = {}
    fields.forEach((f) => {
      if (f.required && !String(values[f.name]).trim()) g[f.name] = 'Obavezno polje'
    })
    Object.assign(g, Object.keys(g).length ? {} : validate ? validate(values, editing) : {})
    setErrors(g)
    if (Object.keys(g).length) return

    const data = {}
    fields.forEach((f) => {
      const v = values[f.name]
      data[f.name] = f.type === 'number' || f.asNumber ? Number(v) : typeof v === 'string' ? v.trim() : v
    })
    if (editing) store.update(editing.id, data)
    else store.add(data)
    zatvori()
  }

  const obrisi = (item) => {
    const blok = blokirajBrisanje && blokirajBrisanje(item)
    if (blok) { setPoruka(blok); return }
    if (window.confirm('Jeste li sigurni da želite obrisati zapis?')) { store.remove(item.id); setPoruka('') }
  }

  return (
    <section>
      <div className="page-head">
        <h1>{naslov}</h1>
        {!open && <button className="btn" onClick={otvoriNovi}>+ {novi}</button>}
      </div>

      {poruka && <div className="alert">{poruka}</div>}

      {open && (
        <form className="card form" onSubmit={spremi} noValidate>
          <h2>{editing ? 'Uredi zapis' : novi}</h2>
          <div className="form-grid">
            {fields.map((f) => (
              <label key={f.name} className={f.type === 'textarea' ? 'full' : ''}>
                {f.label}
                {f.type === 'select' ? (
                  <select name={f.name} value={values[f.name]} onChange={promijeni}>
                    <option value="">— odaberite —</option>
                    {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : f.type === 'checkbox' ? (
                  <input name={f.name} type="checkbox" checked={!!values[f.name]}
                    onChange={(e) => setValues({ ...values, [f.name]: e.target.checked })} />
                ) : f.type === 'textarea' ? (
                  <textarea name={f.name} rows={3} value={values[f.name]} onChange={promijeni} />
                ) : (
                  <input name={f.name} type={f.type || 'text'} value={values[f.name]} onChange={promijeni} />
                )}
                {errors[f.name] && <em>{errors[f.name]}</em>}
              </label>
            ))}
          </div>
          <div className="actions">
            <button className="btn" type="submit">Spremi</button>
            <button className="btn ghost" type="button" onClick={zatvori}>Odustani</button>
          </div>
        </form>
      )}

      <div className="card table-wrap">
        {store.items.length === 0 ? (
          <p className="muted pad">{prazno}</p>
        ) : (
          <table>
            <thead>
              <tr>
                {columns.map((c) => <th key={c.label}>{c.label}</th>)}
                <th />
              </tr>
            </thead>
            <tbody>
              {store.items.map((item) => (
                <tr key={item.id}>
                  {columns.map((c) => <td key={c.label}>{c.render ? c.render(item) : item[c.key]}</td>)}
                  <td className="row-actions">
                    <button className="link" onClick={() => otvoriUredi(item)}>Uredi</button>
                    <button className="link danger" onClick={() => obrisi(item)}>Obriši</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}
