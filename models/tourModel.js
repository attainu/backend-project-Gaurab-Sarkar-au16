const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour must have name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must have less or equal then 40 characters'],
    minlength: [10, 'A tour name must have more or equal then 10 characters'],
    // validate: [validator.isAlpha, 'Tour name should have only characters']
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, difficult'
    }
  },
  ratingAverage:{ 
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above or equal to 1.0'],
    max: [5, 'Rating must be below or equal to 5.0']
  },
  ratingQuantity:{ 
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Tour must have price']
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function() {
      // this points o current document
      return val < this.price 
    },
    message: 'Discount should be less than original price'}
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'Tour must have a description']
  }, 
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'Tour must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtual: true }
})

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7
})

//DOCUMENT MIDDLEWARE: runs before save() and .create()
// this points to the current document
tourSchema.pre('save', function(next){
  this.slug = slugify(this.name, { lower: true })
  next()
});

//QUERY MIDDLEWARE
// this points to the current query
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } })

  this.start = Date.now()
  next()
})

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`)
  // console.log(docs)
  next()
})

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
  console.log(this.pipeline())
  next()
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour