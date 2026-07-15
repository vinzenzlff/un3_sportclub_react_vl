const memberService = require("../services/member.service");

async function dashboard(req, res, next) {
    try {
        const data = await memberService.getDashboard();

        return res.json({
            ok: true,
            data
        });
    } catch (error) {
        next(error);
    }
}

async function classes(req, res, next) {
    try {
        const data = await memberService.getAvailableClasses(req.query);

        return res.json({
            ok: true,
            data
        });
    } catch (error) {
        next(error);
    }
}

async function classDetail(req, res, next) {
    try {
        const data = await memberService.getClassById(req.params.id);

        return res.json({
            ok: true,
            data
        });
    } catch (error) {
        next(error);
    }
}

async function sports(req, res, next) {
    try {
        const data = await memberService.getAvailableSports();

        return res.json({
            ok: true,
            data
        });
    } catch (error) {
        next(error);
    }
}

async function rooms(req, res, next) {
    try {
        const data = await memberService.getAvailableRooms();

        return res.json({
            ok: true,
            data
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    dashboard,
    classes,
    classDetail,
    sports,
    rooms
};

