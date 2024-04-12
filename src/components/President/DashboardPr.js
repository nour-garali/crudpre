import React from 'react';
import { useHistory } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const DashboardPr = () => {
  const history = useHistory();
  const { SubMenu } = Menu;

  const handleLogout = () => {
    // Gérer la déconnexion de l'utilisateur
    history.push('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<HomeOutlined />}>
            Accueil
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            Profil
          </Menu.Item>
          <SubMenu key="sub1" icon={<SettingOutlined />} title="Paramètres">
            <Menu.Item key="3">Paramètre 1</Menu.Item>
            <Menu.Item key="4">Paramètre 2</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            Contenu du tableau de bord
          </div>
        </Content>
      </Layout>
      <LogoutOutlined onClick={handleLogout} />
    </Layout>
  );
};

export default DashboardPr;