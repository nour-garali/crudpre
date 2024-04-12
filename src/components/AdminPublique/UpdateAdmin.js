import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import './UpdateAdmin.css';
import { Form, Input, Button, Avatar, Modal } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import AvatarEditor from 'react-avatar-editor';

const UpdateAdmin = () => {
  const { id } = useParams();
  const history = useHistory();
  const [admin, setAdmin] = useState({
    firstName: '',
    lastName: '',
    email: '',
    directeur: '',
    profile_image: ''
  });
  const [newAvatar, setNewAvatar] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [editor, setEditor] = useState(null);
  useEffect(() => {
    const adminData = history.location.state?.admin;
    if (adminData) {
      setAdmin(adminData);
    } else {
      fetch(`http://127.0.0.1:5000/adminpublique/${id}`)
        .then(response => response.json())
        .then(data => {
          setAdmin({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            directeur: data.directeur,
            profile_image: data.profile_image
          });
        })
        .catch(error => console.error('Erreur :', error));
    }
  }, [id, history]);
  const handleUpdate = () => {
    const formData = new FormData();
    formData.append('firstName', admin.firstName);
    formData.append('lastName', admin.lastName);
    formData.append('email', admin.email);
    formData.append('directeur', admin.directeur);
    if (newAvatar) {
      formData.append('file', newAvatar);
    }
    fetch(`http://127.0.0.1:5000/adminpublique/${id}`, {
      method: 'PUT',
      body: formData,})
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        history.push('/admins');})
      .catch(error => console.error('Erreur :', error));
  };
  
  const handleChange = e => {
    setAdmin({
      ...admin,
      [e.target.name]: e.target.value,
    });
  };
  const handleAvatarClick = () => {
    setIsModalVisible(true);
  };
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setNewAvatar(file);
    setIsModalVisible(true);
    setPreviewImage(URL.createObjectURL(file));
  };
  const handleModalOk = () => {
    setIsModalVisible(false);
    if (editor && newAvatar) {
      const canvas = editor.getImage();
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        setPreviewImage(url);
        setAdmin(prevAdmin => ({
          ...prevAdmin,
          profile_image: url}));
      }, 'image/png');
    }
  };
  
  return (
    <div className="update-admin-container">
      <h2>Modifier l'administrateur</h2>
      <Avatar src={previewImage || (admin.profile_image ? `http://127.0.0.1:5000/static/uploads/${admin.profile_image}` : '')} size={100} icon={<UserOutlined />} onClick={handleAvatarClick} />

      <br />
      <br />
      <form>
        <div className="form-group">
          <label htmlFor="firstName">Prénom :</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={admin.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Nom :</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={admin.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <input
            id="email"
            type="text"
            name="email"
            value={admin.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="directeur">Directeur :</label>
          <input
            id="directeur"
            type="text"
            name="directeur"
            value={admin.directeur}
            onChange={handleChange}
          />
        </div>
        <Button
  type="primary"
  onClick={() => handleUpdate()}>
  Mettre à jour l'administrateur
</Button>
      </form>
      <Modal
        title="Choisir une nouvelle photo de profil"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        {newAvatar && (
          <AvatarEditor
            ref={setEditor}
            image={previewImage}
            width={200}
            height={200}
            border={50}
            borderRadius={100}
            color={[255, 255, 255, 0.6]}
            scale={1}
            rotate={0}
          />
        )}
        <input type="file" onChange={handleAvatarChange} accept="image/*" />
      </Modal>
    </div>
  );
};

export default UpdateAdmin;
