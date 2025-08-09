import { useEffect, useState } from 'react'
import axios from 'axios'
import ReservationForm from '../../components/ReservationForm'
import { Link } from 'react-router-dom'

function ReservationsPage() {
  const [reservations, setReservations] = useState([])
  const [editingReservation, setEditingReservation] = useState(null)
  const [catwayNumber, setCatwayNumber] = useState('')

  const fetch = () => {
    axios.get('/api/reservations')
      .then(res => setReservations(res.data))
      .catch(err => console.error('Erreur chargement réservations :', err))
  }

  useEffect(() => {
    fetch()
  }, [])

  const handleDelete = async (r) => {
    if (!window.confirm('Supprimer cette réservation ?')) return
    try {
      await axios.delete(`/api/catways/${r.catwayNumber}/reservations/${r._id}`)
      fetch()
    } catch (err) {
      console.error(err)
      alert('Erreur suppression')
    }
  }

  return (
    <div>
      <h2>Réservations</h2>

      <h3>{editingReservation ? 'Modifier une réservation' : 'Créer une réservation'}</h3>

      <label>Catway n° :</label>
      <input
        type="number"
        value={catwayNumber}
        onChange={e => setCatwayNumber(e.target.value)}
        required
      />

      {catwayNumber && (
        <ReservationForm
          catwayNumber={catwayNumber}
          initialData={editingReservation}
          onSuccess={() => {
            fetch()
            setEditingReservation(null)
          }}
        />
      )}

      <hr />

      <h3>Liste des réservations</h3>
      <ul>
        {reservations.map(r => (
          <li key={r._id}>
            <Link to={`/catways/${r.catwayNumber}/reservations/${r._id}`}>
              {r.boatName} - {r.clientName} ({r.startDate?.slice(0,10)} → {r.endDate?.slice(0,10)})
            </Link>
            {' '}
            <button onClick={() => {
              setEditingReservation(r)
              setCatwayNumber(r.catwayNumber)
            }}>Modifier</button>
            <button onClick={() => handleDelete(r)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ReservationsPage
