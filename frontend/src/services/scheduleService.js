import { getToken } from "./authService"

const API_URL = "http://localhost:3000/api/class-schedules"

function getHeaders() {
    const token = getToken()
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }
}

// GET /api/class-schedules (Listar todos)
export async function getClassSchedules() {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: getHeaders()
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al obtener horarios de clases")
    }
    return data.data
}

// GET /api/class-schedules/:id (Obtener uno)
export async function getClassScheduleById(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: getHeaders()
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al obtener el horario de clase")
    }
    return data.data
}

// POST /api/class-schedules (Crear horario de clase)
export async function createClassSchedule(scheduleData) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(scheduleData)
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al crear el horario de clase")
    }
    return data.data
}

// PUT /api/class-schedules/:id (Editar horario de clase)
export async function updateClassSchedule(id, scheduleData) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(scheduleData)
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al actualizar el horario de clase")
    }
    return data.data
}

// DELETE /api/class-schedules/:id (Eliminar horario de clase)
export async function deleteClassSchedule(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getHeaders()
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al eliminar el horario de clase")
    }
    return data
}
