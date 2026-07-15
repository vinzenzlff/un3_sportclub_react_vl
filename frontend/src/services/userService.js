import { getToken } from "./authService"

const API_URL = "http://localhost:3000/api/users"

// Función auxiliar para obtener las cabeceras con el token de autorización
function getHeaders() {
    const token = getToken()
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }
}

// Obtener todos los usuarios
export async function getUsers() {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: getHeaders()
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al obtener usuarios")
    }
    return data.data // Retorna la lista de usuarios
}

// Obtener un usuario por ID
export async function getUserById(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: getHeaders()
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al obtener usuario")
    }
    return data.data
}

// Crear un nuevo usuario
export async function createUser(userData) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(userData)
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al crear usuario")
    }
    return data.data
}

// Actualizar un usuario existente
export async function updateUser(id, userData) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(userData)
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al actualizar usuario")
    }
    return data.data
}

// Eliminar un usuario
export async function deleteUser(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getHeaders()
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Error al eliminar usuario")
    }
    return data
}
