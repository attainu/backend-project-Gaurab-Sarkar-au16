const User = require('./../models/userModel')

const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}

exports.getAllUsers = catchAsync (async (req, res, next) => {
  const users = await User.find()

  console.log(users)

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users: users
    }
  })
})

exports.getUser = catchAsync (async (req, res, next) => {  
  const user = await User.findById(req.params.id).select('+password')

  // const email = req.params.id
  // console.log(email)
  // const user = await User.findOne({ email }).select('+password')

  console.log(user)

  res.status(200).json({
    status: 'success',
    data: {
      user: user
    }
  })
})

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined'
  })
}
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined'
  })
}
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined'
  })
}
