import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'

function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/api/users/login', { email, password })
      const token = res.headers.authorization.split(' ')[1]
      login(token)
      navigate('/dashboard')
    } catch (err) {
      setError('Identifiants incorrects')
    }
  }

  return (
    <div>
      <h1>Bienvenue sur Port Russell</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Se connecter</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <a href="/docs" target="_blank" rel="noopener noreferrer">Voir la documentation de l'API</a>
    </div>
  )
}

export default Home