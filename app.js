const express = require('express')
const morgan = require('morgan')

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

// MIDDLEWARES
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
  console.log('middleware working')
  next()
})

// ROUTES
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// START THE SERVER
module.exports = app