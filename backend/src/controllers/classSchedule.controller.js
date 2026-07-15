const classScheduleService = require("../services/classSchedule.service");

async function index(req, res, next) {
    try {
        const schedules = await classScheduleService.getAllClassSchedules(req.query);

        return res.json({
            ok: true,
            data: schedules
        });
    } catch (error) {
        next(error);
    }
}

async function show(req, res, next) {
    try {
        const schedule = await classScheduleService.getClassScheduleById(req.params.id);

        return res.json({
            ok: true,
            data: schedule
        });
    } catch (error) {
        next(error);
    }
}

async function store(req, res, next) {
    try {
        const schedule = await classScheduleService.createClassSchedule(req.body);

        return res.status(201).json({
            ok: true,
            message: "Horario creado correctamente.",
            data: schedule
        });
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    try {
        const schedule = await classScheduleService.updateClassSchedule(
            req.params.id,
            req.body
        );

        return res.json({
            ok: true,
            message: "Horario actualizado correctamente.",
            data: schedule
        });
    } catch (error) {
        next(error);
    }
}

async function destroy(req, res, next) {
    try {
        await classScheduleService.deleteClassSchedule(req.params.id);

        return res.json({
            ok: true,
            message: "Horario eliminado correctamente."
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    index,
    show,
    store,
    update,
    destroy
};
