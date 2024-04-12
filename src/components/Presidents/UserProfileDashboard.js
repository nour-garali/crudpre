import React from 'react';
import { Layout } from 'antd';
import { useAuth } from '../../hooks/AuthContext'; // Importez le hook useAuth ici

const { Header, Content } = Layout;

const UserProfileDashboard = () => {
    const { authState } = useAuth(); // Obtenez l'état d'authentification à partir du contexte

    return (
        <Layout className="layout">
            <Header>
                <div className="logo" />
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <div className="site-layout-content">
                    {authState.isAuthenticated ? (
                        <h1>Bienvenue sur votre profil utilisateur</h1>
                    ) : (
                        <h1>Veuillez vous connecter pour accéder à cette page</h1>
                    )}
                </div>
            </Content>
        </Layout>
    );
};

export default UserProfileDashboard;
