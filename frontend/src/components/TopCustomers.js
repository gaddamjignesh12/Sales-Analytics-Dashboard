import React from 'react';

const TopCustomers = ({ customers }) => {
  return (
    <div>
      <h2>Top Customers</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {customers.map((c, idx) => (
          <li key={idx} style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
            {c.name} - ${c.totalSpent}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopCustomers;
