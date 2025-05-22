import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";

function bufferToBase64(buffer) {
  if (!buffer) return "";
  return buffer; // La photo est déjà en base64 depuis le backend
}

const DetailGuide = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchGuides();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchGuides = async () => {
    try {
      const res = await axios.get("http://192.168.2.35:8000/api/guides");
      setGuides(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Erreur de récupération des guides", err);
      setMessage("Erreur lors du chargement des données.");
      setLoading(false);
    }
  };

  const supprimerGuide = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce guide ?")) return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://192.168.2.35:8000/api/guides/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGuides(guides.filter((t) => t.id_guide !== id));
      setMessage("Guide supprimé avec succès.");
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
      setMessage("Erreur lors de la suppression.");
    }
  };

  const afficherDetails = (guide) => {
    setSelectedGuide(guide);
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-700">Liste des Guides</h2>
        <Link
          to="/admin/CreationGuide"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Insérer un guide
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
        <p>Chargement...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Prénom</th>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Numéro</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Spécialité</th>
                <th className="px-4 py-3">Commentaire</th>
                <th className="px-4 py-3">Photo</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {guides.map((guide) => (
                <tr key={guide.id_guide} className="border-b hover:bg-blue-50">
                  <td className="px-4 py-2">{guide.id_guide}</td>
                  <td className="px-4 py-2">{guide.prenom}</td>
                  <td className="px-4 py-2">{guide.nom}</td>
                  <td className="px-4 py-2">{guide.numero}</td>
                  <td className="px-4 py-2">{guide.email}</td>
                  <td className="px-4 py-2">{guide.specialite}</td>
                  <td className="px-4 py-2">{guide.commentaire}</td>
                  <td className="px-4 py-2">
                    {guide.photo ? (
                      <img
                        src={`data:image/jpeg;base64,${bufferToBase64(guide.photo)}`}
                        alt="Guide"
                        className="w-12 h-12 object-cover rounded-full"
                      />
                    ) : (
                      "Aucune"
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
                      title="Voir"
                      onClick={() => afficherDetails(guide)}
                    >
                      <FaEye />
                    </button>
                    <Link
                      to={`/admin/modifierGuide/${guide.id_guide}`}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                      title="Modifier"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                      title="Supprimer"
                      onClick={() => supprimerGuide(guide.id_guide)}
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

      {/* Modal des détails du guide */}
      {showModal && selectedGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <h3 className="text-xl font-bold text-blue-700 mb-4">
              Détails du Guide
            </h3>
            <table className="w-full text-left text-sm">
              <tbody>
                <tr>
                  <td className="font-bold pr-2">ID:</td>
                  <td>{selectedGuide.id_guide}</td>
                </tr>
                <tr>
                  <td className="font-bold pr-2">Prénom:</td>
                  <td>{selectedGuide.prenom}</td>
  </tr>
                <tr>
                  <td className="font-bold pr-2">Nom:</td>
                  <td>{selectedGuide.nom}</td>
                </tr>
                <tr>
                  <td className="font-bold pr-2">Numéro:</td>
                  <td>{selectedGuide.numero}</td>
                </tr>
                <tr>
                  <td className="font-bold pr-2">Email:</td>
                  <td>{selectedGuide.email}</td>
                </tr>
                <tr>
                  <td className="font-bold pr-2">Spécialité:</td>
                  <td>{selectedGuide.specialite}</td>
                </tr>
                <tr>
                  <td className="font-bold pr-2">Commentaire:</td>
                  <td>{selectedGuide.commentaire}</td>
                </tr>
                <tr>
                  <td className="font-bold pr-2">Photo:</td>
                  <td>
                    {selectedGuide.photo ? (
                      <img
                        src={`data:image/jpeg;base64,${bufferToBase64(selectedGuide.photo)}`}
                        alt="Guide"
                        className="w-24 h-24 object-cover rounded-full"
                      />
                    ) : (
                      "Aucune"
                    )}
                  </td>
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
  );
};

export default DetailGuide;