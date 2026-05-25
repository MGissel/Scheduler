import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getInbox, getSent, sendMessage, markAsRead } from "../api/messages"
import { getUsers } from "../api/users"

export default function Messages() {
  const { user, logout }            = useAuth()
  const navigate                    = useNavigate()
  const [tab, setTab]               = useState("inbox")
  const [inbox, setInbox]           = useState([])
  const [sent, setSent]             = useState([])
  const [users, setUsers]           = useState([])
  const [selected, setSelected]     = useState(null)
  const [composing, setComposing]   = useState(false)
  const [error, setError]           = useState("")
  const [success, setSuccess]       = useState("")
  const [newMessage, setNewMessage] = useState({ recipient: "", subject: "", body: "" })

  useEffect(() => {
    fetchInbox()
    fetchSent()
    fetchUsers()
  }, [])

  const fetchInbox = async () => {
    try {
      const res = await getInbox()
      setInbox(res.data)
    } catch {
      setError("Failed to load inbox")
    }
  }

  const fetchSent = async () => {
    try {
      const res = await getSent()
      setSent(res.data)
    } catch {
      setError("Failed to load sent messages")
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await getUsers()
      setUsers(res.data)
    } catch {}
  }

  const handleSelect = async (message) => {
    setSelected(message)
    setComposing(false)
    if (!message.read_at && tab === "inbox") {
      try {
        await markAsRead(message.id)
        setInbox(inbox.map((m) => m.id === message.id ? { ...m, read_at: new Date().toISOString() } : m))
      } catch {}
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    try {
      await sendMessage(newMessage)
      setNewMessage({ recipient: "", subject: "", body: "" })
      setComposing(false)
      setSuccess("Message sent")
      fetchSent()
    } catch {
      setError("Failed to send message")
    }
  }

  const messages = tab === "inbox" ? inbox : sent
  const unread   = inbox.filter((m) => !m.read_at).length

  return (
    <div style={styles.wrapper}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Scheduler</h2>
        <nav style={styles.nav}>
          <a style={styles.navItem} onClick={() => navigate("/dashboard")}>Dashboard</a>
          <a style={styles.navItem} onClick={() => navigate("/messages")}>Messages</a>
          {user.role === "admin" && <a style={styles.navItem} onClick={() => navigate("/admin")}>Admin</a>}
        </nav>
        <button style={styles.logout} onClick={() => { logout(); navigate("/login") }}>
          Sign out
        </button>
      </div>

      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.heading}>Messages</h1>
          <button style={styles.composeBtn} onClick={() => { setComposing(true); setSelected(null) }}>
            + Compose
          </button>
        </div>

        {error   && <p style={styles.error}   onClick={() => setError("")}>{error}</p>}
        {success && <p style={styles.success} onClick={() => setSuccess("")}>{success}</p>}

        <div style={styles.container}>
          <div style={styles.list}>
            <div style={styles.tabs}>
              <button style={tab === "inbox" ? styles.tabActive : styles.tab} onClick={() => { setTab("inbox"); setSelected(null) }}>
                Inbox {unread > 0 && <span style={styles.badge}>{unread}</span>}
              </button>
              <button style={tab === "sent" ? styles.tabActive : styles.tab} onClick={() => { setTab("sent"); setSelected(null) }}>
                Sent
              </button>
            </div>

            {messages.length === 0 && (
              <p style={styles.empty}>No messages here yet.</p>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                style={{ ...styles.messageRow, ...(selected?.id === m.id ? styles.messageRowActive : {}), ...(tab === "inbox" && !m.read_at ? styles.messageRowUnread : {}) }}
                onClick={() => handleSelect(m)}
              >
                <div style={styles.messageFrom}>
                  {tab === "inbox" ? `From: ${m.sender}` : `To: ${m.recipient}`}
                </div>
                <div style={styles.messageSubject}>{m.subject}</div>
                <div style={styles.messageDate}>
                  {new Date(m.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>

          <div style={styles.detail}>
            {composing && (
              <div>
                <h2 style={styles.detailTitle}>New Message</h2>
                <form onSubmit={handleSend} style={styles.composeForm}>
                  <label style={styles.label}>To</label>
                  <select
                    style={styles.input}
                    value={newMessage.recipient}
                    onChange={(e) => setNewMessage({ ...newMessage, recipient: e.target.value })}
                    required
                  >
                    <option value="">Select recipient</option>
                    {users.filter((u) => u.id !== user.id).map((u) => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                  <label style={styles.label}>Subject</label>
                  <input
                    style={styles.input}
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                    required
                    placeholder="Subject"
                  />
                  <label style={styles.label}>Message</label>
                  <textarea
                    style={styles.textarea}
                    value={newMessage.body}
                    onChange={(e) => setNewMessage({ ...newMessage, body: e.target.value })}
                    required
                    placeholder="Write your message..."
                    rows={8}
                  />
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button style={styles.sendBtn} type="submit">Send</button>
                    <button style={styles.cancelBtn} type="button" onClick={() => setComposing(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {selected && !composing && (
              <div>
                <h2 style={styles.detailTitle}>{selected.subject}</h2>
                <p style={styles.detailMeta}>
                  {tab === "inbox" ? `From: ${selected.sender}` : `To: ${selected.recipient}`}
                  {" · "}
                  {new Date(selected.created_at).toLocaleString()}
                </p>
                <div style={styles.detailBody}>{selected.body}</div>
              </div>
            )}

            {!selected && !composing && (
              <p style={styles.empty}>Select a message to read it.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper:          { display: "flex", minHeight: "100vh" },
  sidebar:          { width: "220px", background: "#1e293b", color: "#fff", display: "flex", flexDirection: "column", padding: "1.5rem 1rem", gap: "0.5rem" },
  logo:             { fontSize: "1.4rem", fontWeight: "700", marginBottom: "2rem", color: "#fff" },
  nav:              { display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 },
  navItem:          { padding: "0.6rem 0.75rem", borderRadius: "4px", cursor: "pointer", color: "#cbd5e1", fontSize: "0.95rem" },
  logout:           { padding: "0.6rem", background: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600" },
  main:             { flex: 1, padding: "2rem", display: "flex", flexDirection: "column" },
  header:           { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" },
  heading:          { fontSize: "1.8rem" },
  composeBtn:       { padding: "0.5rem 1.25rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600" },
  error:            { background: "#fee", color: "#c00", padding: "0.75rem", borderRadius: "4px", marginBottom: "1rem", cursor: "pointer" },
  success:          { background: "#d1fae5", color: "#065f46", padding: "0.75rem", borderRadius: "4px", marginBottom: "1rem", cursor: "pointer" },
  container:        { display: "flex", gap: "1rem", flex: 1, minHeight: 0 },
  list:             { width: "320px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflow: "auto" },
  tabs:             { display: "flex", borderBottom: "1px solid #e2e8f0" },
  tab:              { flex: 1, padding: "0.75rem", border: "none", background: "none", cursor: "pointer", fontSize: "0.95rem", color: "#64748b" },
  tabActive:        { flex: 1, padding: "0.75rem", border: "none", background: "none", cursor: "pointer", fontSize: "0.95rem", color: "#2563eb", borderBottom: "2px solid #2563eb", fontWeight: "600" },
  badge:            { background: "#ef4444", color: "#fff", borderRadius: "999px", padding: "0.1rem 0.4rem", fontSize: "0.75rem", marginLeft: "0.25rem" },
  messageRow:       { padding: "0.75rem 1rem", borderBottom: "1px solid #f1f5f9", cursor: "pointer" },
  messageRowActive: { background: "#eff6ff" },
  messageRowUnread: { fontWeight: "600", borderLeft: "3px solid #2563eb" },
  messageFrom:      { fontSize: "0.8rem", color: "#64748b", marginBottom: "0.2rem" },
  messageSubject:   { fontSize: "0.95rem" },
  messageDate:      { fontSize: "0.8rem", color: "#94a3b8", marginTop: "0.2rem" },
  empty:            { padding: "2rem", color: "#94a3b8", textAlign: "center" },
  detail:           { flex: 1, background: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: "1.5rem", overflow: "auto" },
  detailTitle:      { fontSize: "1.3rem", fontWeight: "600", marginBottom: "0.5rem" },
  detailMeta:       { fontSize: "0.85rem", color: "#64748b", marginBottom: "1.5rem" },
  detailBody:       { fontSize: "0.95rem", lineHeight: "1.7", whiteSpace: "pre-wrap" },
  composeForm:      { display: "flex", flexDirection: "column", gap: "0.5rem" },
  label:            { fontWeight: "600", fontSize: "0.9rem" },
  input:            { padding: "0.5rem 0.75rem", borderRadius: "4px", border: "1px solid #ccc", fontSize: "0.95rem" },
  textarea:         { padding: "0.5rem 0.75rem", borderRadius: "4px", border: "1px solid #ccc", fontSize: "0.95rem", resize: "vertical" },
  sendBtn:          { padding: "0.5rem 1.25rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600" },
  cancelBtn:        { padding: "0.5rem 1.25rem", background: "#e2e8f0", color: "#333", border: "none", borderRadius: "4px", cursor: "pointer" },
}