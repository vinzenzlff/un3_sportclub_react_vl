const coachRepository = require("../repositories/coach.repository");

async function getMyClasses(coachId) {
    return coachRepository.findMyClasses(coachId);
}

async function getMySchedules(coachId) {
    return coachRepository.findMySchedules(coachId);
}

async function getMyRooms(coachId) {
    const sportRooms = await coachRepository.findMyRooms(coachId);

    return sportRooms.map((item) => ({
        id: item.room.id,
        name: item.room.name,
        description: item.room.description,
        capacity: item.room.capacity,
        location: item.room.location,
        observation: item.room.observation,
        status: item.room.status,
        sport: item.sport
    }));
}

async function getDashboard(coachId) {
    const myClasses = await coachRepository.findMyClasses(coachId);
    const mySchedules = await coachRepository.findMySchedules(coachId);
    const myRooms = await coachRepository.findMyRooms(coachId);

    const nextClass = mySchedules.length > 0 ? mySchedules[0] : null;

    return {
        total_classes: myClasses.length,
        total_schedules: mySchedules.length,
        total_rooms: myRooms.length,
        next_class: nextClass
    };
}

module.exports = {
    getMyClasses,
    getMySchedules,
    getMyRooms,
    getDashboard
};
