const express = require("express");

const operatorCtrl = require("./../controllers/operator");

const router = express.Router();

router.post("/", operatorCtrl.register);

router.post("/activate", operatorCtrl.activate);

module.exports = router;
