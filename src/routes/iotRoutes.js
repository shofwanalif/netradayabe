const express = require("express");
const router = express.Router();
const iotController = require("../controllers/iotController");

router.post("/data", iotController.receiveData);

module.exports = router;
