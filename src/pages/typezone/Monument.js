import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVisitesByType } from '../../api/visites';

const Monument = () => {
  const [monuments, setMonuments] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const bufferToBase64 = (buffer) => {
    if (!buffer) return '';
    return buffer; // L'image est déjà en base64
  };

  useEffect(() => {
    const fetchMonuments = async () => {
      try {
        const data = await getVisitesByType('monument');
        setMonuments(data);
        setError('');
      } catch (err) {
        console.error('Erreur de chargement :', err);
        setError(err.message);
      }
    };
    fetchMonuments();
  }, []);

  const handleReservation = (monument) => {
    navigate('../reservation', { state: monument });
  };

  return (
    <div className="min-h-screen bg-yellow-100 py-12 px-4 md:px-10">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Monuments et Villes Historiques à Découvrir
      </h1>
      {error && <p className="text-red-600 text-center mb-4">Erreur : {error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {monuments.map((monument, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md">
            <img
              src={`data:image/jpeg;base64,${bufferToBase64(monument.image)}`}
              alt={`${monument.ville}, ${monument.pays}`}
              className="w-full h-60 object-cover rounded-md mb-4"
            />
            <h2 className="text-2xl font-semibold text-gray-700">
              {monument.ville}, {monument.pays}
            </h2>
            <p className="text-gray-600 mt-2 mb-4">{monument.description}</p>
            <button
              onClick={() => handleReservation(monument)}
              className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition"
            >
              Réserver une visite
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Monument;