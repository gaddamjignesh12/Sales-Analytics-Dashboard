const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST /api/reports/generate
router.post('/generate', async (req, res) => {
  const { startDate, endDate } = req.body;
  try {
    // Simple aggregation example
    const orders = await Order.find({
      orderDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    res.json({ totalOrders, totalRevenue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
