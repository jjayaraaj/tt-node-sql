const express = require("express");
const authCtrl = require("./../controllers/auth");

const router = express.Router();

router.post("/operator", authCtrl.operatorLoginCtrl);

module.exports = router;