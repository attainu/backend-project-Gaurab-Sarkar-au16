const Tour = require('./../models/tourModel')
const AppError = require('./../utils/appError')
// const APIFeatures = require('./../utils/apiFeatures')

const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}

// alias work done by middleware
// limit=5&sort=-ratingAverage,price
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next()
}

exports.getAllTours = catchAsync (async (req, res, next) => {
  //BUILD QUERY
  // 1) Filtering
  const queryObj = {...req.query}
  const excludeFields = ['page', 'sort', 'limit', 'fields']
  excludeFields.forEach(el => delete queryObj[el])
  
  // 2) Advanced filtering
  let queryStr = JSON.stringify(queryObj)
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g , match => `$${match}`)
  console.log(JSON.parse(queryStr))

  let query = Tour.find(JSON.parse(queryStr))

  // 3) Sorting
  if(req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy) 
  } else {
    query = query.sort('-createdAt')
  }

  // 4) Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ')
    query = query.select(fields)
  } else {
    query = query.select('-__v')
  }

  // 5) Pagination
  const page = req.query.page * 1 || 1
  const limit = req.query.limit * 1 || 100
  const skip = (page - 1) * limit 
  
  query = query.skip(skip).limit(limit) 
  // query.skip(10).limit(10) : skip 10 reults, show maximum of 10 results

  if (req.query.page) {
    const numTours = await Tour.countDocuments()
    if(skip >= numTours) throw new Error('This page does not exists')
  }

  // EXECUTE QUERY
  const tours = await query

  //SEND RESPONCE
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,    
    results: tours.length,
    data: {
      tours: tours
    }
  })
  
})

exports.getTour = catchAsync (async (req, res, next) => {
  const tour = await Tour.findById(req.params.id)

  if(!tour) {
    return next(new AppError('No tour found with that ID', 404))
  }

  res.status(200).json({
    status: 'Success',
    data: {
      tour: tour
    }
  })  
})

exports.createTour = catchAsync (async (req, res, next) => {  
  const newTour = await Tour.create(req.body)
  
    res.status(201).json({
      status: 'Success',
      data: {
        tour: newTour
      }
    })
})

exports.updateTour = catchAsync (async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  if(!tour) {
    return next(new AppError('No tour found with that ID', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour
    }
  })  
})

exports.deleteTour = catchAsync (async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id)

  if(!tour) {
    return next(new AppError('No tour found with that ID', 404))
  }

  res.status(204).json({
    status: 'success',
    data: null
  })
})

exports.getTourStats = catchAsync (async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: 'ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1}
    }
  ])
  res.status(200).json({
    status: 'success',
    data: {
      stats: stats
    }
  })
})

exports.getMonthlyPlan = catchAsync (async (req, res, next) => {
  const year = req.params.year * 1
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ])

  res.status(200).json({
    status: 'success',
    data: {
      plan: plan
    }
  })
})
