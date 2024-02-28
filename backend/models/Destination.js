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
  continents: {
    type: [String],
    required: [
      true,
      'Please add one or more continents where tne destination is located',
    ],
  },
  slug: String,
  briefDescription: {
    type: String,
    required: [true, 'Please add a brief description'],
    maxlength: [350, "Brief description can't have more than 350 characters"],
  },
  detailedDescription: {
    type: String,
    required: [true, 'Please add a detailed description'],
    maxlength: [
      2000,
      "Detailed description can't have more than 2000 characters",
    ],
  },
  imageURL: {
    type: String,
    required: [true, 'Please add an image URL'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
  },
  isPopular: Boolean,
  reservations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create destination slug from the name
DestinationSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model('Destination', DestinationSchema);
