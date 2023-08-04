const mongoose = require('mongoose');

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
    required: [true, 'Please add a description for destination'],
    maxlength: [350, "Description can't have more than 350 characters"],
  },
  imageURL: {
    type: String,
    required: [true, 'Please add an image URL'],
  },
  price: {
    type: Number,
    required: [true, 'Please add price for destination'],
  },
  availability: {
    type: Boolean,
    required: [true, 'Please add an availability of destination'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Destination', DestinationSchema);
