function validateSportPayload(payload, options = {}) {
    const errors = {};
    const data = {};
    const isPartial = options.partial === true;

    if (!isPartial || payload.name !== undefined) {
        const name = String(payload.name || '').trim();

        if (!name || name.length < 3) {
            errors.name = 'El nombre del deporte es obligatorio y debe tener al menos 3 caracteres.';
        } else if (name.length > 100) {
            errors.name = 'El nombre del deporte no puede superar los 100 caracteres.';
        } else {
            data.name = name;
        }
    }

    if (!isPartial || payload.objective !== undefined) {
        const objective = String(payload.objective || '').trim();

        if (!objective || objective.length < 5) {
            errors.objective = 'El objetivo es obligatorio y debe tener al menos 5 caracteres.';
        } else if (objective.length > 255) {
            errors.objective = 'El objetivo no puede superar los 255 caracteres.';
        } else {
            data.objective = objective;
        }
    }

    if (!isPartial || payload.duration !== undefined) {
        const duration = Number(payload.duration);

        if (!Number.isInteger(duration) || duration < 1) {
            errors.duration = 'La duración debe ser un número entero mayor a 0.';
        } else {
            data.duration = duration;
        }
    }

    if (payload.status !== undefined) {
        if (typeof payload.status !== 'boolean') {
            errors.status = 'El estado debe ser verdadero o falso.';
        } else {
            data.status = payload.status;
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        data
    };
}

module.exports = {
    validateSportPayload
};