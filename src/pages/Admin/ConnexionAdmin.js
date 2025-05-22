import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { API_URL } from '../../config';
import { jwtDecode } from 'jwt-decode';

const Spinner = () => (
  <div className="flex justify-center my-4">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ConnexionAdmin = () => {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [erreur, setErreur] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  console.log('🔍 API_URL utilisée :', API_URL);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsValidEmail(value.includes('@'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail) {
      setErreur('Veuillez entrer un email valide.');
      return;
    }

    setErreur('');
    setSuccess(false);
    setIsLoggingIn(true);

    try {
      console.log('📤 Envoi de la requête à :', `${API_URL}/admin/login`, { email, password });
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('📥 Statut de la réponse :', response.status, response.statusText);

      const data = await response.json();
      console.log('🔍 Réponse de /api/admin/login :', data);

      if (!response.ok) {
        setErreur(data.error || `Erreur de connexion (code ${response.status})`);
        setIsLoggingIn(false);
        return;
      }

      // Vérifier les clés possibles pour l'ID de l'admin
      const userId =
        data.user?.id_admin ??
        data.user_id ??
        data.id_admin ??
        data.user?.id ??
        data.id;
      if (!data.token) {
        setErreur('Réponse de l\'API invalide : token manquant');
        setIsLoggingIn(false);
        return;
      }
      if (!userId) {
        setErreur(
          `Réponse de l'API invalide : ID utilisateur manquant. Réponse reçue : ${JSON.stringify(data)}`
        );
        setIsLoggingIn(false);
        return;
      }

      // Décode le token pour extraire les données
      const decoded = jwtDecode(data.token);

      // Stocker le token et les informations de l'admin
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('admin_id', userId.toString());
      localStorage.setItem('adminNom', decoded.nom || data.user?.nom || '');
      localStorage.setItem('adminPrenom', decoded.prenom || data.user?.prenom || '');
      console.log('✅ Stockage dans localStorage :', {
        admin_token: data.token,
        admin_id: userId,
        adminNom: decoded.nom || data.user?.nom,
        adminPrenom: decoded.prenom || data.user?.prenom,
      });

      setSuccess(true);

      // Démarrer la transition visuelle
      setTimeout(() => {
        setIsFading(true);
      }, 1000);

      // Rediriger après la transition
      setTimeout(() => {
        const redirectTo = location.state?.from || '/Admin/DashboardAdmin';
        console.log('🔄 Redirection vers :', redirectTo);
        navigate(redirectTo, { state: location.state });
      }, 2000);
    } catch (err) {
      console.error('❌ Erreur lors de la connexion :', err.message, err);
      setErreur(`Erreur réseau : ${err.message}`);
      setIsLoggingIn(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gray-100 px-4 transition-opacity duration-700 ease-in-out ${
        isFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Connexion Administrateur</h2>

        {erreur && <p className="text-red-600 text-sm mb-4 text-center">{erreur}</p>}
        {success && (
          <p className="text-green-600 text-sm mb-4 text-center">Connexion réussie. Redirection...</p>
        )}

        {isLoggingIn && !erreur && !success ? (
          <div className="flex flex-col items-center justify-center mb-4">
            <Spinner />
            <p className="text-green-600 text-sm mt-2">Connexion en cours...</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className={`w-full border rounded-md px-3 py-2 ${
                  email && !isValidEmail ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-400`}
                value={email}
                onChange={handleEmailChange}
                required
              />
              {email && !isValidEmail && (
                <p className="text-xs text-red-600 mt-1">L'email doit contenir un @.</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block mb-1 text-sm font-medium text-gray-700">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-blue-600 hover:text-blue-800"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
              disabled={!isValidEmail || isLoggingIn}
            >
              Se connecter
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ConnexionAdmin;