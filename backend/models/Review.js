const mongoose = require('mongoose');
const Destination = require('../models/Destination');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    require: [true, 'Please add a title'],
    maxlength: 100,
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment'],
    maxlength: [500, "Comment can't have more than 500 characters"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please add a rating between 1 and 5'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  destination: {
    type: mongoose.Schema.ObjectId,
    ref: 'Destination',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
});

ReviewSchema.index({ booking: 1 }, { unique: true });

ReviewSchema.statics.getAverageRating = async function (destinationId) {
  const obj = await this.aggregate([
    {
      $match: { destination: destinationId },
    },
    {
      $group: {
        _id: '$destination',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    await this.model('Destination').findByIdAndUpdate(destinationId, {
      averageRating: obj[0].averageRating,
    });
  } catch (error) {
    console.error(error);
  }
};

ReviewSchema.post('save', async function () {
  console.log('Review saved, updating average rating...');
  await this.constructor.getAverageRating(this.destination);
});

ReviewSchema.pre('findOneAndDelete', async function (next) {
  console.log('Review about to be removed, updating average rating...');
  try {
    const review = await this.model.findOne(this.getQuery());
    if (!review) {
      throw new Error('Review not found');
    }

    const destinationId = review.destination;
    const reviewRating = review.rating;

    console.log('Destination id:', destinationId);
    console.log('Review rating:', reviewRating);

    const destination = await Destination.findById(destinationId);
    if (!destination) {
      throw new Error(`Destination with ID ${destinationId} not found`);
    }

    // Update the totalRating and count
    destination.totalRating -= reviewRating;
    destination.ratingCount--;

    await destination.save();
    next();
  } catch (error) {
    console.error('Error updating average rating:', error);
    next(error);
  }
});

ReviewSchema.post('findOneAndDelete', async function (doc, next) {
  console.log('Review removed, average rating updated.');
  // After removal, you might want to recalculate the average rating
  await doc.constructor.getAverageRating(doc.destination);
  next();
});

module.exports = mongoose.model('Review', ReviewSchema);
