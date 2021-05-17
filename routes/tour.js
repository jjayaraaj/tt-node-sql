const express = require("express");

const router = express.Router();
const tourCtrl = require("./../controllers/tour");

router.get('/', tourCtrl.getTourCtrl);
router.get('/:tourId', tourCtrl.getTourById);
router.post('/new', tourCtrl.postTour);
router.put('/update', tourCtrl.updateTour);
router.delete('/delete', tourCtrl.deleteTour);

module.exports = router;