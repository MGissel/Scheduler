import api from "./axios"

export const getInbox    = () => api.get("/messages/inbox/")
export const getSent     = () => api.get("/messages/sent/")
export const sendMessage = (data) => api.post("/messages/compose/", data)
export const markAsRead  = (id) => api.post(`/messages/${id}/read/`)