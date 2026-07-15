function validateCreateReservation(payload) {
    const errors = [];

    if (!payload.class_schedule_id || Number(payload.class_schedule_id) < 1) {
        errors.push("Debe seleccionar un horario de clase válido.");
    }

    if (payload.observation !== undefined && payload.observation.length > 255) {
        errors.push("La observación no puede superar los 255 caracteres.");
    }

    return errors;
}

module.exports = {
    validateCreateReservation
};
