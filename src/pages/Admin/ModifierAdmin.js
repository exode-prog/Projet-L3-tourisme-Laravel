import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';

const Spinner = () => (
  <div className="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
);

const ModifierAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [admin, setAdmin] = useState({
    prenom: '',
    nom: '',
    telephone: '',
    email: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          setMessage('Vous devez être connecté en tant qu\'administrateur.');
          setLoading(false);
          return;
        }

        console.log('📤 Récupération de l\'admin à :', `${API_URL}/admin/${id}`);
        const res = await axios.get(`${API_URL}/admin/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('📥 Réponse de /api/admin/{id} :', res.data);
        setAdmin({
          prenom: res.data.prenom || '',
          nom: res.data.nom || '',
          telephone: res.data.telephone || '',
          email: res.data.email || '',
        });
        setLoading(false);
      } catch (err) {
        console.error('❌ Erreur lors de la récupération :', err.response?.data || err.message);
        setMessage(
          err.response?.data?.message || 'Erreur lors de la récupération des données de l\'administrateur.'
        );
        setLoading(false);
      }
    };
    fetchAdmin();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newAdmin = {
      ...admin,
      [name]: name === 'telephone' ? (value === '' ? '' : parseInt(value) || '') : value,
    };
    setAdmin(newAdmin);
    if (name === 'email') {
      setIsValidEmail(value.includes('@'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!admin.prenom || !admin.nom || !admin.telephone || !admin.email || !isValidEmail) {
      setMessage('Veuillez vérifier les informations saisies.');
      return;
    }

    setMessage('');
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setMessage('Vous devez être connecté en tant qu\'administrateur.');
        setLoading(false);
        return;
      }

      console.log('📤 Mise à jour de l\'admin à :', `${API_URL}/admin/${id}`, admin);
      const response = await axios.put(`${API_URL}/admin/${id}`, admin, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📥 Réponse de /api/admin/{id} :', response.data);
      setMessage('✅ Administrateur mis à jour avec succès ! Redirection...');
      setTimeout(() => {
        setIsFading(true);
      }, 1000);
      setTimeout(() => {
        navigate('/admin/detailAdmin');
      }, 2000);
    } catch (err) {
      console.error('❌ Erreur lors de la mise à jour :', err.response?.data || err.message);
      setLoading(false);
      setMessage(
        err.response?.data?.message || 'Erreur lors de la mise à jour des informations.'
      );
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
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Modifier l'administrateur
        </h2>

        {message && (
          <div
            className={`flex items-center justify-center gap-2 text-center text-sm p-2 rounded ${
              message.includes('succès') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}
          >
            {message}
            {loading && message.includes('succès') && <Spinner />}
          </div>
        )}

        {loading && !message && (
          <div className="flex items-center justify-center gap-2 text-center text-sm p-2">
            <Spinner />
            <span>Chargement...</span>
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
              value={admin[field]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        ))}

        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={admin.email}
            onChange={handleChange}
            className={`w-full border rounded-md px-3 py-2 focus:ring-2 ${
              !isValidEmail ? 'border-red-500' : 'border-gray-300'
            } focus:ring-blue-400`}
            required
          />
          {!isValidEmail && (
            <p className="text-xs text-red-600 mt-1">L'email doit contenir un @.</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition disabled:bg-blue-300"
          disabled={loading || !admin.prenom || !admin.nom || !admin.telephone || !admin.email || !isValidEmail}
        >
          {loading && !message.includes('succès') ? (
            <div className="flex items-center justify-center gap-2">
              <Spinner />
              <span>En cours...</span>
            </div>
          ) : (
            'Valider les modifications'
          )}
        </button>
      </form>
    </div>
  );
};

export default ModifierAdmin;