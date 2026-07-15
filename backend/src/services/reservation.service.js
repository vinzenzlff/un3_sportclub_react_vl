const reservationRepository = require("../repositories/reservation.repository");
const { ClassSchedule } = require("../models");
const {
    validateCreateReservation
} = require("../validators/reservation.validator");

async function getAllReservations(filters) {
    return reservationRepository.findAll(filters);
}

async function getMyReservations(userId) {
    return reservationRepository.findAll({
        user_id: userId
    });
}

async function createReservation(userId, payload) {
    const errors = validateCreateReservation(payload);

    if (errors.length > 0) {
        const error = new Error("Datos inválidos.");
        error.statusCode = 400;
        error.details = errors;
        throw error;
    }

    const schedule = await ClassSchedule.findByPk(payload.class_schedule_id);

    if (!schedule) {
        const error = new Error("El horario seleccionado no existe.");
        error.statusCode = 404;
        throw error;
    }

    if (!schedule.status) {
        const error = new Error("El horario seleccionado no está disponible.");
        error.statusCode = 400;
        throw error;
    }

    const existingReservation =
        await reservationRepository.findActiveByUserAndSchedule(
            userId,
            payload.class_schedule_id
        );

    if (existingReservation) {
        const error = new Error("Ya tienes una reserva activa para este horario.");
        error.statusCode = 409;
        throw error;
    }

    return reservationRepository.create({
        user_id: userId,
        class_schedule_id: payload.class_schedule_id,
        observation: payload.observation || null,
        status: "active"
    });
}

async function cancelReservation(userId, reservationId) {
    const reservation = await reservationRepository.findById(reservationId);

    if (!reservation) {
        const error = new Error("Reserva no encontrada.");
        error.statusCode = 404;
        throw error;
    }

    if (Number(reservation.user_id) !== Number(userId)) {
        const error = new Error("No puedes cancelar una reserva que no te pertenece.");
        error.statusCode = 403;
        throw error;
    }

    if (reservation.status === "cancelled") {
        const error = new Error("La reserva ya se encuentra cancelada.");
        error.statusCode = 400;
        throw error;
    }

    return reservationRepository.updateById(reservationId, {
        status: "cancelled"
    });
}

module.exports = {
    getAllReservations,
    getMyReservations,
    createReservation,
    cancelReservation
};
