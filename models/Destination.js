const mongoose = require('mongoose');
const slugify = require('slugify');

const DestinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a destination name'],
    unique: true,
    trim: true,
    maxlength: [100, "Name can't have more than 100 characters"],
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, "Description can't have more than 500 characters"],
  },
  imageURL: {
    type: String,
    required: [true, 'Please add an image URL'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  availability: {
    type: Boolean,
    required: [true, 'Please add an availability'],
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Create destination slug from the name
DestinationSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

DestinationSchema.statics.getTotalPrice = async function (bookingId) {
  const obj = await this.aggregate([
    {
      $match: { booking: bookingId },
    },
    {
      $lookup: {
        from: 'bookings',
        localField: '_id',
        foreignField: 'destination',
        as: 'bookings',
      },
    },
    {
      $unwind: '$bookings',
    },
    {
      $project: {
        totalPrice: { $multiply: ['$price', '$bookings.numberOfTravelers'] },
      },
    },
    {
      $group: {
        _id: '$_id',
        total: { $sum: '$totalPrice' },
      },
    },
  ]);

  try {
    await this.model('Destination').findByIdAndUpdate(destinationId, {
      totalPrice: obj[0].total,
    });
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

DestinationSchema.post('save', async function () {
  await this.constructor.getTotalPrice(this.booking);
});

module.exports = mongoose.model('Destination', DestinationSchema);
