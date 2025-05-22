import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from '../../config';

const CreationTouriste = () => {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    numero: '',
    email: '',
    adresse: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const isPasswordMatch = formData.password === formData.confirmPassword;
  const isValidEmail = formData.email.includes('@');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'numero' ? parseInt(value) || '' : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordMatch || !isValidEmail) {
      setMessage('Vérifiez vos informations.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/touriste/register`, {
        prenom: formData.prenom,
        nom: formData.nom,
        numero: formData.numero,
        email: formData.email,
        adresse: formData.adresse,
        password: formData.password,
        password_confirmation: formData.confirmPassword
      });

      if (response.status === 201 || response.status === 200) {
        setMessage('✅ Creation réussie ! Redirection...');
        setLoading(true);
        setTimeout(() => {
          navigate('/Admin/DashboardAdmin');
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (errors.email) {
          setMessage('Cet email est déjà utilisé.');
        } else {
          setMessage('Erreur de validation : ' + Object.values(errors)[0][0]);
        }
      } else {
        setMessage("Erreur lors de l'inscription.");
      }
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center relative px-4"
      style={{ backgroundImage: "url('/images/bg-register.jpg')" }}
    >
      <div className="absolute inset-0 bg-blue-900 bg-opacity-60 backdrop-blur-sm"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">Création d'un compte</h2>

          {message && (
            <div
              className={`flex items-center justify-center gap-2 text-center text-sm mb-3 ${
                message.includes('réussie') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {message}
              {loading && (
                <svg className="animate-spin h-4 w-4 text-green-600" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                  ></path>
                </svg>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-sm">
            {['prenom', 'nom', 'numero'].map((field) => (
              <div key={field}>
                <label className="block font-medium text-gray-700 capitalize">{field}</label>
                <input
                  type={field === 'numero' ? 'number' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            ))}

            <div>
              <label className="block font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full mt-1 p-2 border rounded-md focus:ring-2 ${
                  formData.email && !isValidEmail
                    ? 'border-red-500 ring-red-300'
                    : 'focus:ring-blue-400'
                }`}
                required
              />
              {formData.email && !isValidEmail && (
                <p className="text-xs text-red-600 mt-1">L'email doit contenir un @.</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-gray-700">Adresse</label>
              <input
                type="text"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 pr-10 border rounded-md focus:ring-2 focus:ring-blue-400"
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

            <div>
              <label className="block font-medium text-gray-700">Confirmer le mot de passe</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full mt-1 p-2 border rounded-md focus:ring-2 ${
                  formData.confirmPassword && !isPasswordMatch
                    ? 'border-red-500 ring-red-300'
                    : 'focus:ring-blue-400'
                }`}
                required
              />
              {!isPasswordMatch && formData.confirmPassword && (
                <p className="text-xs text-red-600 mt-1">Les mots de passe ne correspondent pas.</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 mt-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
              disabled={!isPasswordMatch || !isValidEmail}
            >
              Ajouter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreationTouriste;