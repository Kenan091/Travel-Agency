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
});

ReviewSchema.index({ destination: 1, user: 1 }, { unique: true });

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
  await this.constructor.getAverageRating(this.destination);
});

ReviewSchema.pre('deleteOne', async function () {
  await this.constructor.getAverageRating(this.destination);
});

module.exports = mongoose.model('Review', ReviewSchema);
