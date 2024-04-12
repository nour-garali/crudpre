import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Table, Typography, Avatar } from 'antd';
import axios from 'axios';

const { Text } = Typography;

const PresidentList = () => {
  const [President, setPresident] = useState([]);
  const history = useHistory();
  //noor
  useEffect(() => {
    fetch('http://127.0.0.1:5000/President')
      .then(response => response.json())
      .then(data => setPresident(data.data));
  }, []);

  const handleDelete = (PresidentId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this President?');

    if (!isConfirmed) {
      return;
    }

    fetch(`http://127.0.0.1:5000/President/${PresidentId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        setPresident(President.filter(President => President.id !== PresidentId));
      })
      .catch(error => console.error('Error:', error));
  };

  const handleUpdate = (President) => {
    history.push(`/update/${President.id}`, { President, profileImage: President.profile_image }); // Pass profile image URL here
  };

  const columns = [
    {
      title: 'Profile Image',
      dataIndex: 'profile_image',
      key: 'profile_image',
      render: (text, President) => (
        <Avatar src={`http://127.0.0.1:5000/static/uploads/${text}`} size={64} />
      ),
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, President) => (
        <span>
          <Button type="primary" onClick={() => handleUpdate(President)}>
            Update
          </Button>
          <Button type="danger" onClick={() => handleDelete(President.id)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  const paginationConfig = {
    pageSize: 2,
    showSizeChanger: false,
  };

  return (
    <div>
      <h2>President List</h2>
      <Table dataSource={President} columns={columns} rowKey="id" pagination={paginationConfig} />
    </div>
  );
};

export default PresidentList;
