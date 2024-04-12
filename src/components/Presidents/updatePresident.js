import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import './UpdatePresident.css';
import { Form, Input, Button, Avatar, Modal } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import AvatarEditor from 'react-avatar-editor';

const UpdatePresident = () => {
  const { id } = useParams();
  const history = useHistory();
  const [President, setPresident] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profile_image: ''
  });
  const [newAvatar, setNewAvatar] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [editor, setEditor] = useState(null);
  useEffect(() => {
    const userData = history.location.state?.President;
    if (userData) {
      setPresident(userData);
    } else {
      fetch(`http://127.0.0.1:5000/President/${id}`)
        .then(response => response.json())
        .then(data => {
          setPresident({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            profile_image: data.profile_image
          });
        })
        .catch(error => console.error('Erreur :', error));
    }
  }, [id, history]);
  const handleUpdate = () => {
    const formData = new FormData();
    formData.append('firstName', President.firstName);
    formData.append('lastName', President.lastName);
    formData.append('email', President.email);
    if (newAvatar) {
      formData.append('file', newAvatar);
    }
    fetch(`http://127.0.0.1:5000/President/${id}`, {
      method: 'PUT',
      body: formData,})
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        history.push('/PresidentList');})
      .catch(error => console.error('Erreur :', error));
  };
  
  const handleChange = e => {
    setPresident({
      ...President,
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
        setPresident(prevUser => ({
          ...prevUser,
          profile_image: url}));
      }, 'image/png');
    }
  };
  
  
  return (
    <div className="update-user-container">
      <h2>Modifier l'utilisateur</h2>
      <Avatar src={previewImage || (President.profile_image ? `http://127.0.0.1:5000/static/uploads/${President.profile_image}` : '')} size={100} icon={<UserOutlined />} onClick={handleAvatarClick} />

      <br />
      <br />
      <form>
        <div className="form-group">
          <label htmlFor="firstName">Prénom :</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={President.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Nom :</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={President.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <input
            id="email"
            type="text"
            name="email"
            value={President.email}
            onChange={handleChange}
          />
        </div>
        <Button
  type="primary"
  onClick={() => handleUpdate()}
>
  Mettre à jour le President
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
};export default UpdatePresident;
