import { useState, useEffect } from 'react'
import axios from 'axios'

function UserForm({ initialData = null, onSuccess }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (initialData) {
      setUsername(initialData.username)
      setEmail(initialData.email)
      setPassword('')
    }
  }, [initialData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (initialData) {
        await axios.put(`/api/users/${initialData.email}`, { username, password })
        alert('Utilisateur modifié')
      } else {
        await axios.post('/api/users', { username, email, password })
        alert('Utilisateur créé')
      }
      onSuccess?.()
    } catch (err) {
      console.error(err)
      alert("Erreur d'enregistrement")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Nom d'utilisateur :</label>
      <input value={username} onChange={e => setUsername(e.target.value)} required />

      {!initialData && (
        <>
          <label>Email :</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </>
      )}

      <label>Mot de passe :</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />

      <button type="submit">{initialData ? 'Modifier' : 'Créer'}</button>
    </form>
  )
}

export default UserForm
