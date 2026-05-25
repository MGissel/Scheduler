import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { getUsers, deleteUser, createUser } from "../api/users"
import { getClasses, createClass, deleteClass } from "../api/classes"

export default function Admin() {
  const { user, logout }          = useAuth()
  const navigate                  = useNavigate()
  const [tab, setTab]             = useState("users")
  const [users, setUsers]         = useState([])
  const [classes, setClasses]     = useState([])
  const [error, setError]         = useState("")
  const [success, setSuccess]     = useState("")

  const [newUser, setNewUser]     = useState({ name: "", email: "", role: "student", password: "" })
  const [newClass, setNewClass]   = useState({ name: "", year: "" })

  useEffect(() => {
    fetchUsers()
    fetchClasses()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await getUsers()
      setUsers(res.data)
    } catch {
      setError("Failed to load users")
    }
  }

  const fetchClasses = async () => {
    try {
      const res = await getClasses()
      setClasses(res.data)
    } catch {
      setError("Failed to load classes")
    }
  }

  const handleDeleteUser = async (id) => {
    if (!confirm("Delete this user?")) return
    try {
      await deleteUser(id)
      setUsers(users.filter((u) => u.id !== id))
      setSuccess("User deleted")
    } catch {
      setError("Failed to delete user")
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    try {
      await createUser(newUser)
      setNewUser({ name: "", email: "", role: "student", password: "" })
      setSuccess("User created")
      fetchUsers()
    } catch {
      setError("Failed to create user")
    }
  }

  const handleDeleteClass = async (id) => {
    if (!confirm("Delete this class?")) return
    try {
      await deleteClass(id)
      setClasses(classes.filter((c) => c.id !== id))
      setSuccess("Class deleted")
    } catch {
      setError("Failed to delete class")
    }
  }

  const handleCreateClass = async (e) => {
    e.preventDefault()
    try {
      await createClass(newClass)
      setNewClass({ name: "", year: "" })
      setSuccess("Class created")
      fetchClasses()
    } catch {
      setError("Failed to create class")
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Scheduler</h2>
        <nav style={styles.nav}>
          <a style={styles.navItem} onClick={() => navigate("/dashboard")}>Dashboard</a>
          <a style={styles.navItem} onClick={() => navigate("/admin")}>Admin</a>
        </nav>
        <button style={styles.logout} onClick={() => { logout(); navigate("/login") }}>
          Sign out
        </button>
      </div>

      <div style={styles.main}>
        <h1 style={styles.heading}>Admin Panel</h1>

        {error   && <p style={styles.error}   onClick={() => setError("")}>{error}</p>}
        {success && <p style={styles.success} onClick={() => setSuccess("")}>{success}</p>}

        <div style={styles.tabs}>
          <button style={tab === "users"   ? styles.tabActive : styles.tab} onClick={() => setTab("users")}>Users</button>
          <button style={tab === "classes" ? styles.tabActive : styles.tab} onClick={() => setTab("classes")}>Classes</button>
        </div>

        {tab === "users" && (
          <div>
            <h2 style={styles.sectionTitle}>Create User</h2>
            <form onSubmit={handleCreateUser} style={styles.form}>
              <input style={styles.input} placeholder="Name"     value={newUser.name}     onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}     required />
              <input style={styles.input} placeholder="Email"    value={newUser.email}    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}    required type="email" />
              <input style={styles.input} placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required type="password" />
              <select style={styles.input} value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
                <option value="vikar">Vikar</option>
              </select>
              <button style={styles.button} type="submit">Create User</button>
            </form>

            <h2 style={styles.sectionTitle}>All Users ({users.length})</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={styles.tr}>
                    <td style={styles.td}>{u.name}</td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...roleBadge(u.role) }}>{u.role}</span>
                    </td>
                    <td style={styles.td}>
                      {u.id !== user.id && (
                        <button style={styles.deleteBtn} onClick={() => handleDeleteUser(u.id)}>Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "classes" && (
          <div>
            <h2 style={styles.sectionTitle}>Create Class</h2>
            <form onSubmit={handleCreateClass} style={styles.form}>
              <input style={styles.input} placeholder="Class name (e.g. 3A)" value={newClass.name} onChange={(e) => setNewClass({ ...newClass, name: e.target.value })} required />
              <input style={styles.input} placeholder="Year (e.g. 2024)"     value={newClass.year} onChange={(e) => setNewClass({ ...newClass, year: e.target.value })} required type="number" />
              <button style={styles.button} type="submit">Create Class</button>
            </form>

            <h2 style={styles.sectionTitle}>All Classes ({classes.length})</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Year</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((c) => (
                  <tr key={c.id} style={styles.tr}>
                    <td style={styles.td}>{c.name}</td>
                    <td style={styles.td}>{c.year}</td>
                    <td style={styles.td}>
                      <button style={styles.deleteBtn} onClick={() => handleDeleteClass(c.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

const roleBadge = (role) => ({
  admin:   { background: "#fef3c7", color: "#92400e" },
  teacher: { background: "#dbeafe", color: "#1e40af" },
  student: { background: "#d1fae5", color: "#065f46" },
  vikar:   { background: "#f3e8ff", color: "#6b21a8" },
}[role] || {})

const styles = {
  wrapper:      { display: "flex", minHeight: "100vh" },
  sidebar:      { width: "220px", background: "#1e293b", color: "#fff", display: "flex", flexDirection: "column", padding: "1.5rem 1rem", gap: "0.5rem" },
  logo:         { fontSize: "1.4rem", fontWeight: "700", marginBottom: "2rem", color: "#fff" },
  nav:          { display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 },
  navItem:      { padding: "0.6rem 0.75rem", borderRadius: "4px", cursor: "pointer", color: "#cbd5e1", fontSize: "0.95rem" },
  logout:       { padding: "0.6rem", background: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600" },
  main:         { flex: 1, padding: "2rem" },
  heading:      { fontSize: "1.8rem", marginBottom: "1rem" },
  error:        { background: "#fee", color: "#c00", padding: "0.75rem", borderRadius: "4px", marginBottom: "1rem", cursor: "pointer" },
  success:      { background: "#d1fae5", color: "#065f46", padding: "0.75rem", borderRadius: "4px", marginBottom: "1rem", cursor: "pointer" },
  tabs:         { display: "flex", gap: "0.5rem", marginBottom: "1.5rem" },
  tab:          { padding: "0.5rem 1.25rem", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer", background: "#fff" },
  tabActive:    { padding: "0.5rem 1.25rem", border: "1px solid #2563eb", borderRadius: "4px", cursor: "pointer", background: "#2563eb", color: "#fff" },
  sectionTitle: { fontSize: "1.1rem", fontWeight: "600", margin: "1.5rem 0 0.75rem" },
  form:         { display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" },
  input:        { padding: "0.5rem 0.75rem", borderRadius: "4px", border: "1px solid #ccc", fontSize: "0.95rem" },
  button:       { padding: "0.5rem 1.25rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600" },
  table:        { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  th:           { padding: "0.75rem 1rem", textAlign: "left", background: "#f8fafc", fontWeight: "600", fontSize: "0.9rem", borderBottom: "1px solid #e2e8f0" },
  tr:           { borderBottom: "1px solid #f1f5f9" },
  td:           { padding: "0.75rem 1rem", fontSize: "0.95rem" },
  badge:        { padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: "600" },
  deleteBtn:    { padding: "0.3rem 0.75rem", background: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem" },
}