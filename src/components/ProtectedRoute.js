// ProtectedRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { token } = useAuth(); // Utilisation du hook useAuth pour accéder au contexte d'authentification

  return (
    <Route
      {...rest}
      render={(props) =>
        token ? ( // Vérification si l'utilisateur est authentifié en fonction de l'existence du token
          <Component {...props} />
        ) : (
          <Redirect to="/login" /> // Redirection vers la page de connexion si l'utilisateur n'est pas authentifié
        )
      }
    />
  );
}

export default ProtectedRoute;
