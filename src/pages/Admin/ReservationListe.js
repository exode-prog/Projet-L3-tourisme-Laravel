import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';

const Spinner = () => (
  <div className="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
);

const ReservationListe = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState({ nom: '', ville: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    // Filtrage côté client
    const filtered = reservations.filter((reservation) => {
      const nomComplet = `${reservation.touriste_prenom} ${reservation.touriste_nom}`.toLowerCase();
      return (
        nomComplet.includes(search.nom.toLowerCase()) &&
        reservation.visite_ville.toLowerCase().includes(search.ville.toLowerCase()) &&
        reservation.visite_type.toLowerCase().includes(search.type.toLowerCase())
      );
    });
    setFilteredReservations(filtered);
  }, [reservations, search]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setMessage("Vous devez être connecté en tant qu'administrateur. Redirection...");
        setTimeout(() => navigate('/admin/login'), 2000);
        setLoading(false);
        return;
      }

      const res = await axios.get(`${API_URL}/reservation`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReservations(res.data);
      setFilteredReservations(res.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.response?.data?.message || 'Erreur lors du chargement des réservations.';
      setMessage(errorMessage);
      if (err.response?.status === 401) {
        setMessage('Session expirée. Veuillez vous reconnecter.');
        setTimeout(() => navigate('/admin/login'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression de cette réservation ?')) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setMessage("Vous devez être connecté en tant qu'administrateur. Redirection...");
        setTimeout(() => navigate('/admin/login'), 2000);
        setLoading(false);
        return;
      }

      await axios.delete(`${API_URL}/reservation/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReservations((prev) => prev.filter((r) => r.id_activite_touristique !== id));
      setFilteredReservations((prev) => prev.filter((r) => r.id_activite_touristique !== id));
      setMessage('Réservation supprimée avec succès.');
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.response?.data?.message || 'Erreur lors de la suppression.';
      setMessage(errorMessage);
      if (err.response?.status === 401) {
        setMessage('Session expirée. Veuillez vous reconnecter.');
        setTimeout(() => navigate('/admin/login'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearch((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Pas besoin de fetch ici, le filtrage est géré par useEffect
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 px-4 py-6 transition-opacity duration-700 ease-in-out">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700">Liste des réservations</h2>
        </div>

        <form onSubmit={handleSearch} className="mb-4 flex flex-wrap gap-3">
          <input
            type="text"
            name="nom"
            placeholder="Nom du touriste"
            value={search.nom}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="ville"
            placeholder="Ville"
            value={search.ville}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="type"
            placeholder="Type de visite"
            value={search.type}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Rechercher
          </button>
        </form>

        {message && (
          <div
            className={`flex items-center justify-center gap-2 text-center text-sm p-2 rounded mb-4 ${
              message.toLowerCase().includes('succès') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}
          >
            {message}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-2 text-center text-sm p-2">
            <Spinner />
            <span>Chargement...</span>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded shadow text-center">Aucune réservation trouvée.</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Durée</th>
                  <th className="px-4 py-3 text-left">Touriste</th>
                  <th className="px-4 py-3 text-left">Visite</th>
                  <th className="px-4 py-3 text-left">Guide</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((reservation) => (
                  <tr
                    key={reservation.id_activite_touristique}
                    className="border-b hover:bg-blue-50 transition"
                  >
                    <td className="px-4 py-2">{reservation.id_activite_touristique}</td>
                    <td className="px-4 py-2">{reservation.date_activite}</td>
                    <td className="px-4 py-2">{reservation.duree} h</td>
                    <td className="px-4 py-2">
                      {reservation.touriste_prenom} {reservation.touriste_nom}
                    </td>
                    <td className="px-4 py-2">
                      {reservation.visite_pays} - {reservation.visite_ville} ({reservation.visite_type})
                    </td>
                    <td className="px-4 py-2">
                      {reservation.guide_prenom && reservation.guide_nom
                        ? `${reservation.guide_prenom} ${reservation.guide_nom}`
                        : 'Non assigné'}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <Link
                        to={`/admin/voirReservation/${reservation.id_activite_touristique}`}
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
                        title="Voir"
                      >
                        <FaEye />
                      </Link>
                      <Link
                        to={`/admin/modifierReservation/${reservation.id_activite_touristique}`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                        title="Modifier"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                        title="Supprimer"
                        onClick={() => handleDelete(reservation.id_activite_touristique)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationListe;
