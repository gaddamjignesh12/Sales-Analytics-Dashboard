const mongoose = require('mongoose');

const AnalyticsReportSchema = new mongoose.Schema({
  reportDate: { type: Date, default: Date.now },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalOrders: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  avgOrderValue: { type: Number, default: 0 },
  topProducts: { type: Array, default: [] },
  topCustomers: { type: Array, default: [] },
  regionWiseStats: { type: Array, default: [] },
  categoryWiseStats: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AnalyticsReport', AnalyticsReportSchema);
