import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Admin from "./pages/Admin"
import Messages from "./pages/Messages"
import Schedule from "./pages/Schedule"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute role="admin">
          <Admin />
        </ProtectedRoute>
      } />
      <Route path="/messages" element={
        <ProtectedRoute>
          <Messages />
        </ProtectedRoute>
      } />
      <Route path="/schedule" element={
        <ProtectedRoute>
          <Schedule />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App