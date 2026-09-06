const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmName: {
    type: String,
    required: [true, 'Farm name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  description: {
    type: String,
    default: 'Passionate natural farmer dedicated to delivering fresh, organic, chemical-free agricultural produce.'
  },
  experience: {
    type: String,
    default: '5+ Years'
  },
  farmingType: {
    type: String,
    default: 'Organic & Traditional'
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 0,
    max: 5
  },
  totalProducts: {
    type: Number,
    default: 0
  },
  bannerImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Farmer', farmerSchema);
