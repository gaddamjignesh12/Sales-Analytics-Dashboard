const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// GET /api/analytics?start=YYYY-MM-DD&end=YYYY-MM-DD
router.get('/', async (req, res) => {
  const { start, end } = req.query;
  try {
    const orders = await Order.find({
      orderDate: { $gte: new Date(start), $lte: new Date(end) }
    });

    const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

    res.json([{ reportDate: new Date().toISOString(), totalRevenue, totalOrders, avgOrderValue }]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
