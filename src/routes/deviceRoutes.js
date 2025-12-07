const express = require("express");
const router = express.Router();
const deviceController = require("../controllers/deviceController");

router.get("/", deviceController.getAllDevices);
router.get("/history", deviceController.getAlertHistory);
router.put("/:id", deviceController.updateDevice);

module.exports = router;
