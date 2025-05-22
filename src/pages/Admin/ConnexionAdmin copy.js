import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';   

const ConnexionAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const [success, setSuccess] = useState(false); // ✅ Pour afficher un message temporaire
  const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setSuccess(false);
  
    try {
      const res = await axios.post('http://192.168.3.11:4000/admin/login', { email, password });
  
      const { token } = res.data;
  
      // Décode le token pour extraire les données
      const decoded = jwtDecode(token);
  
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminNom', decoded.nom);
      localStorage.setItem('adminPrenom', decoded.prenom);
  
      setSuccess(true); //  Affiche message de succès
      setTimeout(() => {
        navigate('/Admin/DashboardAdmin');
      }, 2000);
    } catch (error) {
      setErreur(error.response?.data?.message || 'Erreur de connexion');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Connexion Admin</h2>

        {erreur && <p className="text-red-600 text-sm mb-4">{erreur}</p>}
        {success && <p className="text-green-600 text-sm mb-4">Connexion réussie. Redirection...</p>}

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium">Mot de passe</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default ConnexionAdmin;
