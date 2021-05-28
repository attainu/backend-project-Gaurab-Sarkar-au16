const express = require('express')
const Tour = require('../models/tourModel')
const tourController = require('./../controllers/tourController')

const router = express.Router()

// router.param('id', tourController.checkID)

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours)

router.get('/', tourController.getAllTours)
router.post('/', tourController.createTour)

router.get('/:id', tourController.getTour)
router.patch('/:id', tourController.updateTour)
router.delete('/:id', tourController.deleteTour)

module.exports = router