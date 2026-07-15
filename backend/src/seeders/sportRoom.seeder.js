const { SportRoom, Sport, Room, User } = require("../models");

async function seedSportRooms() {
    const count = await SportRoom.count();

    if (count > 0) {
        return;
    }

    const football = await Sport.findOne({ where: { name: "Fútbol" } });
    const yoga = await Sport.findOne({ where: { name: "Yoga" } });
    const spinning = await Sport.findOne({ where: { name: "Spinning" } });
    const swimming = await Sport.findOne({ where: { name: "Natación" } });

    const footballRoom = await Room.findOne({ where: { name: "Cancha Fútbol 1" } });
    const yogaRoom = await Room.findOne({ where: { name: "Sala Yoga" } });
    const spinningRoom = await Room.findOne({ where: { name: "Sala Spinning" } });
    const swimmingRoom = await Room.findOne({ where: { name: "Piscina Temperada" } });

    const coaches = await User.findAll({
        where: {
            role: "coach"
        },
        limit: 4
    });

    if (coaches.length === 0) {
        console.log("No se crearon asignaciones deporte-sala: no existen usuarios coach.");
        return;
    }

    const records = [];

    if (football && footballRoom && coaches[0]) {
        records.push({
            sport_id: football.id,
            room_id: footballRoom.id,
            coach_id: coaches[0].id,
            observation: "Clase principal de fútbol.",
            status: true
        });
    }

    if (yoga && yogaRoom && coaches[1]) {
        records.push({
            sport_id: yoga.id,
            room_id: yogaRoom.id,
            coach_id: coaches[1].id,
            observation: "Clase grupal de yoga.",
            status: true
        });
    }

    if (spinning && spinningRoom && coaches[2]) {
        records.push({
            sport_id: spinning.id,
            room_id: spinningRoom.id,
            coach_id: coaches[2].id,
            observation: "Clase de alta intensidad.",
            status: true
        });
    }

    if (swimming && swimmingRoom && coaches[3]) {
        records.push({
            sport_id: swimming.id,
            room_id: swimmingRoom.id,
            coach_id: coaches[3].id,
            observation: "Clase de natación supervisada.",
            status: true
        });
    }

    if (records.length === 0) {
        console.log("No se crearon asignaciones deporte-sala: faltan deportes, salas o coaches.");
        return;
    }

    await SportRoom.bulkCreate(records);

    console.log("SportRooms seeded successfully.");
}

module.exports = seedSportRooms;
