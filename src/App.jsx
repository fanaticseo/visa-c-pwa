import { useState } from 'react'

export default function App() {
  const [sejours, setSejours] = useState([])
  const [entree, setEntree] = useState('')
  const [sortie, setSortie] = useState('')
  const [dateReference, setDateReference] = useState(new Date().toISOString().split('T')[0])

  const ajouterSejour = () => {
    if (entree && sortie) {
      setSejours([...sejours, { entree, sortie }])
      setEntree('')
      setSortie('')
    }
  }

  const calculerJoursValides = () => {
    const dateLimite = new Date(dateReference)
    dateLimite.setDate(dateLimite.getDate() - 180)
    let totalJours = 0

    for (let sejour of sejours) {
      const entreeDate = new Date(sejour.entree)
      const sortieDate = new Date(sejour.sortie)
      if (sortieDate >= dateLimite) {
        const debut = entreeDate < dateLimite ? dateLimite : entreeDate
        totalJours += Math.floor((sortieDate - debut) / (1000 * 60 * 60 * 24)) + 1
      }
    }
    return totalJours
  }

  const joursUtilises = calculerJoursValides()
  const joursRestants = 90 - joursUtilises

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif', maxWidth: 600, margin: 'auto' }}>
      <h1>Calculateur Visa C (90/180 jours)</h1>
      <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
        <input type='date' value={entree} onChange={e => setEntree(e.target.value)} />
        <input type='date' value={sortie} onChange={e => setSortie(e.target.value)} />
        <button onClick={ajouterSejour}>Ajouter</button>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label>Date de référence : </label>
        <input type='date' value={dateReference} onChange={e => setDateReference(e.target.value)} />
      </div>
      <div style={{ padding: 10, background: '#f3f3f3', borderRadius: 8 }}>
        <p>Jours utilisés (sur les 180 derniers jours) : <strong>{joursUtilises}</strong></p>
        <p>Jours restants : <strong>{joursRestants >= 0 ? joursRestants : 0}</strong></p>
        {joursRestants < 0 && <p style={{ color: 'red' }}>⚠️ Dépassement du quota autorisé !</p>}
      </div>
      <div style={{ marginTop: 20 }}>
        <h2>Historique des séjours :</h2>
        <ul>
          {sejours.map((s, i) => (
            <li key={i}>Du {s.entree} au {s.sortie}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
