const { SportRoom, Sport, Room, User, ClassSchedule } = require("../models");

async function findMyClasses(coachId) {
    return SportRoom.findAll({
        where: {
            coach_id: coachId,
            status: true
        },
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
                where: {
                    status: true
                },
                required: false,
                order: [
                    ["day_of_week", "ASC"],
                    ["start_time", "ASC"]
                ]
            }
        ],
        order: [["created_at", "DESC"]]
    });
}

async function findMySchedules(coachId) {
    return ClassSchedule.findAll({
        where: {
            status: true
        },
        include: [
            {
                model: SportRoom,
                as: "sportRoom",
                where: {
                    coach_id: coachId,
                    status: true
                },
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

async function findMyRooms(coachId) {
    return SportRoom.findAll({
        where: {
            coach_id: coachId,
            status: true
        },
        include: [
            {
                model: Room,
                as: "room"
            },
            {
                model: Sport,
                as: "sport"
            }
        ],
        order: [["created_at", "DESC"]]
    });
}

module.exports = {
    findMyClasses,
    findMySchedules,
    findMyRooms
};
