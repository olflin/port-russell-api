import { useEffect, useState } from 'react'
import axios from 'axios'
import UserForm from '../../components/userform'
import { Link } from 'react-router-dom'

function UsersPage() {
  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null)

  const fetch = () => {
    axios.get('/api/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error('Erreur chargement utilisateurs :', err))
  }

  useEffect(() => {
    fetch()
  }, [])

  const handleDelete = async (email) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return
    try {
      await axios.delete(`/api/users/${email}`)
      fetch()
    } catch (err) {
      console.error(err)
      alert('Erreur suppression')
    }
  }

  return (
    <div>
      <h2>Utilisateurs</h2>

      <h3>{editingUser ? 'Modifier un utilisateur' : 'Créer un utilisateur'}</h3>
      <UserForm
        initialData={editingUser}
        onSuccess={() => {
          fetch()
          setEditingUser(null)
        }}
      />

      <hr />

      <h3>Liste des utilisateurs</h3>
      <ul>
        {users.map(u => (
          <li key={u.email}>
            <Link to={`/users/${u.email}`}>{u.username} - {u.email}</Link>
            {' '}
            <button onClick={() => setEditingUser(u)}>Modifier</button>
            <button onClick={() => handleDelete(u.email)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UsersPage
