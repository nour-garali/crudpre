// FundsList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FundsList = ({ token }) => {
  const [funds, setFunds] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const response = await axios.get('http://localhost:5000/funds', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setFunds(response.data.data);
      } catch (error) {
        console.error('Error fetching funds:', error);
        if (error.response && error.response.status === 401) {
          setError('Unauthorized. Please log in again.');
          // Optionally, you can handle the 401 response here (e.g., redirect to login)
        } else {
          setError('Error fetching funds. Please try again later.');
        }
      }
    };

    fetchFunds();
  }, [token]);

  const handleDeleteFund = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/funds/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // After deleting, refresh the funds list
      const response = await axios.get('http://localhost:5000/funds', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFunds(response.data.data);
    } catch (error) {
      console.error('Error deleting fund:', error);
      setError('Error deleting fund. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Funds List</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {funds.map((fund) => (
          <li key={fund.id}>
            Amount: {fund.amount}{' '}
            <button onClick={() => handleDeleteFund(fund.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FundsList;
