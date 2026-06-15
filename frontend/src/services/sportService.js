import { getToken } from "./authService"

const API_URL = "http://localhost:3000/api/sport"

function getHeaders() {
    const token = getToken()
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }
}

// GET /api/sports (Listar todos)
export async function getSports() {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: getHeaders()
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al obtener deportes")
    }
    return data.data // Retorna la lista de deportes
}

// GET /api/sports/:id (Obtener uno)
export async function getSportById(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: getHeaders()
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al obtener el deporte")
    }
    return data.data
}

// POST /api/sports (Crear deporte)
export async function createSport(sportData) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(sportData)
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al crear el deporte")
    }
    return data.data
}

// PUT /api/sports/:id (Editar deporte)
export async function updateSport(id, sportData) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(sportData)
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al actualizar el deporte")
    }
    return data.data
}

// DELETE /api/sports/:id (Eliminar deporte)
export async function deleteSport(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getHeaders()
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al eliminar el deporte")
    }
    return data
}

// PATCH /api/sports/:id/status (Cambiar estado directamente)
export async function updateSportStatus(id, status) {
    const response = await fetch(`${API_URL}/${id}/status`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ status })
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al cambiar el estado del deporte")
    }
    return data.data
}
