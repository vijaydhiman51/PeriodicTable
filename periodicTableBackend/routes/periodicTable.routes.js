const express = require("express");
const router = express.Router();
const tableController = require("../controllers/periodicTable.controller");

router.get("/getAll", tableController.getAll);
router.get("/getBySymbol/:symbol", tableController.getBySymbol);
router.get("/search", tableController.search);

module.exports = router;
