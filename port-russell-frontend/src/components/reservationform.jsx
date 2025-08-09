import { useState, useEffect } from 'react'
import axios from 'axios'

function ReservationForm({ catwayNumber, initialData = null, onSuccess }) {
  const [clientName, setClientName] = useState('')
  const [boatName, setBoatName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    if (initialData) {
      setClientName(initialData.clientName)
      setBoatName(initialData.boatName)
      setStartDate(initialData.startDate?.slice(0,10))
      setEndDate(initialData.endDate?.slice(0,10))
    }
  }, [initialData])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (initialData) {
        await axios.put(`/api/catways/${catwayNumber}/reservations/${initialData._id}`, {
          clientName, boatName, startDate, endDate
        })
        alert('Réservation mise à jour')
      } else {
        await axios.post(`/api/catways/${catwayNumber}/reservations`, {
          clientName, boatName, startDate, endDate
        })
        alert('Réservation créée')
      }

      onSuccess?.()
    } catch (err) {
      console.error(err)
      alert("Erreur lors de l'enregistrement")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Nom client :</label>
      <input value={clientName} onChange={e => setClientName(e.target.value)} required />

      <label>Nom bateau :</label>
      <input value={boatName} onChange={e => setBoatName(e.target.value)} required />

      <label>Date début :</label>
      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />

      <label>Date fin :</label>
      <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />

      <button type="submit">{initialData ? 'Modifier' : 'Créer'}</button>
    </form>
  )
}

export default ReservationForm
