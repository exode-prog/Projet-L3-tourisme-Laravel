import axios from 'axios';
import { API_URL } from '../config';

/*const getVisitesByType = async (type) => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    //const response = await axios.get(`${API_URL}/visites/${type}`, { headers });
   // const response = await axios.get(`http://192.168.2.35:8000/api/visites/${type}`, { headers });
    const response = await axios.get(`${API_URL}/visites/${type}`, { headers });
    return response.data;
  } catch (err) {
    throw err.response?.data?.error || `Erreur lors du chargement des ${type}s`;
  }
};*/
const getVisitesByType = async (type) => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    console.log(`Envoi de la requête à : ${API_URL}/visites/${type}`, { headers });
    const response = await axios.get(`${API_URL}/visites/${type}`, { headers });
    console.log(`Réponse de /visites/${type} :`, response.data);
    return response.data;
  } catch (err) {
    console.error(`Erreur pour ${type} :`, err.response?.status, err.response?.data);
    throw err.response?.data?.error || `Erreur lors du chargement des ${type}s`;
  }
};

export { getVisitesByType };