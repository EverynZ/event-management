import { createContext, useContext, useEffect, useState } from 'react'

// Tri entiteta: Klijent (tko naručuje), Objekt (gdje se održava), Narudžba (što se naručuje, s datumom)
const seed = {
  klijenti: [
    { id: 1, ime: 'Ana Horvat', email: 'ana.horvat@example.com', telefon: '091 234 5678' },
    { id: 2, ime: 'Marko Kovač', email: 'marko.kovac@example.com', telefon: '098 765 4321' },
    { id: 3, ime: 'Ivana Babić', email: 'ivana.babic@example.com', telefon: '095 111 2233' },
  ],
  objekti: [
    { id: 1, naziv: 'Dvorac Zagorje', grad: 'Krapina', adresa: 'Zagorska 12', kapacitet: 150, cijena: 3500 },
    { id: 2, naziv: 'Vila Maslina', grad: 'Zagreb', adresa: 'Ulica cvijeća 5', kapacitet: 80, cijena: 2200 },
    { id: 3, naziv: 'Vrt Sunca', grad: 'Osijek', adresa: 'Park 3', kapacitet: 50, cijena: 1200 },
  ],
  narudzbe: [
    { id: 1, klijentId: 1, objektId: 1, vrsta: 'Vjenčanje', datum: '2027-06-12', gosti: 120, avans: true, status: 'Potvrđeno', napomena: 'Dekoracija u bijelo-zelenoj boji.' },
    { id: 2, klijentId: 2, objektId: 3, vrsta: 'Krštenje', datum: '2027-03-20', gosti: 40, avans: false, status: 'Na čekanju', napomena: '' },
    { id: 3, klijentId: 3, objektId: 2, vrsta: 'Rođendan', datum: '2027-02-14', gosti: 60, avans: true, status: 'Potvrđeno', napomena: 'Torta i glazba uživo.' },
  ],
}

const StoreContext = createContext(null)

function load(key) {
  try {
    const raw = localStorage.getItem('em_' + key)
    return raw ? JSON.parse(raw) : seed[key]
  } catch {
    return seed[key]
  }
}

function useCollection(key) {
  const [items, setItems] = useState(() => load(key))
  useEffect(() => { localStorage.setItem('em_' + key, JSON.stringify(items)) }, [key, items])
  const nextId = (list) => list.reduce((m, x) => Math.max(m, x.id), 0) + 1
  return {
    items,
    add: (data) => setItems((l) => [...l, { ...data, id: nextId(l) }]),
    update: (id, data) => setItems((l) => l.map((x) => (x.id === id ? { ...x, ...data } : x))),
    remove: (id) => setItems((l) => l.filter((x) => x.id !== id)),
  }
}

export function StoreProvider({ children }) {
  const klijenti = useCollection('klijenti')
  const objekti = useCollection('objekti')
  const narudzbe = useCollection('narudzbe')
  return <StoreContext.Provider value={{ klijenti, objekti, narudzbe }}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)

export const formatDatum = (d) => (d ? d.split('-').reverse().join('. ') + '.' : '')
