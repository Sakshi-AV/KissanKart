const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Vegetables',
      'Fruits',
      'Grains',
      'Pulses',
      'Spices',
      'Dairy',
      'Organic Products',
      'Seeds',
      'Other Farm Products'
    ]
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  images: [{
    type: String,
    required: true
  }],
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 1
  },
  unit: {
    type: String,
    required: [true, 'Unit is required (e.g. kg, g, dozen, liter)'],
    default: 'kg'
  },
  quantity: {
    type: Number,
    required: [true, 'Available quantity is required'],
    min: 0,
    default: 0
  },
  organic: {
    type: Boolean,
    default: true
  },
  harvestDate: {
    type: Date,
    default: Date.now
  },
  farmingMethod: {
    type: String,
    default: 'Natural Organic Farming'
  },
  location: {
    type: String,
    default: 'Local Farm'
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  this.isAvailable = this.quantity > 0;
  next();
});

module.exports = mongoose.model('Product', productSchema);
