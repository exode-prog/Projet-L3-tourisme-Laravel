import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from '../../config';

const Spinner = () => (
  <div className="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
);

const CreationAdmin = () => {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    telephone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const isPasswordMatch = formData.password === formData.confirmPassword;
  const isValidEmail = formData.email.includes('@');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'telephone' ? (value === '' ? '' : parseInt(value) || '') : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || !isPasswordMatch || !isValidEmail) {
      setMessage('Veuillez vérifier les informations saisies.');
      return;
    }

    setMessage('');
    setLoading(true);

    try {
      const { confirmPassword, ...dataToSend } = formData;
      console.log('📤 Envoi de la requête à :', `${API_URL}/admin`, dataToSend);
      const response = await axios.post(`${API_URL}/admin`, dataToSend, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📥 Réponse de /api/admin :', response.data);

      if (response.status === 201) {
        setMessage('✅ Inscription réussie ! Redirection...');
        setTimeout(() => {
          setIsFading(true);
        }, 1000);
        setTimeout(() => {
          navigate('/admin/DashboardAdmin');
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'inscription :', error.response?.data || error.message);
      setLoading(false);
      if (error.response?.status === 400) {
        setMessage('Cet email est déjà utilisé.');
      } else {
        setMessage(error.response?.data?.message || 'Erreur lors de l\'inscription.');
      }
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gray-100 px-4 transition-opacity duration-700 ease-in-out ${
        isFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full space-y-4 text-sm"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Création d'un compte</h2>

        {message && (
          <div
            className={`flex items-center justify-center gap-2 text-center text-sm p-2 rounded ${
              message.includes('réussie') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}
          >
            {message}
            {loading && message.includes('réussie') && <Spinner />}
          </div>
        )}

        {['prenom', 'nom', 'telephone'].map((field) => (
          <div key={field}>
            <label className="block mb-1 font-medium text-gray-700 capitalize">
              {field === 'telephone' ? 'Téléphone' : field}
            </label>
            <input
              type={field === 'telephone' ? 'number' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        ))}

        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full border rounded-md px-3 py-2 focus:ring-2 ${
              formData.email && !isValidEmail ? 'border-red-500' : 'border-gray-300'
            } focus:ring-blue-400`}
            required
          />
          {formData.email && !isValidEmail && (
            <p className="text-xs text-red-600 mt-1">L'email doit contenir un @.</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Mot de passe</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-400"
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
          <label className="block mb-1 font-medium text-gray-700">Confirmer le mot de passe</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full border rounded-md px-3 py-2 focus:ring-2 ${
              formData.confirmPassword && !isPasswordMatch ? 'border-red-500' : 'border-gray-300'
            } focus:ring-blue-400`}
            required
          />
          {formData.confirmPassword && !isPasswordMatch && (
            <p className="text-xs text-red-600 mt-1">Les mots de passe ne correspondent pas.</p>
          )}
          {formData.confirmPassword && isPasswordMatch && (
            <p className="text-xs text-green-600 mt-1">Les mots de passe correspondent.</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition disabled:bg-blue-300"
          disabled={loading || !isPasswordMatch || !isValidEmail}
        >
          {loading && !message.includes('réussie') ? (
            <div className="flex items-center justify-center gap-2">
              <Spinner />
              <span>En cours...</span>
            </div>
          ) : (
            'Ajouter'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreationAdmin;