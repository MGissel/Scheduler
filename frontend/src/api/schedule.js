import api from "./axios"

export const getSchedule  = (params) => api.get("/schedule/", { params })
export const getTimeslots = () => api.get("/schedule/timeslots/")
export const getCourses   = () => api.get("/courses/")
export const getRooms     = () => api.get("/rooms/")
export const createTimeslot     = (data) => api.post("/schedule/timeslots/", data)
export const createScheduleEntry = (data) => api.post("/schedule/", data)