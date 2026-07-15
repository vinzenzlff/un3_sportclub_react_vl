const memberRepository = require("../repositories/member.repository");

async function getAvailableClasses(filters) {
    return memberRepository.findAvailableClasses(filters);
}

async function getClassById(id) {
    const classData = await memberRepository.findClassById(id);

    if (!classData) {
        const error = new Error("Clase no encontrada.");
        error.statusCode = 404;
        throw error;
    }

    return classData;
}

async function getAvailableSports() {
    return memberRepository.findAvailableSports();
}

async function getAvailableRooms() {
    return memberRepository.findAvailableRooms();
}

async function getDashboard() {
    const classes = await memberRepository.findAvailableClasses();
    const sports = await memberRepository.findAvailableSports();
    const rooms = await memberRepository.findAvailableRooms();

    const totalSchedules = classes.reduce((total, item) => {
        return total + (item.schedules ? item.schedules.length : 0);
    }, 0);

    return {
        available_classes: classes.length,
        available_sports: sports.length,
        available_rooms: rooms.length,
        available_schedules: totalSchedules,
        next_classes: classes.slice(0, 3)
    };
}

module.exports = {
    getAvailableClasses,
    getClassById,
    getAvailableSports,
    getAvailableRooms,
    getDashboard
};
