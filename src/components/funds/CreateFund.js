import React, { useState } from 'react';
import axios from 'axios';

const CreateFund = ({ token }) => {
    const [amount, setAmount] = useState('');

    const handleCreateFund = () => {
        axios.post('http://localhost:5000/api/funds', { amount }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            console.log(response.data.message);
            // Actualiser la liste des fonds après la création
        })
        .catch(error => {
            console.error('Error creating fund:', error);
        });
    };

    return (
        <div>
            <h2>Create Fund</h2>
            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={handleCreateFund}>Create Fund</button>
        </div>
    );
}

export default CreateFund;
