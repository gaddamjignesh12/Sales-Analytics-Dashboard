/**
 * utils/seed.js
 * Run: node utils/seed.js
 * It will create sample products, customers and orders spanning the last 2 years.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

const connectDB = require('../config/db');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Order = require('../models/Order');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to DB for seeding');

    // Clear previous data
    await Promise.all([Customer.deleteMany({}), Product.deleteMany({}), Order.deleteMany({})]);
    console.log('Cleared old data');

    // Regions and categories
    const regions = ['North', 'South', 'East', 'West', 'Central'];
    const categories = ['Electronics', 'Clothing', 'Home', 'Books', 'Toys'];

    // Create products
    const products = [];
    for (let i = 0; i < 40; i++) {
      const prod = new Product({
        name: faker.commerce.productName(),
        category: faker.helpers.arrayElement(categories),
        price: parseFloat(faker.commerce.price(10, 200, 2))
      });
      products.push(await prod.save());
    }
    console.log(`Created ${products.length} products`);

    // Create customers
    const customers = [];
    for (let i = 0; i < 120; i++) {
      const cust = new Customer({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        region: faker.helpers.arrayElement(regions),
        type: faker.helpers.arrayElement(['Retail', 'Wholesale'])
      });
      customers.push(await cust.save());
    }
    console.log(`Created ${customers.length} customers`);

    // Create orders over last 2 years
    const now = new Date();
    const startDate = new Date();
    startDate.setFullYear(now.getFullYear() - 2);

    const ordersToCreate = 2500; // realistic volume for aggregation testing
    const orders = [];

    for (let i = 0; i < ordersToCreate; i++) {
      // random date between startDate and now
      const orderDate = new Date(startDate.getTime() + Math.random() * (now.getTime() - startDate.getTime()));

      // random customer
      const customer = faker.helpers.arrayElement(customers);

      // pick 1-5 products
      const productCount = faker.number.int({ min: 1, max: 5 });
      const orderProducts = [];
      let totalPrice = 0;
      for (let j = 0; j < productCount; j++) {
        const prod = faker.helpers.arrayElement(products);
        const qty = faker.number.int({ min: 1, max: 10 });
        orderProducts.push({
          product: prod._id,
          quantity: qty,
          price: prod.price
        });
        totalPrice += prod.price * qty;
      }

      const order = new Order({
        customer: customer._id,
        products: orderProducts,
        totalPrice: parseFloat(totalPrice.toFixed(2)),
        region: customer.region,
        orderDate,
        status: 'Completed'
      });

      orders.push(order.save());
      if (i % 200 === 0) console.log(`Queued ${i} orders`);
    }

    await Promise.all(orders);
    console.log(`Created ${ordersToCreate} orders`);
    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
})();
