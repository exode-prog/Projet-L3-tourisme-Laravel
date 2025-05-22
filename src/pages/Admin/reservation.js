import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const Reservation = () => {
  const [date, setDate] = useState('');
  const [duree, setDuree] = useState('');
  const [reservationType, setReservationType] = useState('');
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const idVisite = state.id_visite;
  const idTouriste = localStorage.getItem('user_id'); // Récupérer depuis localStorage

  // Vérification de l'authentification
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !idTouriste) {
      navigate('/authentification/connexion');
    }
  }, [navigate, idTouriste]);

  useEffect(() => {
    console.log('✅ Vérification de location.state :', state);

    if (!idTouriste) {
      console.error('❌ ID du touriste non trouvé !');
      setError('Utilisateur non connecté.');
      return;
    } else {
      console.log('✅ ID du touriste reçu :', idTouriste);
    }

    if (!idVisite) {
      console.error('❌ ID de la visite non trouvé !');
      setError('Veuillez sélectionner une visite.');
      return;
    } else {
      console.log('✅ ID de la visite :', idVisite);
    }

    if (state?.id_guide) {
      setReservationType('guide');
      setSelectedGuide(state.id_guide);
    }
  }, [state, idTouriste, idVisite]);

  useEffect(() => {
    if (reservationType === 'guide' && !selectedGuide) {
      navigate('/ChoixGuide', {
        state: {
          id_touriste: idTouriste,
          id_visite: idVisite,
        },
      });
    }
  }, [reservationType, selectedGuide, navigate, idTouriste, idVisite]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Valeurs des champs :');
    console.log('Date :', date);
    console.log('Durée :', duree);
    console.log('Type de visite :', reservationType);
    console.log('ID Touriste :', idTouriste);
    console.log('ID Visite :', idVisite);
    console.log('ID Guide :', selectedGuide);

    if (!date || !duree || !idTouriste || !idVisite) {
      setError('Tous les champs sont requis.');
      return;
    }

    if (reservationType === 'guide' && !selectedGuide) {
      setError('Un guide est requis pour une visite guidée.');
      return;
    }

    const reservation = {
      date_activite: date, 
      duree: parseInt(duree),
      id_visite: idVisite,
      id_touriste: idTouriste,
      id_guide: reservationType === 'guide' ? selectedGuide : null,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/reservation`,
        reservation,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Réservation réussie :', response.data);
      alert('Réservation effectuée !');
      navigate('/confirmation');
    } catch (error) {
      console.error('Erreur lors de la réservation :', error.response?.data || error.message);
      setError(error.response?.data?.error || 'Une erreur est survenue.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-8">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Réserver une visite</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Date de visite :</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Durée (en jours) :</label>
            <input
              type="number"
              value={duree}
              onChange={(e) => setDuree(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Type de visite :</label>
            <select
              value={reservationType}
              onChange={(e) => setReservationType(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Sélectionnez --</option>
              <option value="libre">Visite libre</option>
              <option value="guide">Visite guidée</option>
            </select>
          </div>
          {reservationType === 'guide' && selectedGuide && (
            <div className="text-green-600 font-medium">
              ✅ Guide sélectionné : ID {selectedGuide}
            </div>
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
          >
            Réserver
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reservation;