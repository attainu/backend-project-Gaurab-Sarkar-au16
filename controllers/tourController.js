const Tour = require('./../models/tourModel')

exports.getAllTours = async (req, res) => {
  try {
    //BUILD QUERY
    // Filtering
    const queryObj = {...req.query}
    const excludeFields = ['page', 'sort', 'limit', 'fields']
    excludeFields.forEach(el => delete queryObj[el])
    
    // Advanced filtering
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g , match => `$${match}`)
    console.log(JSON.parse(queryStr))

    const query = Tour.find(JSON.parse(queryStr))

    // EXECUTE QUERY
    const tours = await query

    //SEND RESPONCE
    res.status(200).json({
      status: 'success',    
      results: tours.length,
      data: {
        tours: tours
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}

exports.getTour = async (req, res) => {
  try{
    const tour = await Tour.findById(req.params.id)

    res.status(200).json({
      status: 'Success',
      data: {
        tour: tour
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}

exports.createTour = async (req, res) => {  
  try {
    const newTour = await Tour.create(req.body)
  
    res.status(201).json({
      status: 'Success',
      data: {
        tour: newTour
      }
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent'
    })
  }
}

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    res.status(200).json({
      status: 'success',
      data: {
        tour: tour
      }
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
}

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id)

    res.status(204).json({
      status: 'success',
      data: null
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }  
}