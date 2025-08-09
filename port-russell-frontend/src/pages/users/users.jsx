import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'

function UsersPage() {
  const { token } = useAuth()
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (!token) return

    axios.get('/api/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => setUsers(res.data))
      .catch(err => console.error('Erreur chargement utilisateurs :', err))
  }, [token])

  return (
    <div>
      <h2>Liste des Utilisateurs</h2>
      <ul>
        {users.map((u, i) => (
          <li key={i}>{u.username} - {u.email}</li>
        ))}
      </ul>
    </div>
  )
}

export default UsersPage
