import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

function UserDetail() {
  const { email } = useParams()
  const [user, setUser] = useState(null)

  useEffect(() => {
    axios.get(`/api/users/${email}`)
      .then(res => setUser(res.data))
      .catch(err => console.error('Erreur chargement utilisateur :', err))
  }, [email])

  if (!user) return <p>Chargement...</p>

  return (
    <div>
      <h2>Détail de l'utilisateur</h2>
      <p><strong>Nom d'utilisateur :</strong> {user.username}</p>
      <p><strong>Email :</strong> {user.email}</p>
    </div>
  )
}

export default UserDetail
