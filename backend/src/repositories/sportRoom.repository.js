const { SportRoom, Sport, Room, User, ClassSchedule } = require("../models");

async function findAll(filters = {}) {
    const where = {};

    if (filters.status !== undefined) {
        where.status = filters.status === "true" || filters.status === true;
    }

    if (filters.sport_id !== undefined) {
        where.sport_id = filters.sport_id;
    }

    if (filters.room_id !== undefined) {
        where.room_id = filters.room_id;
    }

    if (filters.coach_id !== undefined) {
        where.coach_id = filters.coach_id;
    }

    return SportRoom.findAll({
        where,
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
                attributes: ["id", "full_name", "email", "role"]
            },
            {
                model: ClassSchedule,
                as: "schedules"
            }
        ],
        order: [["created_at", "DESC"]]
    });
}

async function findById(id) {
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
                attributes: ["id", "full_name", "email", "role"]
            },
            {
                model: ClassSchedule,
                as: "schedules"
            }
        ]
    });
}

async function findDuplicate(sport_id, room_id, coach_id) {
    return SportRoom.findOne({
        where: {
            sport_id,
            room_id,
            coach_id
        }
    });
}

async function create(payload) {
    return SportRoom.create(payload);
}

async function updateById(id, payload) {
    const sportRoom = await SportRoom.findByPk(id);

    if (!sportRoom) {
        return null;
    }

    await sportRoom.update(payload);

    return findById(id);
}

async function deleteById(id) {
    const deletedRows = await SportRoom.destroy({
        where: {
            id
        }
    });

    return deletedRows > 0;
}

module.exports = {
    findAll,
    findById,
    findDuplicate,
    create,
    updateById,
    deleteById
};