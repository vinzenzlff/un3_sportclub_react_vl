import { getToken } from "./authService"

const BASE_URL = "http://localhost:3000/api"

function getHeaders() {
    const token = getToken()
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }
}

// GET /api/member/classes (Consultar clases para miembros/usuarios)
export async function getMemberClasses() {
    const response = await fetch(`${BASE_URL}/member/classes`, {
        method: "GET",
        headers: getHeaders()
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al obtener clases disponibles")
    }
    return data.data
}

// POST /api/reservations (Crear una reserva)
// Recibe un objeto como { class_schedule_id: Number }
export async function createReservation(reservationData) {
    const response = await fetch(`${BASE_URL}/reservations`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(reservationData)
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al realizar la reserva")
    }
    return data.data
}

// GET /api/reservations/my-reservations (Ver mis reservas)
export async function getMyReservations() {
    const response = await fetch(`${BASE_URL}/reservations/my-reservations`, {
        method: "GET",
        headers: getHeaders()
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al obtener mis reservas")
    }
    return data.data
}

// PATCH /api/reservations/:id/cancel (Cancelar una reserva)
export async function cancelReservation(id) {
    const response = await fetch(`${BASE_URL}/reservations/${id}/cancel`, {
        method: "PATCH",
        headers: getHeaders()
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al cancelar la reserva")
    }
    return data.data
}
