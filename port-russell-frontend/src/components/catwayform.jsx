import { useState, useEffect } from 'react'
import axios from 'axios'

function CatwayForm({ initialData = null, onSuccess }) {
  const [catwayNumber, setCatwayNumber] = useState('')
  const [catwayType, setCatwayType] = useState('long')
  const [catwayState, setCatwayState] = useState('')

  useEffect(() => {
    if (initialData) {
      setCatwayNumber(initialData.catwayNumber)
      setCatwayType(initialData.catwayType)
      setCatwayState(initialData.catwayState)
    }
  }, [initialData])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (initialData) {
        // UPDATE (PUT)
        await axios.put(`/api/catways/${initialData.catwayNumber}`, {
          catwayState
        })
        alert('Catway mis à jour')
      } else {
        // CREATE (POST)
        await axios.post('/api/catways', {
          catwayNumber,
          catwayType,
          catwayState
        })
        alert('Catway créé')
      }

      onSuccess?.()
    } catch (err) {
      console.error(err)
      alert("Erreur lors de l'enregistrement")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {!initialData && (
        <>
          <label>Numéro :</label>
          <input type="number" value={catwayNumber} onChange={e => setCatwayNumber(e.target.value)} required />

          <label>Type :</label>
          <select value={catwayType} onChange={e => setCatwayType(e.target.value)}>
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
        </>
      )}

      <label>État :</label>
      <input value={catwayState} onChange={e => setCatwayState(e.target.value)} required />

      <button type="submit">{initialData ? 'Mettre à jour' : 'Créer'}</button>
    </form>
  )
}

export default CatwayForm
