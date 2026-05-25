import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getSchedule, getTimeslots, getCourses, getRooms } from "../api/schedule"

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"]

export default function Schedule() {
  const { user, logout }          = useAuth()
  const navigate                  = useNavigate()
  const [entries, setEntries]     = useState([])
  const [timeslots, setTimeslots] = useState([])
  const [week, setWeek]           = useState(getCurrentWeek())
  const [error, setError]         = useState("")

  useEffect(() => {
    fetchSchedule()
    fetchTimeslots()
  }, [week])

  function getCurrentWeek() {
    const now     = new Date()
    const start   = new Date(now.getFullYear(), 0, 1)
    const days    = Math.floor((now - start) / (24 * 60 * 60 * 1000))
    return Math.ceil((days + start.getDay() + 1) / 7)
  }

  const fetchSchedule = async () => {
    try {
      const res = await getSchedule({ week })
      setEntries(res.data)
    } catch {
      setError("Failed to load schedule")
    }
  }

  const fetchTimeslots = async () => {
    try {
      const res = await getTimeslots()
      setTimeslots(res.data)
    } catch {}
  }

  const getEntry = (day, timeslot) => {
    return entries.find(
      (e) => e.time_slot === timeslot.id &&
             timeslot.day_of_week === day
    )
  }

  const uniqueSlotTimes = [...new Map(
    timeslots.map((t) => [`${t.start_time}-${t.end_time}`, t])
  ).values()]

  return (
    <div style={styles.wrapper}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Scheduler</h2>
        <nav style={styles.nav}>
          <a style={styles.navItem} onClick={() => navigate("/dashboard")}>Dashboard</a>
          <a style={styles.navItem} onClick={() => navigate("/schedule")}>Schedule</a>
          <a style={styles.navItem} onClick={() => navigate("/messages")}>Messages</a>
          {user.role === "admin" && <a style={styles.navItem} onClick={() => navigate("/admin")}>Admin</a>}
        </nav>
        <button style={styles.logout} onClick={() => { logout(); navigate("/login") }}>
          Sign out
        </button>
      </div>

      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.heading}>Schedule</h1>
          <div style={styles.weekNav}>
            <button style={styles.weekBtn} onClick={() => setWeek(week - 1)}>← Prev</button>
            <span style={styles.weekLabel}>Week {week}</span>
            <button style={styles.weekBtn} onClick={() => setWeek(week + 1)}>Next →</button>
          </div>
        </div>

        {error && <p style={styles.error} onClick={() => setError("")}>{error}</p>}

        {timeslots.length === 0 && (
          <div style={styles.empty}>
            <p>No timeslots have been created yet.</p>
            {user.role === "admin" && (
              <p>Go to the admin panel to set up timeslots and schedule entries.</p>
            )}
          </div>
        )}

        {timeslots.length > 0 && (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Time</th>
                  {DAYS.map((day) => (
                    <th key={day} style={styles.th}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {uniqueSlotTimes.map((slot) => (
                  <tr key={slot.id}>
                    <td style={styles.timeCell}>
                      {slot.start_time.slice(0, 5)}–{slot.end_time.slice(0, 5)}
                    </td>
                    {DAYS.map((day) => {
                      const daySlot = timeslots.find(
                        (t) => t.day_of_week === day &&
                               t.start_time === slot.start_time &&
                               t.end_time === slot.end_time
                      )
                      const entry = daySlot ? getEntry(day, daySlot) : null
                      return (
                        <td key={day} style={styles.cell}>
                          {entry ? (
                            <div style={styles.entryCard}>
                              <div style={styles.entryTitle}>
                                {entry.course_name || `Course ${entry.course}`}
                              </div>
                              <div style={styles.entryRoom}>
                                {entry.room_name || `Room ${entry.room}`}
                              </div>
                            </div>
                          ) : (
                            <div style={styles.empty2} />
                          )}
                        </td>
                      )
                    })}
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

const styles = {
  wrapper:      { display: "flex", minHeight: "100vh" },
  sidebar:      { width: "220px", background: "#1e293b", color: "#fff", display: "flex", flexDirection: "column", padding: "1.5rem 1rem", gap: "0.5rem" },
  logo:         { fontSize: "1.4rem", fontWeight: "700", marginBottom: "2rem", color: "#fff" },
  nav:          { display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 },
  navItem:      { padding: "0.6rem 0.75rem", borderRadius: "4px", cursor: "pointer", color: "#cbd5e1", fontSize: "0.95rem" },
  logout:       { padding: "0.6rem", background: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600" },
  main:         { flex: 1, padding: "2rem" },
  header:       { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" },
  heading:      { fontSize: "1.8rem" },
  weekNav:      { display: "flex", alignItems: "center", gap: "1rem" },
  weekBtn:      { padding: "0.4rem 1rem", background: "#fff", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer" },
  weekLabel:    { fontWeight: "600", fontSize: "1rem", minWidth: "80px", textAlign: "center" },
  error:        { background: "#fee", color: "#c00", padding: "0.75rem", borderRadius: "4px", marginBottom: "1rem", cursor: "pointer" },
  empty:        { background: "#fff", padding: "2rem", borderRadius: "8px", color: "#64748b", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  tableWrapper: { overflowX: "auto" },
  table:        { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  th:           { padding: "0.75rem 1rem", background: "#f8fafc", fontWeight: "600", fontSize: "0.9rem", borderBottom: "1px solid #e2e8f0", textAlign: "center" },
  timeCell:     { padding: "0.75rem 1rem", fontWeight: "600", fontSize: "0.85rem", color: "#64748b", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap", textAlign: "center" },
  cell:         { padding: "0.4rem", borderBottom: "1px solid #f1f5f9", borderLeft: "1px solid #f1f5f9", verticalAlign: "top", minWidth: "120px" },
  entryCard:    { background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "4px", padding: "0.4rem 0.6rem" },
  entryTitle:   { fontWeight: "600", fontSize: "0.85rem", color: "#1e40af" },
  entryRoom:    { fontSize: "0.8rem", color: "#3b82f6", marginTop: "0.2rem" },
  empty2:       { minHeight: "40px" },
}