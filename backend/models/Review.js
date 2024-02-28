const mongoose = require('mongoose');

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

// Pre-remove hook
ReviewSchema.pre('remove', async function (next) {
  console.log('Review about to be removed, updating average rating...');
  try {
    // Update average rating by removing the rating of this review
    const destinationId = this.destination;
    const reviewRating = this.rating;

    const destination = await this.model('Destination').findById(destinationId);
    if (!destination) {
      throw new Error(`Destination with ID ${destinationId} not found`);
    }

    // Update the totalRating and count
    destination.totalRating -= reviewRating;
    destination.ratingCount--;

    await destination.save();
    next();
  } catch (error) {
    next(error);
  }
});

// Post-remove hook
ReviewSchema.post('remove', async function () {
  console.log('Review removed, average rating updated.');
  // After removal, you might want to recalculate the average rating
  await this.constructor.getAverageRating(this.destination);
});

module.exports = mongoose.model('Review', ReviewSchema);
