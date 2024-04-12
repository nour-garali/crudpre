import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Table, Typography, Avatar } from 'antd';
import axios from 'axios';

const { Text } = Typography;

const AdminPubliqueList = () => {
  const [adminPubliques, setAdminPubliques] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetch('http://127.0.0.1:5000/admins')
      .then(response => response.json())
      .then(data => setAdminPubliques(data.data));
  }, []);

  const handleDelete = (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this admin publique?');

    if (!isConfirmed) {
      return;
    }

    fetch(`http://127.0.0.1:5000/adminpublique/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        setAdminPubliques(adminPubliques.filter(adminPublique => adminPublique.id !== id));
      })
      .catch(error => console.error('Error:', error));
  };

  const handleUpdate = (adminPublique) => {
    history.push(`/adminpublique/${adminPublique.id}`, { adminPublique, profileImage: adminPublique.profile_image }); // Pass profile image URL here
  };

  const columns = [
    {
      title: 'Profile Image',
      dataIndex: 'profile_image',
      key: 'profile_image',
      render: (text, adminPublique) => (
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
      title: 'directeur',
      dataIndex: 'directeur',
      key: 'directeur',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, adminPublique) => (
        <span>
          <Button type="primary" onClick={() => handleUpdate(adminPublique)}>
            Update
          </Button>
          <Button type="danger" onClick={() => handleDelete(adminPublique.id)}>
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
      <h2>Admin Publique List</h2>
      <Table dataSource={adminPubliques} columns={columns} rowKey="id" pagination={paginationConfig} />
    </div>
  );
};

export default AdminPubliqueList;
