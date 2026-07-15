import { getToken } from "./authService"

const BASE_URL = "http://localhost:3000/api/coach"

function getHeaders() {
    const token = getToken()
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }
}

// GET /api/coach/my-classes
export async function getMyClasses() {
    const response = await fetch(`${BASE_URL}/my-classes`, {
        method: "GET",
        headers: getHeaders()
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al obtener mis clases")
    }
    return data.data
}

// GET /api/coach/my-schedules
export async function getMySchedules() {
    const response = await fetch(`${BASE_URL}/my-schedules`, {
        method: "GET",
        headers: getHeaders()
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al obtener mis horarios")
    }
    return data.data
}

// GET /api/coach/my-rooms
export async function getMyRooms() {
    const response = await fetch(`${BASE_URL}/my-rooms`, {
        method: "GET",
        headers: getHeaders()
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al obtener mis salas")
    }
    return data.data
}
