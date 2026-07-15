const sportRoomService = require("../services/sportRoom.service");

async function index(req, res, next) {
    try {
        const sportRooms = await sportRoomService.getAllSportRooms(req.query);

        return res.json({
            ok: true,
            data: sportRooms
        });
    } catch (error) {
        next(error);
    }
}

async function show(req, res, next) {
    try {
        const sportRoom = await sportRoomService.getSportRoomById(req.params.id);

        return res.json({
            ok: true,
            data: sportRoom
        });
    } catch (error) {
        next(error);
    }
}

async function store(req, res, next) {
    try {
        const sportRoom = await sportRoomService.createSportRoom(req.body);

        return res.status(201).json({
            ok: true,
            message: "Asignación creada correctamente.",
            data: sportRoom
        });
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    try {
        const sportRoom = await sportRoomService.updateSportRoom(
            req.params.id,
            req.body
        );

        return res.json({
            ok: true,
            message: "Asignación actualizada correctamente.",
            data: sportRoom
        });
    } catch (error) {
        next(error);
    }
}

async function destroy(req, res, next) {
    try {
        await sportRoomService.deleteSportRoom(req.params.id);

        return res.json({
            ok: true,
            message: "Asignación eliminada correctamente."
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
