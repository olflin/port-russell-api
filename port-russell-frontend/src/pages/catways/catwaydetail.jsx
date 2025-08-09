import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

function CatwayDetail() {
  const { id } = useParams()
  const [catway, setCatway] = useState(null)

  useEffect(() => {
    axios.get(`/api/catways/${id}`)
      .then(res => setCatway(res.data))
      .catch(err => console.error('Erreur chargement catway :', err))
  }, [id])

  if (!catway) return <p>Chargement...</p>

  return (
    <div>
      <h2>Détail du Catway #{catway.catwayNumber}</h2>
      <p><strong>Type :</strong> {catway.catwayType}</p>
      <p><strong>État :</strong> {catway.catwayState}</p>
    </div>
  )
}

export default CatwayDetail
