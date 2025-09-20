const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  region: { type: String, required: true },
  type: { type: String, enum: ['Retail', 'Wholesale'], default: 'Retail' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', CustomerSchema);
