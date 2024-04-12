import axios from 'axios';

const baseURL = 'http://localhost:5000/api';

const apiService = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Gestion des erreurs
apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erreur de réponse du serveur (status code n'est pas dans la plage 2xx)
      console.error('Error response from server:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.error('No response received:', error.request);
      return Promise.reject('No response received');
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      console.error('Request configuration error:', error.message);
      return Promise.reject(error.message);
    }
  }
);

const authService = {
  signup: (data) => apiService.post('/signup', data),
  login: (data) => apiService.post('/login', data),
};

export default authService;
