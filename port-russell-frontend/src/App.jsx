import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'

import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import Docs from './pages/docs';

// À ajouter plus tard :
import CatwaysPage from './pages/catways/catways'
import ReservationsPage from './pages/Reservations/reservations'
import UsersPage from './pages/users/users'

import ReservationDetail from './pages/reservations/ReservationDetail'
import CatwayDetail from './pages/catways/CatwayDetail'
import UserDetail from './pages/users/userdetail'

function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/catways" element={<CatwaysPage />} />
          <Route path="/catways/:idCatway/reservations/:idReservation" element={<ReservationDetail />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/catways/:id" element={<CatwayDetail />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:email" element={<UserDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </AuthProvider>
  )
}

export default App
