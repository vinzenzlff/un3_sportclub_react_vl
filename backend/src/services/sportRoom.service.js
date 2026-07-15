const sportRoomRepository = require("../repositories/sportRoom.repository");
const { Sport, Room, User } = require("../models");

const {
    validateCreateSportRoom,
    validateUpdateSportRoom
} = require("../validators/sportRoom.validator");

async function getAllSportRooms(filters) {
    return sportRoomRepository.findAll(filters);
}

async function getSportRoomById(id) {
    const sportRoom = await sportRoomRepository.findById(id);

    if (!sportRoom) {
        const error = new Error("Asignación deporte-sala no encontrada.");
        error.statusCode = 404;
        throw error;
    }

    return sportRoom;
}

async function validateReferences(payload) {
    if (payload.sport_id !== undefined) {
        const sport = await Sport.findByPk(payload.sport_id);

        if (!sport) {
            const error = new Error("El deporte seleccionado no existe.");
            error.statusCode = 404;
            throw error;
        }
    }

    if (payload.room_id !== undefined) {
        const room = await Room.findByPk(payload.room_id);

        if (!room) {
            const error = new Error("La sala seleccionada no existe.");
            error.statusCode = 404;
            throw error;
        }
    }

    if (payload.coach_id !== undefined) {
        const coach = await User.findByPk(payload.coach_id);

        if (!coach) {
            const error = new Error("El coach seleccionado no existe.");
            error.statusCode = 404;
            throw error;
        }

        if (coach.role && coach.role !== "coach") {
            const error = new Error("El usuario seleccionado no tiene rol de coach.");
            error.statusCode = 400;
            throw error;
        }
    }
}

async function createSportRoom(payload) {
    const errors = validateCreateSportRoom(payload);

    if (errors.length > 0) {
        const error = new Error("Datos inválidos.");
        error.statusCode = 400;
        error.details = errors;
        throw error;
    }

    await validateReferences(payload);

    const duplicate = await sportRoomRepository.findDuplicate(
        payload.sport_id,
        payload.room_id,
        payload.coach_id
    );

    if (duplicate) {
        const error = new Error("Ya existe esta asignación de deporte, sala y coach.");
        error.statusCode = 409;
        throw error;
    }

    return sportRoomRepository.create(payload);
}

async function updateSportRoom(id, payload) {
    const errors = validateUpdateSportRoom(payload);

    if (errors.length > 0) {
        const error = new Error("Datos inválidos.");
        error.statusCode = 400;
        error.details = errors;
        throw error;
    }

    const currentSportRoom = await sportRoomRepository.findById(id);

    if (!currentSportRoom) {
        const error = new Error("Asignación deporte-sala no encontrada.");
        error.statusCode = 404;
        throw error;
    }

    await validateReferences(payload);

    const sport_id = payload.sport_id ?? currentSportRoom.sport_id;
    const room_id = payload.room_id ?? currentSportRoom.room_id;
    const coach_id = payload.coach_id ?? currentSportRoom.coach_id;

    const duplicate = await sportRoomRepository.findDuplicate(
        sport_id,
        room_id,
        coach_id
    );

    if (duplicate && Number(duplicate.id) !== Number(id)) {
        const error = new Error("Ya existe esta asignación de deporte, sala y coach.");
        error.statusCode = 409;
        throw error;
    }

    return sportRoomRepository.updateById(id, payload);
}

async function deleteSportRoom(id) {
    const deleted = await sportRoomRepository.deleteById(id);

    if (!deleted) {
        const error = new Error("Asignación deporte-sala no encontrada.");
        error.statusCode = 404;
        throw error;
    }

    return true;
}

module.exports = {
    getAllSportRooms,
    getSportRoomById,
    createSportRoom,
    updateSportRoom,
    deleteSportRoom
};
