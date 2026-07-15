const roomRepository = require("../repositories/room.repository");
const {
    validateCreateRoom,
    validateUpdateRoom
} = require("../validators/room.validator");

async function getAllRooms(filters) {
    return roomRepository.findAll(filters);
}

async function getRoomById(id) {
    const room = await roomRepository.findById(id);

    if (!room) {
        const error = new Error("Sala no encontrada.");
        error.statusCode = 404;
        throw error;
    }

    return room;
}

async function createRoom(payload) {
    const errors = validateCreateRoom(payload);

    if (errors.length > 0) {
        const error = new Error("Datos inválidos.");
        error.statusCode = 400;
        error.details = errors;
        throw error;
    }

    const existingRoom = await roomRepository.findByName(payload.name);

    if (existingRoom) {
        const error = new Error("Ya existe una sala con ese nombre.");
        error.statusCode = 409;
        throw error;
    }

    return roomRepository.create(payload);
}

async function updateRoom(id, payload) {
    const errors = validateUpdateRoom(payload);

    if (errors.length > 0) {
        const error = new Error("Datos inválidos.");
        error.statusCode = 400;
        error.details = errors;
        throw error;
    }

    const room = await roomRepository.updateById(id, payload);

    if (!room) {
        const error = new Error("Sala no encontrada.");
        error.statusCode = 404;
        throw error;
    }

    return room;
}

async function deleteRoom(id) {
    const deleted = await roomRepository.deleteById(id);

    if (!deleted) {
        const error = new Error("Sala no encontrada.");
        error.statusCode = 404;
        throw error;
    }

    return true;
}

module.exports = {
    getAllRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom
};