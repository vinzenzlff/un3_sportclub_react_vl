function validateTimeRange(startTime, endTime) {
    if (!startTime || !endTime) {
        return false;
    }

    return startTime < endTime;
}

function validateCreateClassSchedule(payload) {
    const errors = [];

    if (!payload.sport_room_id || Number(payload.sport_room_id) < 1) {
        errors.push("Debe seleccionar una asignación deporte-sala válida.");
    }

    if (!payload.day_of_week || Number(payload.day_of_week) < 1 || Number(payload.day_of_week) > 7) {
        errors.push("El día de la semana debe estar entre 1 y 7.");
    }

    if (!payload.start_time) {
        errors.push("Debe ingresar la hora de inicio.");
    }

    if (!payload.end_time) {
        errors.push("Debe ingresar la hora de término.");
    }

    if (payload.start_time && payload.end_time && !validateTimeRange(payload.start_time, payload.end_time)) {
        errors.push("La hora de inicio debe ser menor que la hora de término.");
    }

    return errors;
}

function validateUpdateClassSchedule(payload) {
    const errors = [];

    if (payload.sport_room_id !== undefined && Number(payload.sport_room_id) < 1) {
        errors.push("Debe seleccionar una asignación deporte-sala válida.");
    }

    if (
        payload.day_of_week !== undefined &&
        (Number(payload.day_of_week) < 1 || Number(payload.day_of_week) > 7)
    ) {
        errors.push("El día de la semana debe estar entre 1 y 7.");
    }

    if (
        payload.start_time !== undefined &&
        payload.end_time !== undefined &&
        !validateTimeRange(payload.start_time, payload.end_time)
    ) {
        errors.push("La hora de inicio debe ser menor que la hora de término.");
    }

    return errors;
}

module.exports = {
    validateCreateClassSchedule,
    validateUpdateClassSchedule
};
