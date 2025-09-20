const Order = require('../models/Order');
const AnalyticsReport = require('../models/AnalyticsReport');

exports.generateReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    if (!startDate || !endDate) return res.status(400).json({ message: 'startDate and endDate are required' });

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const matchStage = { orderDate: { $gte: start, $lte: end } };

    // Total orders
    const totalOrders = await Order.countDocuments(matchStage);

    // Total revenue
    const revenueAgg = await Order.aggregate([
      { $match: matchStage },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueAgg[0] ? revenueAgg[0].totalRevenue : 0;
    const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

    // Top products
    const topProducts = await Order.aggregate([
      { $match: matchStage },
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.product',
          totalQuantity: { $sum: '$products.quantity' },
          revenue: { $sum: { $multiply: ['$products.quantity', '$products.price'] } }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          productId: '$_id',
          name: '$product.name',
          category: '$product.category',
          price: '$product.price',
          totalQuantity: 1,
          revenue: 1
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 }
    ]);

    // Top customers
    const topCustomers = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$customer',
          totalSpent: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'customers',
          localField: '_id',
          foreignField: '_id',
          as: 'customer'
        }
      },
      { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          customerId: '$_id',
          name: '$customer.name',
          email: '$customer.email',
          totalSpent: 1,
          orders: 1
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 }
    ]);

    // Region-wise stats
    const regionWiseStats = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$region',
          totalRevenue: { $sum: '$totalPrice' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$totalPrice' }
        }
      },
      { $project: { region: '$_id', totalRevenue: 1, totalOrders: 1, avgOrderValue: 1, _id: 0 } },
      { $sort: { totalRevenue: -1 } }
    ]);

    // Category-wise stats
    const categoryWiseStats = await Order.aggregate([
      { $match: matchStage },
      { $unwind: '$products' },
      {
        $lookup: {
          from: 'products',
          localField: 'products.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$product.category',
          totalRevenue: { $sum: { $multiply: ['$products.quantity', '$products.price'] } },
          totalQuantity: { $sum: '$products.quantity' }
        }
      },
      { $project: { category: '$_id', totalRevenue: 1, totalQuantity: 1, _id: 0 } },
      { $sort: { totalRevenue: -1 } }
    ]);

    // Save report
    const analyticsReport = new AnalyticsReport({
      startDate: start,
      endDate: end,
      totalOrders,
      totalRevenue,
      avgOrderValue,
      topProducts,
      topCustomers,
      regionWiseStats,
      categoryWiseStats
    });

    await analyticsReport.save();

    res.json(analyticsReport);
  } catch (err) {
    console.error('Error generating report:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [reports, total] = await Promise.all([
      AnalyticsReport.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      AnalyticsReport.countDocuments()
    ]);

    res.json({ data: reports, total, page, limit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const report = await AnalyticsReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
