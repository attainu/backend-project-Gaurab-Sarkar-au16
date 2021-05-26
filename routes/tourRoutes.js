const express = require('express')
const tourController = require('./../controllers/tourController')

const router = express.Router()

router.param('id', tourController.checkID)

router.get('/', tourController.getAllTours)
router.get('/:id', tourController.getTour)
router.post('/', tourController.checkBody, tourController.createTour)
router.patch('/:id', tourController.updateTour)
router.delete('/:id', tourController.deleteTour)

module.exports = router