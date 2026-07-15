const { Room } = require("../models");

async function seedRooms() {
    const count = await Room.count();

    if (count > 0) {
        return;
    }

    await Room.bulkCreate([
        {
            name: "Cancha Fútbol 1",
            description: "Cancha sintética para fútbol 7.",
            capacity: 14,
            location: "Sector Norte",
            image_url: null,
            observation: "Disponible para clases y reservas.",
            status: true
        },
        {
            name: "Cancha Fútbol 2",
            description: "Cancha sintética para fútbol 7.",
            capacity: 14,
            location: "Sector Sur",
            image_url: null,
            observation: "Disponible para entrenamientos.",
            status: true
        },
        {
            name: "Sala Yoga",
            description: "Sala cerrada para clases de yoga y relajación.",
            capacity: 20,
            location: "Segundo piso",
            image_url: null,
            observation: "Requiere limpieza después de cada clase.",
            status: true
        },
        {
            name: "Sala Spinning",
            description: "Sala equipada con bicicletas estáticas.",
            capacity: 25,
            location: "Primer piso",
            image_url: null,
            observation: "Uso exclusivo con coach asignado.",
            status: true
        },
        {
            name: "Piscina Temperada",
            description: "Piscina para clases de natación y entrenamiento.",
            capacity: 30,
            location: "Zona acuática",
            image_url: null,
            observation: "Requiere supervisión obligatoria.",
            status: true
        }
    ]);
}

module.exports = seedRooms;