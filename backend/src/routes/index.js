const { Router } = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const sportRoutes = require('./sport.routes');
const roomRoutes = require("./room.routes");
const sportRoomRoutes = require("./sportRoom.routes");
const classScheduleRoutes = require("./classSchedule.routes");
const coachRoutes = require("./coach.routes");
const memberRoutes = require("./member.routes");
const reservationRoutes = require("./reservation.routes");

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/sports', sportRoutes);
router.use("/rooms", roomRoutes);
router.use("/sport-rooms", sportRoomRoutes);
router.use("/class-schedules", classScheduleRoutes);
router.use("/coach", coachRoutes);
router.use("/member", memberRoutes);
router.use("/reservations", reservationRoutes);

module.exports = router;
