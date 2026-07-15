const fs = require('fs');
const path = require('path');
const app = require('./app');
const env = require('./config/env');
const sequelize = require('./config/database');
require('./models');
const { seedUsers } = require('./seeders/user.seeder');
const { seedSports } = require('./seeders/sport.seeder');
const seedRooms = require("./seeders/room.seeder");
const seedSportRooms = require("./seeders/sportRoom.seeder");
const seedClassSchedules = require("./seeders/classSchedule.seeder");
const seedReservations = require("./seeders/reservation.seeder");


async function bootstrap() {
    
    try {
        if (env.db.dialect === 'sqlite') {
            fs.mkdirSync(path.dirname(env.db.storage), { recursive: true });
        }
        
        await sequelize.authenticate();
        await sequelize.sync();
        await seedUsers();
        await seedSports();
        await seedRooms();
        await seedSportRooms();
        await seedClassSchedules();
        await seedReservations();

        const HOST = env.host || '0.0.0.0';
        app.listen(env.port, HOST, () => {
            console.log(`Servidor corriendo en http://${HOST}:${env.port}`);
            console.log(`Base de datos activa con dialecto: ${env.db.dialect}`);
        });
    } catch (error) {
        console.error('No fue posible iniciar el servidor:', error);
        process.exit(1);
    }
}

bootstrap();