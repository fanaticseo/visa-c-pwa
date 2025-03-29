import { useState, useEffect } from 'react'

export default function App() {
  const [sejours, setSejours] = useState(() => {
    const sauvegarde = localStorage.getItem('sejours')
    return sauvegarde ? JSON.parse(sauvegarde) : []
  })

  const [nouveauxSejours, setNouveauxSejours] = useState([{ entree: '', sortie: '' }])
  const [dateReference, setDateReference] = useState(new Date().toISOString().split('T')[0])
  const [enEdition, setEnEdition] = useState(null)
  const [edition, setEdition] = useState({ entree: '', sortie: '' })

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
    const tousValides = nouveauxSejours.every(s => s.entree)
    if (tousValides) {
      setSejours([...sejours, ...nouveauxSejours])
      setNouveauxSejours([{ entree: '', sortie: '' }])
    } else {
      alert("Merci de remplir au moins les dates d'entrée.")
    }
  }

  const supprimerSejour = (index) => {
    const copie = [...sejours]
    copie.splice(index, 1)
    setSejours(copie)
  }

  const lancerEdition = (index) => {
    setEnEdition(index)
    setEdition({ ...sejours[index] })
  }

  const validerEdition = () => {
    const copie = [...sejours]
    copie[enEdition] = edition
    setSejours(copie)
    setEnEdition(null)
  }

  const calculerJoursValides = () => {
    const dateLimite = new Date(dateReference)
    dateLimite.setDate(dateLimite.getDate() - 180)
    let totalJours = 0

    for (let sejour of sejours) {
      const entreeDate = new Date(sejour.entree)
      const sortieDate = sejour.sortie ? new Date(sejour.sortie) : null

      if (sortieDate) {
        if (sortieDate >= dateLimite) {
          const debut = entreeDate < dateLimite ? dateLimite : entreeDate
          totalJours += Math.floor((sortieDate - debut) / (1000 * 60 * 60 * 24)) + 1
        }
      } else {
        const debut = entreeDate < dateLimite ? dateLimite : entreeDate
        const maintenant = new Date(dateReference)
        totalJours += Math.floor((maintenant - debut) / (1000 * 60 * 60 * 24)) + 1
      }
    }

    return totalJours
  }

  const calculerDateMaxRetour = () => {
    const dernier = sejours[sejours.length - 1]
    if (dernier && dernier.entree && !dernier.sortie && joursRestants > 0) {
      const entreeDate = new Date(dernier.entree)
      const dateRetourMax = new Date(entreeDate)
      dateRetourMax.setDate(dateRetourMax.getDate() + joursRestants - 1)
      return dateRetourMax.toISOString().split('T')[0]
    }
    return null
  }

  const joursUtilises = calculerJoursValides()
  const joursRestants = 90 - joursUtilises
  const avertissement = joursRestants <= 10 && joursRestants > 0

  return (
    <div style={{
      background: '#ffffff',
      color: '#000000',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '700px',
      margin: 'auto'
    }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>📅 Calculateur Visa C (90/180 jours)</h1>

      <h2>Ajouter des séjours</h2>
      {nouveauxSejours.map((s, index) => (
        <div key={index} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <input type='date' value={s.entree} onChange={e => handleChange(index, 'entree', e.target.value)} />
          <input type='date' value={s.sortie} onChange={e => handleChange(index, 'sortie', e.target.value)} />
        </div>
      ))}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={ajouterChamp}>+ Ajouter un autre séjour</button>
        <button onClick={validerSejours}>✅ Valider les séjours</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label><strong>Date de référence :</strong> </label>
        <input type='date' value={dateReference} onChange={e => setDateReference(e.target.value)} />
      </div>

      <div style={{
        padding: 15,
        background: '#f5f5f5',
        borderRadius: 8,
        marginBottom: 20,
        border: '1px solid #ccc'
      }}>
        <p>📆 Jours utilisés (sur 180 jours glissants) : <strong>{joursUtilises}</strong></p>
        <p>🕒 Jours restants : <strong style={{ color: joursRestants < 0 ? 'red' : 'black' }}>{joursRestants >= 0 ? joursRestants : 0}</strong></p>
        {joursRestants < 0 && <p style={{ color: 'red' }}>🚨 Vous avez dépassé la limite autorisée !</p>}
        {avertissement && <p style={{ color: 'orange' }}>⚠️ Attention, il ne vous reste que {joursRestants} jours !</p>}
        {calculerDateMaxRetour() && (
          <p style={{ color: '#007bff' }}>
            🧳 Vous devez quitter Schengen au plus tard le : <strong>{calculerDateMaxRetour()}</strong>
          </p>
        )}
      </div>

      <h2>📋 Historique des séjours</h2>
      <ul style={{ paddingLeft: '20px' }}>
        {sejours.map((s, i) => (
          <li key={i} style={{ marginBottom: '10px' }}>
            {enEdition === i ? (
              <div style={{ display: 'flex', gap: 10 }}>
                <input type='date' value={edition.entree} onChange={e => setEdition({ ...edition, entree: e.target.value })} />
                <input type='date' value={edition.sortie || ''} onChange={e => setEdition({ ...edition, sortie: e.target.value })} />
                <button onClick={validerEdition}>💾 Sauvegarder</button>
                <button onClick={() => setEnEdition(null)}>❌ Annuler</button>
              </div>
            ) : (
              <>
                Du <strong>{s.entree}</strong> au <strong>{s.sortie || '...'}</strong>
                <button onClick={() => lancerEdition(i)} style={{ marginLeft: 10 }}>✏️ Modifier</button>
                <button onClick={() => supprimerSejour(i)} style={{ marginLeft: 5 }}>🗑 Supprimer</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}


