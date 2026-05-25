import api from "./axios"

export const getUsers = () => api.get("/auth/users/")
export const deleteUser = (id) => api.delete(`/auth/users/${id}/`)
export const updateUser = (id, data) => api.patch(`/auth/users/${id}/`, data)
export const createUser = (data) => api.post("/auth/register/", data)