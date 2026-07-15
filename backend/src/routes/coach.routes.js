const express = require("express");
const coachController = require("../controllers/coach.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/my-classes", authenticate, coachController.myClasses);
router.get("/my-schedules", authenticate, coachController.mySchedules);
router.get("/my-rooms", authenticate, coachController.myRooms);
router.get("/dashboard", authenticate, coachController.dashboard);

module.exports = router;