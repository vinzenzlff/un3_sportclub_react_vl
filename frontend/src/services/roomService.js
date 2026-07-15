import { getToken } from "./authService"

const BASE_URL = "http://localhost:3000/api"

function getHeaders() {
    const token = getToken()
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }
}

// ==========================================
// SALAS (/api/rooms)
// ==========================================

// GET /api/rooms
export async function getRooms() {
    const response = await fetch(`${BASE_URL}/rooms`, {
        method: "GET",
        headers: getHeaders()
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al obtener salas")
    }
    return data.data
}

// GET /api/rooms/:id
export async function getRoomById(id) {
    const response = await fetch(`${BASE_URL}/rooms/${id}`, {
        method: "GET",
        headers: getHeaders()
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al obtener la sala")
    }
    return data.data
}

// POST /api/rooms
export async function createRoom(roomData) {
    const response = await fetch(`${BASE_URL}/rooms`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(roomData)
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al crear la sala")
    }
    return data.data
}

// PUT /api/rooms/:id
export async function updateRoom(id, roomData) {
    const response = await fetch(`${BASE_URL}/rooms/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(roomData)
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al actualizar la sala")
    }
    return data.data
}

// DELETE /api/rooms/:id
export async function deleteRoom(id) {
    const response = await fetch(`${BASE_URL}/rooms/${id}`, {
        method: "DELETE",
        headers: getHeaders()
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al eliminar la sala")
    }
    return data
}

// ==========================================
// ASIGNACIONES DE DEPORTE A SALA (/api/sport-rooms)
// ==========================================

// GET /api/sport-rooms
export async function getSportRooms() {
    const response = await fetch(`${BASE_URL}/sport-rooms`, {
        method: "GET",
        headers: getHeaders()
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al obtener asignaciones de sala")
    }
    return data.data
}

// GET /api/sport-rooms/:id
export async function getSportRoomById(id) {
    const response = await fetch(`${BASE_URL}/sport-rooms/${id}`, {
        method: "GET",
        headers: getHeaders()
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al obtener asignación de sala")
    }
    return data.data
}

// POST /api/sport-rooms
export async function createSportRoom(sportRoomData) {
    const response = await fetch(`${BASE_URL}/sport-rooms`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(sportRoomData)
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al crear asignación de sala")
    }
    return data.data
}

// PUT /api/sport-rooms/:id
export async function updateSportRoom(id, sportRoomData) {
    const response = await fetch(`${BASE_URL}/sport-rooms/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(sportRoomData)
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al actualizar asignación de sala")
    }
    return data.data
}

// DELETE /api/sport-rooms/:id
export async function deleteSportRoom(id) {
    const response = await fetch(`${BASE_URL}/sport-rooms/${id}`, {
        method: "DELETE",
        headers: getHeaders()
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al eliminar asignación de sala")
    }
    return data
}
