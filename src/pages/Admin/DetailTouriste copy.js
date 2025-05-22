import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";

const DetailTouriste = () => {
  const [touristes, setTouristes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [selectedTouriste, setSelectedTouriste] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTouristes();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchTouristes = async () => {
    try {
      const res = await axios.get("http://192.168.3.11:4000/touriste");
      setTouristes(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Erreur de récupération des touristes", err);
      setMessage("Erreur lors du chargement des données.");
      setLoading(false);
    }
  };

  const supprimerTouriste = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce touriste ?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://192.168.3.11:4000/touriste/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTouristes(touristes.filter((t) => t.id_touriste !== id));
      setMessage("Touriste supprimé avec succès.");
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
      setMessage("Erreur lors de la suppression.");
    }
  };

  const afficherDetails = (touriste) => {
    setSelectedTouriste(touriste);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-800">Liste des touristes</h2>
          <Link
            to="/Admin/creationTouriste"
            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
          >
            + Ajouter un touriste
          </Link>
        </div>

        {message && (
          <div
            className={`mb-4 px-4 py-2 rounded text-white ${
              message.includes("succès") ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message}
          </div>
        )}

        {loading ? (
          <p className="text-gray-600">Chargement...</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Prénom</th>
                  <th className="px-4 py-3">Nom</th>
                  <th className="px-4 py-3">Numéro</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Adresse</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {touristes.map((touriste) => (
                  <tr
                    key={touriste.id_touriste}
                    className="border-b hover:bg-blue-50 transition"
                  >
                    <td className="px-4 py-2">{touriste.id_touriste}</td>
                    <td className="px-4 py-2">{touriste.prenom}</td>
                    <td className="px-4 py-2">{touriste.nom}</td>
                    <td className="px-4 py-2">{touriste.numero}</td>
                    <td className="px-4 py-2">{touriste.email}</td>
                    <td className="px-4 py-2">{touriste.adresse}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
                        title="Voir"
                        onClick={() => afficherDetails(touriste)}
                      >
                        <FaEye />
                      </button>
                      <Link
                        to={`/admin/ModifierTouriste/${touriste.id_touriste}`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                        title="Modifier"
                      >
                        <FaEdit />
                      </Link>

                      <button
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                        title="Supprimer"
                        onClick={() => supprimerTouriste(touriste.id_touriste)}
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

        {/* Modal d'affichage des infos */}
        {showModal && selectedTouriste && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <h3 className="text-xl font-bold text-blue-700 mb-4">
                Détails du touriste
              </h3>
              <table className="w-full text-left text-sm">
                <tbody>
                  <tr>
                    <td className="font-bold pr-2">ID:</td>
                    <td>{selectedTouriste.id_touriste}</td>
                  </tr>
                  <tr>
                    <td className="font-bold pr-2">Prénom:</td>
                    <td>{selectedTouriste.prenom}</td>
                  </tr>
                  <tr>
                    <td className="font-bold pr-2">Nom:</td>
                    <td>{selectedTouriste.nom}</td>
                  </tr>
                  <tr>
                    <td className="font-bold pr-2">Numéro:</td>
                    <td>{selectedTouriste.numero}</td>
                  </tr>
                  <tr>
                    <td className="font-bold pr-2">Email:</td>
                    <td>{selectedTouriste.email}</td>
                  </tr>
                  <tr>
                    <td className="font-bold pr-2">Adresse:</td>
                    <td>{selectedTouriste.adresse}</td>
                  </tr>
                </tbody>
              </table>
              <button
                onClick={() => setShowModal(false)}
                className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailTouriste;
