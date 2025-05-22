import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Culture = () => {
  const [cultures, setCultures] = useState([]);
  const navigate = useNavigate();

  const bufferToBase64 = (buffer) => {
    if (!buffer || !buffer.data) return "";
    return btoa(new Uint8Array(buffer.data).reduce((data, byte) => data + String.fromCharCode(byte), ""));
  };

  useEffect(() => {
    axios.get("http://192.168.3.11:4000/culture")
      .then(res => setCultures(res.data))
      .catch(err => console.error("Erreur de chargement :", err));
  }, []);

  const handleReservation = (culture) => {
    navigate("../reservation", { state: culture });
  };

  return (
    <div className="min-h-screen bg-purple-50 py-12 px-4 md:px-10">
      <h1 className="text-4xl font-bold text-center text-purple-800 mb-10">Richesses Culturelles à Découvrir</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {cultures.map((culture, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md">
            <img src={`data:image/jpeg;base64,${bufferToBase64(culture.image)}`} alt={culture.nom} className="w-full h-60 object-cover rounded-md mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700">{culture.ville}, {culture.pays}</h2>
            <p className="text-gray-600 mt-2 mb-4">{culture.description}</p>
            <button onClick={() => handleReservation(culture)} className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition">Réserver une visite</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Culture;
