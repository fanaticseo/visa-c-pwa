import { useState, useEffect } from 'react'

export default function App() {
  const [sejours, setSejours] = useState(() => {
    const sauvegarde = localStorage.getItem('sejours')
    return sauvegarde ? JSON.parse(sauvegarde) : []
  })

  const [nouveauxSejours, setNouveauxSejours] = useState([{ entree: '', sortie: '' }])
  const [dateReference, setDateReference] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    localStorage.setItem('sejours', JSON.stringify(sejours))
  }, [sejours])

  const handleChange = (index, field, value) => {
    const copie = [...nouveauxSejours]
    copie[index][field] = value
    setNouveauxSejours(copie)
  }

  const ajouterChamp = () => {
    setNouveauxSejours([...nouveauxSejours, { entree: '', sortie: '' }])
  }

  const validerSejours = () => {
    const tousValides = nouveauxSejours.every(s => s.entree && s.sortie)
    if (tousValides) {
      setSejours([...sejours, ...nouveauxSejours])
      setNouveauxSejours([{ entree: '', sortie: '' }])
    } else {
      alert("Merci de remplir toutes les dates avant de valider.")
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

      <h2>Ajouter plusieurs séjours</h2>
      {nouveauxSejours.map((s, index) => (
        <div key={index} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <input type='date' value={s.entree} onChange={e => handleChange(index, 'entree', e.target.value)} />
          <input type='date' value={s.sortie} onChange={e => handleChange(index, 'sortie', e.target.value)} />
        </div>
      ))}
      <button onClick={ajouterChamp}>+ Ajouter un autre séjour</button>
      <br />
      <button onClick={validerSejours} style={{ marginTop: 10 }}>✅ Valider les séjours</button>

      <div style={{ marginTop: 20 }}>
        <label>Date de référence : </label>
        <input type='date' value={dateReference} onChange={e => setDateReference(e.target.value)} />
      </div>

      <div style={{ marginTop: 20, padding: 10, background: '#f3f3f3', borderRadius: 8 }}>
        <p>Jours utilisés : <strong>{joursUtilises}</strong></p>
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
}const supprimerSejour = (index) => {
  const copie = [...sejours]
  copie.splice(index, 1)
  setSejours(copie)
}
<ul>
  {sejours.map((s, i) => (
    <li key={i}>
      Du {s.entree} au {s.sortie}
      <button onClick={() => supprimerSejour(i)} style={{ marginLeft: 10 }}>🗑 Supprimer</button>
    </li>
  ))}
</ul>

