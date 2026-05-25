import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

export default function Dashboard() {
  const { user, loading, logout } = useAuth()
  const navigate                  = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login")
    }
  }, [user, loading, navigate])

  if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>
  if (!user)   return null

  return (
    <div style={styles.wrapper}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Scheduler</h2>
        <nav style={styles.nav}>
          <a style={styles.navItem}>Dashboard</a>
          <a style={styles.navItem}>Schedule</a>
          <a style={styles.navItem}>Courses</a>
          <a style={styles.navItem} onClick={() => navigate("/messages")}>Messages</a>
          {user.role === "admin" && <a style={styles.navItem} onClick={() => navigate("/admin")}>Admin</a>}
        </nav>
        <button style={styles.logout} onClick={() => { logout(); navigate("/login") }}>
          Sign out
        </button>
      </div>
      <div style={styles.main}>
        <h1 style={styles.heading}>Welcome, {user.name}</h1>
        <p style={styles.role}>Logged in as <strong>{user.role}</strong></p>
        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>Schedule</h3>
            <p>View your weekly timetable</p>
          </div>
          <div style={styles.card}>
            <h3>Courses</h3>
            <p>Browse your enrolled courses</p>
          </div>
          <div style={styles.card}>
            <h3>Messages</h3>
            <p>Check your inbox</p>
          </div>
          <div style={styles.card}>
            <h3>Grades</h3>
            <p>View your latest grades</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
  },
  sidebar: {
    width: "220px",
    background: "#1e293b",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    padding: "1.5rem 1rem",
    gap: "0.5rem",
  },
  logo: {
    fontSize: "1.4rem",
    fontWeight: "700",
    marginBottom: "2rem",
    color: "#fff",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    flex: 1,
  },
  navItem: {
    padding: "0.6rem 0.75rem",
    borderRadius: "4px",
    cursor: "pointer",
    color: "#cbd5e1",
    fontSize: "0.95rem",
  },
  logout: {
    padding: "0.6rem",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
  },
  main: {
    flex: 1,
    padding: "2rem",
  },
  heading: {
    fontSize: "1.8rem",
    marginBottom: "0.25rem",
  },
  role: {
    color: "#666",
    marginBottom: "2rem",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "1rem",
  },
  card: {
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
}