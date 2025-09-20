const mongoose = require('mongoose');

const OrderProductSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true } // price at time of order
});

const OrderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  products: [OrderProductSchema],
  totalPrice: { type: Number, required: true },
  region: { type: String, required: true },
  orderDate: { type: Date, required: true },
  status: { type: String, default: 'Completed' }
});

module.exports = mongoose.model('Order', OrderSchema);
