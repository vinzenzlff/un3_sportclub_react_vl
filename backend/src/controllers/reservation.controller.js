const reservationService = require("../services/reservation.service");

function getUserId(req) {
    return req.user?.id;
}

async function index(req, res, next) {
    try {
        const data = await reservationService.getAllReservations(req.query);

        return res.json({
            ok: true,
            data
        });
    } catch (error) {
        next(error);
    }
}

async function myReservations(req, res, next) {
    try {
        const userId = getUserId(req);

        const data = await reservationService.getMyReservations(userId);

        return res.json({
            ok: true,
            data
        });
    } catch (error) {
        next(error);
    }
}

async function store(req, res, next) {
    try {
        const userId = getUserId(req);

        const reservation = await reservationService.createReservation(
            userId,
            req.body
        );

        return res.status(201).json({
            ok: true,
            message: "Reserva creada correctamente.",
            data: reservation
        });
    } catch (error) {
        next(error);
    }
}

async function cancel(req, res, next) {
    try {
        const userId = getUserId(req);

        const reservation = await reservationService.cancelReservation(
            userId,
            req.params.id
        );

        return res.json({
            ok: true,
            message: "Reserva cancelada correctamente.",
            data: reservation
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    index,
    myReservations,
    store,
    cancel
};
