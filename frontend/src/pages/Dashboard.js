import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import TopProducts from '../components/TopProducts';
import TopCustomers from '../components/TopCustomers';
import ReportsHistory from '../components/ReportsHistory';
import { getAnalyticsReports, fetchProducts, fetchCustomers } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import './Dashboard.css';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState({ totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 });
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [startDate, setStartDate] = useState(moment().subtract(30, 'days').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));

  const fetchData = async () => {
    setLoading(true);
    try {
      const reportRes = await getAnalyticsReports(startDate, endDate);
      setReports(reportRes.data);

      const totalRevenue = reportRes.data.reduce((a, r) => a + r.totalRevenue, 0);
      const totalOrders = reportRes.data.reduce((a, r) => a + r.totalOrders, 0);
      const avgOrderValue = totalOrders ? (totalRevenue / totalOrders).toFixed(2) : 0;
      setMetrics({ totalRevenue, totalOrders, avgOrderValue });

      const productsRes = await fetchProducts();
      setProducts(productsRes.data.slice(0, 5)); // top 5

      const customersRes = await fetchCustomers();
      setCustomers(customersRes.data.slice(0, 5)); // top 5

    } catch (err) {
      console.error(err);
      alert('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <h1>Sales Analytics Dashboard</h1>

      <div className="date-filter">
        <label>Start Date: </label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <label>End Date: </label>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        <button onClick={fetchData}>Filter</button>
      </div>

      <div className="metrics-cards">
        <Card title="Total Revenue" value={`$${metrics.totalRevenue}`} />
        <Card title="Total Orders" value={metrics.totalOrders} />
        <Card title="Avg Order Value" value={`$${metrics.avgOrderValue}`} />
      </div>

      <h2>Revenue & Orders Trend</h2>
      {loading ? <p>Loading...</p> : (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={reports} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="reportDate" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" />
            <Line type="monotone" dataKey="totalOrders" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      )}

      <div className="top-lists">
        <TopProducts products={products} />
        <TopCustomers customers={customers} />
      </div>

      <ReportsHistory reports={reports} />
    </div>
  );
};

export default Dashboard;
