import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardGuide = () => {
  const [guide, setGuide] = useState({});
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    // 1. Récupère les infos du guide via token
    const fetchGuideData = async () => {
      try {
        const res = await axios.get('http://192.168.3.11:4000/guide/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setGuide(res.data);
      } catch (err) {
        console.error('Erreur profil guide :', err);
      }
    };

    // 2. Récupère les réservations liées au guide
    const fetchReservations = async () => {
      try {
        const res = await axios.get('http://192.168.3.11:4000/reservations/guide', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setReservations(res.data);
      } catch (err) {
        console.error('Erreur réservations :', err);
      }
    };

    fetchGuideData();
    fetchReservations();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Bienvenue {guide.prenom} {guide.nom} sur votre tableau de bord
      </h1>

      <h2 className="text-xl font-semibold mb-2">Vos réservations :</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-2 px-4">Touriste</th>
              <th className="py-2 px-4">Ville</th>
              <th className="py-2 px-4">Pays</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Durée</th>
              <th className="py-2 px-4">Statut</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id_reservation} className="text-center border-b">
                <td className="py-2 px-4">{res.prenom_touriste} {res.nom_touriste}</td>
                <td className="py-2 px-4">{res.ville}</td>
                <td className="py-2 px-4">{res.pays}</td>
                <td className="py-2 px-4">{new Date(res.date_reservation).toLocaleDateString()}</td>
                <td className="py-2 px-4">{res.duree} jour(s)</td>
                <td className="py-2 px-4">
                  {res.status === 'confirmée' ? (
                    <span className="text-green-600 font-semibold">Confirmée</span>
                  ) : (
                    <span className="text-red-500 font-semibold">En attente</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardGuide;
