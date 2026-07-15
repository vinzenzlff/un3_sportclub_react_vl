const classScheduleRepository = require("../repositories/classSchedule.repository");
const { SportRoom } = require("../models");

const {
    validateCreateClassSchedule,
    validateUpdateClassSchedule
} = require("../validators/classSchedule.validator");

async function getAllClassSchedules(filters) {
    return classScheduleRepository.findAll(filters);
}

async function getClassScheduleById(id) {
    const schedule = await classScheduleRepository.findById(id);

    if (!schedule) {
        const error = new Error("Horario de clase no encontrado.");
        error.statusCode = 404;
        throw error;
    }

    return schedule;
}

async function validateReferences(payload) {
    if (payload.sport_room_id !== undefined) {
        const sportRoom = await SportRoom.findByPk(payload.sport_room_id);

        if (!sportRoom) {
            const error = new Error("La asignación deporte-sala seleccionada no existe.");
            error.statusCode = 404;
            throw error;
        }
    }
}

async function createClassSchedule(payload) {
    const errors = validateCreateClassSchedule(payload);

    if (errors.length > 0) {
        const error = new Error("Datos inválidos.");
        error.statusCode = 400;
        error.details = errors;
        throw error;
    }

    await validateReferences(payload);

    const duplicate = await classScheduleRepository.findDuplicate(
        payload.sport_room_id,
        payload.day_of_week,
        payload.start_time,
        payload.end_time
    );

    if (duplicate) {
        const error = new Error("Ya existe un horario igual para esta asignación.");
        error.statusCode = 409;
        throw error;
    }

    return classScheduleRepository.create(payload);
}

async function updateClassSchedule(id, payload) {
    const errors = validateUpdateClassSchedule(payload);

    if (errors.length > 0) {
        const error = new Error("Datos inválidos.");
        error.statusCode = 400;
        error.details = errors;
        throw error;
    }

    const currentSchedule = await classScheduleRepository.findById(id);

    if (!currentSchedule) {
        const error = new Error("Horario de clase no encontrado.");
        error.statusCode = 404;
        throw error;
    }

    await validateReferences(payload);

    const sport_room_id = payload.sport_room_id ?? currentSchedule.sport_room_id;
    const day_of_week = payload.day_of_week ?? currentSchedule.day_of_week;
    const start_time = payload.start_time ?? currentSchedule.start_time;
    const end_time = payload.end_time ?? currentSchedule.end_time;

    const duplicate = await classScheduleRepository.findDuplicate(
        sport_room_id,
        day_of_week,
        start_time,
        end_time
    );

    if (duplicate && Number(duplicate.id) !== Number(id)) {
        const error = new Error("Ya existe un horario igual para esta asignación.");
        error.statusCode = 409;
        throw error;
    }

    return classScheduleRepository.updateById(id, payload);
}

async function deleteClassSchedule(id) {
    const deleted = await classScheduleRepository.deleteById(id);

    if (!deleted) {
        const error = new Error("Horario de clase no encontrado.");
        error.statusCode = 404;
        throw error;
    }

    return true;
}

module.exports = {
    getAllClassSchedules,
    getClassScheduleById,
    createClassSchedule,
    updateClassSchedule,
    deleteClassSchedule
};
