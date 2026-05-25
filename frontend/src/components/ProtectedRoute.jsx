import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()

  if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>
  if (!user) return <Navigate to="/login" />
  if (role && user.role !== role) return <Navigate to="/dashboard" />

  return children
}