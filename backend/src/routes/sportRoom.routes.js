const express = require("express");
const sportRoomController = require("../controllers/sportRoom.controller");

const router = express.Router();

router.get("/", sportRoomController.index);
router.get("/:id", sportRoomController.show);
router.post("/", sportRoomController.store);
router.put("/:id", sportRoomController.update);
router.delete("/:id", sportRoomController.destroy);

module.exports = router;
