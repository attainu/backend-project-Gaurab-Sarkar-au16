const mongoose = require('mongoose')
const dotenv = require('dotenv')

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION!! Shutting down...')
  console.log(err.name, err.message)
  process.exit(1)
})

dotenv.config({ path: './config.env'})
const app = require('./app')

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => console.log('DB connection successful'))

const port = process.env.PORT || 3200
const server = app.listen(port, () => {
  console.log("Server Started")
})

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION!! Shutting down..')
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})

