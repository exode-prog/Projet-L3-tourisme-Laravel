import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVisitesByType } from '../../api/visites';

const Desert = () => {
  const [deserts, setDeserts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const bufferToBase64 = (buffer) => {
    if (!buffer) return '';
    return buffer; // L'image est déjà en base64
  };

  useEffect(() => {
    const fetchDeserts = async () => {
      try {
        const data = await getVisitesByType('desert');
        setDeserts(data);
        setError('');
      } catch (err) {
        console.error('Erreur de chargement :', err);
        setError(err.message);
      }
    };
    fetchDeserts();
  }, []);

  const handleReservation = (desert) => {
    navigate('../reservation', { state: desert });
  };

  return (
    <div className="min-h-screen bg-yellow-50 py-12 px-4 md:px-10">
      <h1 className="text-4xl font-bold text-center text-yellow-800 mb-10">
        Déserts Époustouflants à Visiter
      </h1>
      {error && <p className="text-red-600 text-center mb-4">Erreur : {error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {deserts.map((desert, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md">
            <img
              src={`data:image/jpeg;base64,${bufferToBase64(desert.image)}`}
              alt={`${desert.ville}, ${desert.pays}`}
              className="w-full h-60 object-cover rounded-md mb-4"
            />
            <h2 className="text-2xl font-semibold text-gray-700">
              {desert.ville}, {desert.pays}
            </h2>
            <p className="text-gray-600 mt-2 mb-4">{desert.description}</p>
            <button
              onClick={() => handleReservation(desert)}
              className="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition"
            >
              Réserver une visite
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Desert;