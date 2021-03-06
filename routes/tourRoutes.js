const express = require('express')
const Tour = require('../models/tourModel')
const tourController = require('./../controllers/tourController')
const authController = require('./../controllers/authController')

const router = express.Router()

// router.param('id', tourController.checkID)

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours)

router.route('/tour-stats').get(tourController.getTourStats)
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan)

router.get('/', authController.protect, tourController.getAllTours)
router.post('/', tourController.createTour)

router.get('/:id', tourController.getTour)
router.patch('/:id', tourController.updateTour)
router.delete('/:id', authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour)

module.exports = router