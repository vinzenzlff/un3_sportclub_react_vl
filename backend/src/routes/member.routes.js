const express = require("express");
const memberController = require("../controllers/member.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/dashboard", authenticate, memberController.dashboard);
router.get("/classes", authenticate, memberController.classes);
router.get("/classes/:id", authenticate, memberController.classDetail);
router.get("/sports", authenticate, memberController.sports);
router.get("/rooms", authenticate, memberController.rooms);

module.exports = router;
