import React from 'react';

const ReportsHistory = ({ reports }) => {
  return (
    <div>
      <h2>Reports History</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Report Date</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Total Orders</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Total Revenue</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r, idx) => (
            <tr key={idx}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{r.reportDate}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{r.totalOrders}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>${r.totalRevenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsHistory;
