// Dashboard.js
import React from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  const history = useHistory();

  const handleLogin = () => {
    history.push('/login');
  };

  const handleManageInstances = () => {
    // Rediriger vers la gestion des instances
  };

  const handleManageProfiles = () => {
    // Rediriger vers la gestion des profils
  };

  const handleEvaluationPrograms = () => {
    // Rediriger vers la gestion des programmes d'évaluation
  };

  const handleInformationRequests = () => {
    // Rediriger vers la gestion des demandes d'accès à l'information
  };

  const handleMeetingMinutes = () => {
    // Rediriger vers la gestion des PVs de réunions
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="dark" style={{ background: '#001529', color: '#fff' }}>
        <div style={{ textAlign: 'center', fontSize: '1.5em', color: '#fff', padding: '20px 0' }}>Nom de l'Application</div>
        <Menu mode="vertical" theme="dark" defaultSelectedKeys={['1']} style={{ background: '#001529', color: '#fff' }}>
          <Menu.Item key="1" icon={<DashboardOutlined />} onClick={handleManageInstances} style={{ color: '#fff' }}>Gestion des Instances</Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />} onClick={handleManageProfiles} style={{ color: '#fff' }}>Gestion des Profils</Menu.Item>
          <Menu.Item key="3" icon={<VideoCameraOutlined />} onClick={handleEvaluationPrograms} style={{ color: '#fff' }}>Programmes d'Évaluation</Menu.Item>
          <Menu.Item key="4" icon={<UploadOutlined />} onClick={handleInformationRequests} style={{ color: '#fff' }}>Demandes d'Accès à l'Information</Menu.Item>
          <Menu.Item key="5" icon={<UploadOutlined />} onClick={handleMeetingMinutes} style={{ color: '#fff' }}>PVs de Réunions</Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 16px', display: 'flex', alignItems: 'center', boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)' }}>
          <div style={{ flex: '1' }}></div>
          <Button type="primary" onClick={handleLogin}>
            Connexion
          </Button>
        </Header>
        <Content style={{ margin: '16px', background: '#fff', minHeight: '360px', borderRadius: '5px', boxShadow: '0 2px 8px rgba(0, 21, 41, 0.08)' }}>
          {/* Contenu du tableau de bord */}
          {/* Ajoutez ici les composants et le contenu de votre tableau de bord */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
