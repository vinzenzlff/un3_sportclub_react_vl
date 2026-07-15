const {
    Reservation,
    ClassSchedule,
    SportRoom,
    Sport,
    Room,
    User
} = require("../models");

async function findAll(filters = {}) {
    const where = {};

    if (filters.status !== undefined) {
        where.status = filters.status;
    }

    if (filters.user_id !== undefined) {
        where.user_id = filters.user_id;
    }

    return Reservation.findAll({
        where,
        include: [
            {
                model: User,
                as: "user",
                attributes: ["id", "email", "role"]
            },
            {
                model: ClassSchedule,
                as: "classSchedule",
                include: [
                    {
                        model: SportRoom,
                        as: "sportRoom",
                        include: [
                            { model: Sport, as: "sport" },
                            { model: Room, as: "room" },
                            {
                                model: User,
                                as: "coach",
                                attributes: ["id", "email", "role"]
                            }
                        ]
                    }
                ]
            }
        ],
        order: [["created_at", "DESC"]]
    });
}

async function findById(id) {
    return Reservation.findByPk(id, {
        include: [
            {
                model: ClassSchedule,
                as: "classSchedule",
                include: [
                    {
                        model: SportRoom,
                        as: "sportRoom",
                        include: [
                            { model: Sport, as: "sport" },
                            { model: Room, as: "room" },
                            {
                                model: User,
                                as: "coach",
                                attributes: ["id", "email", "role"]
                            }
                        ]
                    }
                ]
            }
        ]
    });
}

async function findActiveByUserAndSchedule(user_id, class_schedule_id) {
    return Reservation.findOne({
        where: {
            user_id,
            class_schedule_id,
            status: "active"
        }
    });
}

async function create(payload) {
    return Reservation.create(payload);
}

async function updateById(id, payload) {
    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
        return null;
    }

    await reservation.update(payload);

    return findById(id);
}

async function deleteById(id) {
    const deletedRows = await Reservation.destroy({
        where: { id }
    });

    return deletedRows > 0;
}

module.exports = {
    findAll,
    findById,
    findActiveByUserAndSchedule,
    create,
    updateById,
    deleteById
};
