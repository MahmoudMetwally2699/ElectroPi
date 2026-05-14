const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  description: {
    en: { type: String, default: '' },
    ar: { type: String, default: '' }
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: 0
  },
  image: {
    type: String,
    default: ''
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  preparationTime: {
    type: Number,
    default: 15 // minutes
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
