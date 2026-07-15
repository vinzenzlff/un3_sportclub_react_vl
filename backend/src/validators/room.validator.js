function validateCreateRoom(payload) {
    const errors = [];

    if (!payload.name || payload.name.trim().length < 3) {
        errors.push("El nombre de la sala debe tener al menos 3 caracteres.");
    }

    if (!payload.description || payload.description.trim().length < 5) {
        errors.push("La descripción debe tener al menos 5 caracteres.");
    }

    if (!payload.capacity || Number(payload.capacity) < 1) {
        errors.push("La capacidad debe ser mayor a 0.");
    }

    return errors;
}

function validateUpdateRoom(payload) {
    const errors = [];

    if (payload.name !== undefined && payload.name.trim().length < 3) {
        errors.push("El nombre de la sala debe tener al menos 3 caracteres.");
    }

    if (payload.description !== undefined && payload.description.trim().length < 5) {
        errors.push("La descripción debe tener al menos 5 caracteres.");
    }

    if (payload.capacity !== undefined && Number(payload.capacity) < 1) {
        errors.push("La capacidad debe ser mayor a 0.");
    }

    return errors;
}

module.exports = {
    validateCreateRoom,
    validateUpdateRoom
};