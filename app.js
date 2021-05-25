const fs = require('fs')
const express = require('express')

const app = express()

// MIDDLEWARES
app.use(express.json())

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

// ROUTE HANDLERS
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours
    }
  })
}

const getTour = (req, res) => {
  console.log(req.params)
  const id = req.params.id * 1
  const tour = tours.find(el => el.id === id)

  if (!tour){
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    })
  }  

  res.status(200).json({
    status: 'Success',
    data: {
      tour: tour
    }
  })
}

const createTour = (req, res) => {
  
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body)

  tours.push(newTour)

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'Success',
      data: {
        tour: newTour
      }
    })
  })
}

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status:'fail',
      message: 'Invalid ID'
    })
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour..>'
    }
  })
}

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status:'fail',
      message: 'Invalid ID'
    })
  }
  res.status(204).json({
    status: 'success',
    data: null
  })
}

// ROUTES
app.get('/api/v1/tours', getAllTours)
app.get('/api/v1/tours/:id', getTour)
app.post('/api/v1/tours', createTour)
app.patch('/api/v1/tours/:id', updateTour)
app.delete('/api/v1/tours/:id', deleteTour)


// START THE SERVER
const port = 3100 
app.listen(port, () => {
  console.log("Server Started")
})