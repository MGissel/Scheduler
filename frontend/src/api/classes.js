import api from "./axios"

export const getClasses = () => api.get("/classes/")
export const createClass = (data) => api.post("/classes/", data)
export const deleteClass = (id) => api.delete(`/classes/${id}/`)
export const updateClass = (id, data) => api.patch(`/classes/${id}/`, data)