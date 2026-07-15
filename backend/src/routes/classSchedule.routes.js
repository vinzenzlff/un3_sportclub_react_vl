const express = require("express");
const classScheduleController = require("../controllers/classSchedule.controller");

const router = express.Router();

router.get("/", classScheduleController.index);
router.get("/:id", classScheduleController.show);
router.post("/", classScheduleController.store);
router.put("/:id", classScheduleController.update);
router.delete("/:id", classScheduleController.destroy);

module.exports = router;
