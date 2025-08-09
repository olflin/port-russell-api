import { useEffect, useState } from 'react'
import axios from 'axios'
import CatwayForm from '../../components/catwayform'
import { Link } from 'react-router-dom'

function CatwaysPage() {
  const [catways, setCatways] = useState([])
  const [editingCatway, setEditingCatway] = useState(null)

  const fetchCatways = () => {
    axios.get('/api/catways')
      .then(res => setCatways(res.data))
      .catch(err => console.error('Erreur chargement catways :', err))
  }

  useEffect(() => {
    fetchCatways()
  }, [])

  const handleDelete = async (catwayNumber) => {
    if (!window.confirm('Supprimer ce catway ?')) return

    try {
      await axios.delete(`/api/catways/${catwayNumber}`)
      fetchCatways()
    } catch (err) {
      console.error(err)
      alert('Erreur suppression')
    }
  }

  return (
    <div>
      <h2>Catways</h2>

      <h3>{editingCatway ? 'Modifier un Catway' : 'Créer un nouveau Catway'}</h3>
      <CatwayForm
        initialData={editingCatway}
        onSuccess={() => {
          fetchCatways()
          setEditingCatway(null)
        }}
      />

      <hr />

      <h3>Liste</h3>
      <ul>
        {catways.map((c) => (
          <li key={c.catwayNumber}>
            <Link to={`/catways/${c.catwayNumber}`}>
              #{c.catwayNumber} - {c.catwayType} - {c.catwayState}
            </Link>
            {' '}
            <button onClick={() => setEditingCatway(c)}>Modifier</button>
            <button onClick={() => handleDelete(c.catwayNumber)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CatwaysPage
