const express = require("express");
const router = express.Router();
const controller = require("../controllers/feedback.controller");
const verifyToken = require('../middleware/auth');

router.get("/getAll", verifyToken, controller.getAll);
router.post("/save", controller.saveFeedback);

module.exports = router;
