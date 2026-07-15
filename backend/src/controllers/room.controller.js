const roomService = require("../services/room.service");

async function index(req, res, next) {
    try {
        const rooms = await roomService.getAllRooms(req.query);

        return res.json({
            ok: true,
            data: rooms
        });
    } catch (error) {
        next(error);
    }
}

async function show(req, res, next) {
    try {
        const room = await roomService.getRoomById(req.params.id);

        return res.json({
            ok: true,
            data: room
        });
    } catch (error) {
        next(error);
    }
}

async function store(req, res, next) {
    try {
        const room = await roomService.createRoom(req.body);

        return res.status(201).json({
            ok: true,
            message: "Sala creada correctamente.",
            data: room
        });
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    try {
        const room = await roomService.updateRoom(req.params.id, req.body);

        return res.json({
            ok: true,
            message: "Sala actualizada correctamente.",
            data: room
        });
    } catch (error) {
        next(error);
    }
}

async function destroy(req, res, next) {
    try {
        await roomService.deleteRoom(req.params.id);

        return res.json({
            ok: true,
            message: "Sala eliminada correctamente."
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