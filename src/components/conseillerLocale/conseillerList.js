import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Table, Typography, Avatar } from 'antd';
import axios from 'axios';

const { Text } = Typography;

const ConseillerList = () => {
  const [conseillers, setConseillers] = useState([]);
  const history = useHistory();

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/Conseilleur')
      .then(response => setConseillers(response.data.data))
      .catch(error => console.error('Error fetching conseillers:', error));
  }, []);

  const handleDelete = (conseillerId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this conseiller?');

    if (!isConfirmed) {
      return;
    }

    axios.delete(`http://127.0.0.1:5000/Conseilleur/${conseillerId}`)
      .then(response => {
        console.log(response.data.message);
        setConseillers(conseillers.filter(conseiller => conseiller.id !== conseillerId));
      })
      .catch(error => console.error('Error deleting conseiller:', error));
  };

  const handleUpdate = (conseiller) => {
    history.push(`/conseilleur/${conseiller.id}`, { conseiller, profileImage: conseiller.profile_image }); // Pass profile image URL here
  };

  const columns = [
    {
      title: 'Profile Image',
      dataIndex: 'profile_image',
      key: 'profile_image',
      render: (text, conseiller) => (
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
      render: (text, conseiller) => (
        <span>
          <Button type="primary" onClick={() => handleUpdate(conseiller)}>
            Update
          </Button>
          <Button type="danger" onClick={() => handleDelete(conseiller.id)}>
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
      <h2>Conseiller List</h2>
      <Table dataSource={conseillers} columns={columns} rowKey="id" pagination={paginationConfig} />
    </div>
  );
};

export default ConseillerList;
