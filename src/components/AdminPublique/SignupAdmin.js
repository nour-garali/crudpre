import React, { useState } from 'react';
import { Form, Input, Button, Avatar, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import AvatarEditor from 'react-avatar-editor';

const SignupAdmin = () => {
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState(null);
  const [editor, setEditor] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  const handleOk = () => {
    setIsVisible(false);
  };

  const handleSaveAvatar = async (values) => {
    if (editor && avatar) {
      const canvas = editor.getImageScaledToCanvas();
      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append('firstName', values.firstName);
        formData.append('lastName', values.lastName);
        formData.append('password', values.password);
        formData.append('email', values.email);
        formData.append('directeur', values.directeur);
        formData.append('file', blob, avatar.name);

        try {
          const response = await fetch('http://127.0.0.1:5000/signup_admin', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            console.log('User created successfully');
          } else {
            console.error('Failed to create user:', response.statusText);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }, 'image/jpeg');
    }
  };

  const handleAvatarClick = () => {
    setIsVisible(true);
  };

  const handleModalCancel = () => {
    setIsVisible(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#e6f7ff' }}>
      <div style={{ width: '400px', padding: '20px', border: '2px solid #ccc', borderRadius: '10px', backgroundColor: '#f9f9f9', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Sign Up</h2>
        <Form form={form} onFinish={handleSaveAvatar}>
          <Form.Item style={{ textAlign: 'center', marginBottom: '20px' }}>
            <label htmlFor="avatar-upload">
              <Avatar src={avatar ? URL.createObjectURL(avatar) : "https://www.flaticon.com/svg/vstatic/svg/6700/6700065.svg?token=exp=1648048685~hmac=7e693618df94908c52ff0e4d3cf27161"} size={100} icon={<UserOutlined />} onClick={handleAvatarClick} />
            </label>
            <input id="avatar-upload" type="file" onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
          </Form.Item>
          {/* Reste du formulaire */}
          <Form.Item name="firstName" rules={[{ required: true, message: 'Please input your first name!' }]}>
            <Input prefix={<UserOutlined />} placeholder="First Name" />
          </Form.Item>
          <Form.Item name="lastName" rules={[{ required: true, message: 'Please input your last name!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Last Name" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item name="directeur" rules={[{ required: true, message: 'Please input your director!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Director" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        {/* Fenêtre modale pour l'édition de l'avatar */}
        <Modal
          title="Choose Profile Photo"
          visible={isVisible}
          onCancel={handleModalCancel}
          footer={[
            <Button key="cancel" onClick={handleModalCancel}>Cancel</Button>,
            <Button key="ok" type="primary" onClick={handleOk}>OK</Button>,
          ]}
        >
          {avatar && (
            <AvatarEditor
              ref={(e) => setEditor(e)}
              image={avatar}
              width={200}
              height={200}
              border={50}
              borderRadius={100}
            />
          )}
        </Modal>
      </div>
    </div>
  );
};

export default SignupAdmin;
