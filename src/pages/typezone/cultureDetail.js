import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVisitesByType } from '../../api/visites';

const Culture = () => {
  const [cultures, setCultures] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const bufferToBase64 = (buffer) => {
    if (!buffer) return '';
    return buffer; // L'image est déjà en base64
  };

  useEffect(() => {
    const fetchCultures = async () => {
      try {
        const data = await getVisitesByType('culture');
        setCultures(data);
        setError('');
      } catch (err) {
        console.error('Erreur de chargement :', err);
        setError(err.message);
      }
    };
    fetchCultures();
  }, []);

  const handleReservation = (culture) => {
    navigate('../reservation', { state: culture });
  };

  return (
    <div className="min-h-screen bg-gray-200 py-12 px-4 md:px-10">
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-10">
      Des cultures a decouvrir
      </h1>
      {error && <p className="text-red-600 text-center mb-4">Erreur : {error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {cultures.map((culture, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md">
            <img
              src={`data:image/jpeg;base64,${bufferToBase64(culture.image)}`}
              alt={`${culture.ville}, ${culture.pays}`}
              className="w-full h-60 object-cover rounded-md mb-4"
            />
            <h2 className="text-2xl font-semibold text-gray-700">
              {culture.ville}, {culture.pays}
            </h2>
            <p className="text-gray-600 mt-2 mb-4">{culture.description}</p>
            <button
              onClick={() => handleReservation(culture)}
              className="bg-blue-800 text-white py-2 px-4 rounded-md hover:bg-blue-900 transition"
            >
              Réserver une visite
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Culture;