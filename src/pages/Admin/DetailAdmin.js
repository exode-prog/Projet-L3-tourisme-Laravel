import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

const DetailAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setMessage("Vous devez être connecté en tant qu'administrateur.");
        setLoading(false);
        return;
      }

      const res = await axios.get("http://192.168.2.35:8000/api/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdmins(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Erreur de récupération des administrateurs", err);
      setMessage(
        err.response?.data?.message ||
          "Erreur lors du chargement des données."
      );
      setLoading(false);
    }
  };

  const supprimerAdmin = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet administrateur ?"))
      return;

    const token = localStorage.getItem("adminToken");
    if (!token) {
      setMessage("Vous devez être connecté en tant qu'administrateur.");
      return;
    }

    try {
      await axios.delete(`http://192.168.2.35:8000/api/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdmins(admins.filter((a) => a.id_admin !== id));
      setMessage("Administrateur supprimé avec succès.");
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
      setMessage(
        err.response?.data?.message || "Erreur lors de la suppression."
      );
    }
  };

  const afficherDetails = (admin) => {
    setSelectedAdmin(admin);
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-indigo-700">
          Liste des Administrateurs
        </h2>
        <Link
          to="/admin/creationAdmin"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaPlus /> Créer un admin
        </Link>
      </div>

      {message && (
        <div
          className={`mb-4 px-4 py-2 rounded text-white text-center font-semibold ${
            message.includes("succès") ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message}
        </div>
      )}

      {loading ? (
        <p className="text-center">Chargement...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Prénom</th>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Téléphone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id_admin} className="border-b hover:bg-indigo-50">
                  <td className="px-4 py-2">{admin.id_admin}</td>
                  <td className="px-4 py-2">{admin.prenom}</td>
                  <td className="px-4 py-2">{admin.nom}</td>
                  <td className="px-4 py-2">{admin.telephone}</td>
                  <td className="px-4 py-2">{admin.email}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
                      title="Voir"
                      onClick={() => afficherDetails(admin)}
                    >
                      <FaEye />
                    </button>
                    <Link
                      to={`/admin/modifierAdmin/${admin.id_admin}`}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                      title="Modifier"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                      title="Supprimer"
                      onClick={() => supprimerAdmin(admin.id_admin)}
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
      {showModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <h3 className="text-xl font-bold text-indigo-700 mb-4">
              Détails de l'administrateur
            </h3>
            <table className="w-full text-left text-sm">
              <tbody>
                <tr>
                  <td className="font-bold pr-2">ID:</td>
                  <td>{selectedAdmin.id_admin}</td>
                </tr>
                <tr>
                  <td className="font-bold pr-2">Prénom:</td>
                  <td>{selectedAdmin.prenom}</td>
                </tr>
                <tr>
                  <td className="font-bold pr-2">Nom:</td>
                  <td>{selectedAdmin.nom}</td>
                </tr>
                <tr>
                  <td className="font-bold pr-2">Téléphone:</td>
                  <td>{selectedAdmin.telephone}</td>
                </tr>
                <tr>
                  <td className="font-bold pr-2">Email:</td>
                  <td>{selectedAdmin.email}</td>
                </tr>
              </tbody>
            </table>
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailAdmin;