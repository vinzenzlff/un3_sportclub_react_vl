const { Reservation, User, ClassSchedule } = require("../models");

async function seedReservations() {
    const count = await Reservation.count();

    if (count > 0) {
        return;
    }

    const user = await User.findOne({
        where: {
            role: "user"
        }
    });

    const schedule = await ClassSchedule.findOne({
        where: {
            status: true
        }
    });

    if (!user || !schedule) {
        console.log("No se crearon reservas: faltan usuarios o horarios.");
        return;
    }

    await Reservation.create({
        user_id: user.id,
        class_schedule_id: schedule.id,
        status: "active",
        observation: "Reserva generada como dato inicial."
    });

    console.log("Reservations seeded successfully.");
}

module.exports = seedReservations;
