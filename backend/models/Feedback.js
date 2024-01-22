const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: [true, 'Please add your full name'],
  },
  user_email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  user_phoneNumber: {
    type: String,
    required: [true, 'Please add a phone number'],
    // match: [
    //   /^\+(?:[0-9]●?){6,14}[0-9]$/,
    //   'Please add a valid phone number starting with a + sign',
    // ],
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
    maxlength: [500, "Message can't have more than 500 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to format and clean the phone number
FeedbackSchema.pre('save', function (next) {
  const cleanedPhoneNumber = this.user_phoneNumber.replace(/\D/g, ''); // Remove non-digit characters
  const formattedPhoneNumber = `+${cleanedPhoneNumber}`;

  // Check if the cleaned phone number exceeds 15 characters
  if (cleanedPhoneNumber.length > 15) {
    return next(
      new Error('Phone number too long. Maximum length is 15 characters.')
    );
  }

  // Update the phoneNumber field with the formatted value
  this.user_phoneNumber = formattedPhoneNumber;

  next();
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
