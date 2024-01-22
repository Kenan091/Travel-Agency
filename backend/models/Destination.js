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
