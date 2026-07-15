const { SportRoom, Sport, Room, User, ClassSchedule } = require("../models");

async function findAvailableClasses(filters = {}) {
    const where = { status: true };

    if (filters.sport_id !== undefined) {
        where.sport_id = filters.sport_id;
    }

    if (filters.room_id !== undefined) {
        where.room_id = filters.room_id;
    }

    return SportRoom.findAll({
        where,
        include: [
            {
                model: Sport,
                as: "sport",
                where: { status: true }
            },
            {
                model: Room,
                as: "room",
                where: { status: true }
            },
            {
                model: User,
                as: "coach",
                attributes: ["id", "email", "role"]
            },
            {
                model: ClassSchedule,
                as: "schedules",
                where: { status: true },
                required: false
            }
        ],
        order: [["created_at", "DESC"]]
    });
}

async function findClassById(id) {
    return SportRoom.findByPk(id, {
        include: [
            {
                model: Sport,
                as: "sport"
            },
            {
                model: Room,
                as: "room"
            },
            {
                model: User,
                as: "coach",
                attributes: ["id", "email", "role"]
            },
            {
                model: ClassSchedule,
                as: "schedules",
                where: { status: true },
                required: false
            }
        ]
    });
}

async function findAvailableSports() {
    return Sport.findAll({
        where: { status: true },
        order: [["created_at", "DESC"]]
    });
}

async function findAvailableRooms() {
    return Room.findAll({
        where: { status: true },
        order: [["created_at", "DESC"]]
    });
}

module.exports = {
    findAvailableClasses,
    findClassById,
    findAvailableSports,
    findAvailableRooms
};
