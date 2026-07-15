const { ClassSchedule, SportRoom, Sport, Room, User } = require("../models");

async function findAll(filters = {}) {
    const where = {};

    if (filters.status !== undefined) {
        where.status = filters.status === "true" || filters.status === true;
    }

    if (filters.sport_room_id !== undefined) {
        where.sport_room_id = filters.sport_room_id;
    }

    if (filters.day_of_week !== undefined) {
        where.day_of_week = filters.day_of_week;
    }

    return ClassSchedule.findAll({
        where,
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
                        attributes: ["id", "full_name", "email", "role"]
                    }
                ]
            }
        ],
        order: [
            ["day_of_week", "ASC"],
            ["start_time", "ASC"]
        ]
    });
}

async function findById(id) {
    return ClassSchedule.findByPk(id, {
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
                        attributes: ["id", "full_name", "email", "role"]
                    }
                ]
            }
        ]
    });
}

async function findDuplicate(sport_room_id, day_of_week, start_time, end_time) {
    return ClassSchedule.findOne({
        where: {
            sport_room_id,
            day_of_week,
            start_time,
            end_time
        }
    });
}

async function create(payload) {
    return ClassSchedule.create(payload);
}

async function updateById(id, payload) {
    const schedule = await ClassSchedule.findByPk(id);

    if (!schedule) {
        return null;
    }

    await schedule.update(payload);

    return findById(id);
}

async function deleteById(id) {
    const deletedRows = await ClassSchedule.destroy({
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
