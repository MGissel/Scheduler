import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login as loginRequest } from "../api/auth"
import { getMe } from "../api/auth"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)
  const { login }               = useAuth()
  const navigate                = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
        const res = await loginRequest(email, password)
        localStorage.setItem("access", res.data.access)
        localStorage.setItem("refresh", res.data.refresh)
        const me = await getMe()
        login(res.data.access, res.data.refresh, me.data)
        navigate("/dashboard")
    } catch {
        setError("Invalid email or password")
    } finally {
        setLoading(false)
    }
    }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Scheduler</h1>
        <p style={styles.subtitle}>Sign in to your account</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f4f4f4",
  },
  card: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "700",
    marginBottom: "0.25rem",
  },
  subtitle: {
    color: "#666",
    marginBottom: "1.5rem",
  },
  error: {
    background: "#fee",
    color: "#c00",
    padding: "0.75rem",
    borderRadius: "4px",
    marginBottom: "1rem",
    fontSize: "0.9rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontWeight: "600",
    fontSize: "0.9rem",
    marginTop: "0.5rem",
  },
  input: {
    padding: "0.6rem 0.75rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    outline: "none",
  },
  button: {
    marginTop: "1rem",
    padding: "0.75rem",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
}