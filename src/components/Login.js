import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom'; // Import de Link depuis react-router-dom
import { useAuth } from '../hooks/AuthContext';
import { Button, Form, Input, Typography } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;

const Login = () => {
  const history = useHistory();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState(null);

  const onFinish = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/login', values);
      login(response.data.token);

      // Rediriger vers la page du profil après la connexion réussie
      history.push('/profile'); 

    } catch (error) {
      setLoginError(error.response ? error.response.data.message : 'Erreur inconnue');
    }
  };

  const handleSignUpLinkClick = () => {
    history.push('/signup');
  };

  return (
    <div>
      <Title level={2}>Connexion</Title>
      {loginError && <Text type="danger">{loginError}</Text>}
      <Form onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Veuillez saisir votre email' }]}
        >
          <Input type="email" />
        </Form.Item>
        <Form.Item
          label="Mot de passe"
          name="password"
          rules={[{ required: true, message: 'Veuillez saisir votre mot de passe' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Se connecter
          </Button>
        </Form.Item>
      </Form>
      <Text>
        Vous n'avez pas de compte ?{' '}
        <Link to="/signup" onClick={handleSignUpLinkClick}>
          Inscrivez-vous ici
        </Link>
      </Text>
      {/* Ajouter des liens avec des boutons */}
      <Link to="/Listfund">
        <Button>Listfund</Button>
      </Link>
      <Link to="/PresidentList">
        <Button>La liste des President</Button>
      </Link>
    </div>
  );
};

export default Login;
