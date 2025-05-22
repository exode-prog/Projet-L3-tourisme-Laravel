import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';

const Spinner = () => (
  <div className="flex justify-center my-4">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsValidEmail(value.includes('@'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail) return;

    try {
      const response = await fetch(`${API_URL}/touriste/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erreur de connexion');
        return;
      }

      localStorage.setItem('token', data.token);
      setIsLoggingIn(true);

      // Démarrer la transition visuelle
      setTimeout(() => {
        setIsFading(true);
      }, 1000);

      // Rediriger après la transition
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la tentative de connexion');
    }
  };

  return (
    <div
      className={`min-h-screen bg-cover bg-center relative px-4 transition-opacity duration-700 ease-in-out ${isFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
      style={{ backgroundImage: "url('/images/bg-login.jpg')" }}
    >
      <div className="absolute inset-0 bg-blue-900 bg-opacity-60 backdrop-blur-sm"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-md sm:max-w-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-blue-700 mb-6">Connexion</h2>

          {error && <p className="text-red-600 text-sm text-center mb-2">{error}</p>}

          {isLoggingIn ? (
            <div className="flex flex-col items-center justify-center mb-4">
              <Spinner />
              <p className="text-green-600 text-sm mt-2">Connexion réussie ! Redirection...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className={`w-full mt-1 p-2 border rounded-md focus:ring-2 ${
                    email && !isValidEmail ? 'border-red-500 ring-red-300' : 'focus:ring-blue-400'
                  }`}
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
                {email && !isValidEmail && (
                  <p className="text-xs text-red-600 mt-1">L'email doit contenir un @.</p>
                )}
              </div>

              <div>
                <label className="block font-medium text-gray-700">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full mt-1 p-2 pr-10 border rounded-md focus:ring-2 focus:ring-blue-400"
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
                className="w-full py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
                disabled={!isValidEmail}
              >
                Se connecter
              </button>
            </form>
          )}

          <p className="text-xs text-gray-600 text-center mt-3">
            Pas encore de compte ?{' '}
            <a href="./Inscription" className="text-blue-600 font-medium hover:underline">
              Inscrivez-vous
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;