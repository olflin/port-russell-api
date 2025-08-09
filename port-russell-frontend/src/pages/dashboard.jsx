import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'


function Dashboard() {
  const { user, logout } = useAuth()

  const [activeReservations, setActiveReservations] = useState([])

useEffect(() => {
  axios.get('/api/reservations')
    .then(res => {
      const today = new Date()
      const filtered = res.data.filter(r => {
        const start = new Date(r.startDate)
        const end = new Date(r.endDate)
        return start <= today && end >= today
      })
      setActiveReservations(filtered)
    })
    .catch(err => console.error('Erreur chargement réservations en cours :', err))
}, [])

  const navigate = useNavigate()

useEffect(() => {
  if (!user) {
    navigate('/')
  }
}, [user])
if (!user) return null


  const date = new Date().toLocaleDateString('fr-FR')

  return (
    <div>
      <h1>Tableau de bord</h1>
      <p>Nom : {user.username}</p>
      <p>Email : {user.email}</p>
      <p>Date : {date}</p>

      <nav>
        <a href="/catways">Catways</a> | 
        <a href="/reservations">Réservations</a> | 
        <a href="/users">Utilisateurs</a> | 
        <a href="/docs" target="_blank" rel="noopener noreferrer">Documentation</a> | 
        <button onClick={() => { logout(); navigate('/') }}>Déconnexion</button>
      </nav>
      <h2>Réservations en cours</h2>
      <ul>
        {activeReservations.length === 0 && <li>Aucune réservation active</li>}
        {activeReservations.map((r, i) => (
          <li key={i}>
            Catway #{r.catwayNumber} – {r.boatName} ({r.clientName}) : {r.startDate?.slice(0,10)} → {r.endDate?.slice(0,10)}
          </li>
        ))}
      </ul>

    </div>
  )
}

export default Dashboard