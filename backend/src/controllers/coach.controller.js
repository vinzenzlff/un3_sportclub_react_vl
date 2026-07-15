const coachService = require("../services/coach.service");

function getCoachId(req) {
    return req.user?.id;
}

async function myClasses(req, res, next) {
    try {
        const coachId = getCoachId(req);

        if (!coachId) {
            return res.status(401).json({
                ok: false,
                message: "No autorizado. Debe iniciar sesión como coach."
            });
        }

        const data = await coachService.getMyClasses(coachId);

        return res.json({
            ok: true,
            data
        });
    } catch (error) {
        next(error);
    }
}

async function mySchedules(req, res, next) {
    try {
        const coachId = getCoachId(req);

        if (!coachId) {
            return res.status(401).json({
                ok: false,
                message: "No autorizado. Debe iniciar sesión como coach."
            });
        }

        const data = await coachService.getMySchedules(coachId);

        return res.json({
            ok: true,
            data
        });
    } catch (error) {
        next(error);
    }
}

async function myRooms(req, res, next) {
    try {
        const coachId = getCoachId(req);

        if (!coachId) {
            return res.status(401).json({
                ok: false,
                message: "No autorizado. Debe iniciar sesión como coach."
            });
        }

        const data = await coachService.getMyRooms(coachId);

        return res.json({
            ok: true,
            data
        });
    } catch (error) {
        next(error);
    }
}

async function dashboard(req, res, next) {
    try {
        const coachId = getCoachId(req);

        if (!coachId) {
            return res.status(401).json({
                ok: false,
                message: "No autorizado. Debe iniciar sesión como coach."
            });
        }

        const data = await coachService.getDashboard(coachId);

        return res.json({
            ok: true,
            data
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    myClasses,
    mySchedules,
    myRooms,
    dashboard
};
