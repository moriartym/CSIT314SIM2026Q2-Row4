import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { userAccount, loading } = useAuth()

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#0a0a0a',
          color: '#4fffb0',
          fontFamily: 'monospace',
        }}
      >
        Loading…
      </div>
    )
  }

  return userAccount ? children : <Navigate to="/login" replace />
}