import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

const ChoixGuide = () => {
  const [guides, setGuides] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const bufferToBase64 = (base64String) => {
    if (!base64String) return '';
    return base64String; // La photo est déjà en base64
  };

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await axios.get(`${API_URL}/guides`);
        setGuides(response.data);
        setError('');
      } catch (err) {
        console.error('Erreur de chargement des guides:', err);
        setError(err.response?.data?.error || 'Erreur lors du chargement des guides');
      }
    };
    fetchGuides();
  }, []);

  const choisirGuide = (guideId) => {
    navigate('/reservation', {
      state: {
        ...location.state,
        id_guide: guideId,
        fromGuide: true,
      },
    });
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">
        Choisissez un guide
      </h2>
      {error && <p className="text-red-600 text-center mb-4">Erreur : {error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <div
            key={guide.id_guide}
            className="border rounded-xl p-4 bg-white shadow"
          >
            {guide.photo ? (
              <img
                src={`data:image/jpeg;base64,${bufferToBase64(guide.photo)}`}
                alt={`${guide.prenom} ${guide.nom}`}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                <span className="text-gray-500">Aucune photo</span>
              </div>
            )}
            <h3 className="text-xl font-semibold text-blue-700">
              {guide.prenom} {guide.nom}
            </h3>
            <p className="text-gray-600">Spécialité: {guide.specialite || 'Non spécifiée'}</p>
            <button
              onClick={() => choisirGuide(guide.id_guide)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Choisir ce guide
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChoixGuide;