import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";

function bufferToBase64(buffer) {
  if (!buffer || !buffer.data) return "";
  return btoa(
    new Uint8Array(buffer.data).reduce((data, byte) => data + String.fromCharCode(byte), "")
  );
}

const DetailVisite = () => {
  const [visites, setVisites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [selectedVisite, setSelectedVisite] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState({ pays: "", ville: "", type: "" });

  useEffect(() => {
    fetchVisites();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchVisites = async () => {
    setLoading(true);
    try {
      let res;
      if (search.pays || search.ville || search.type) {
        res = await axios.get("http://192.168.3.11:4000/visite/search", {
          params: search,
        });
      } else {
        res = await axios.get("http://192.168.3.11:4000/visite");
      }
      setVisites(res.data);
    } catch (err) {
      console.error("Erreur de récupération des visites", err);
      setMessage("Erreur lors du chargement des données.");
    }
    setLoading(false);
  };

  const supprimerVisite = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette visite ?")) return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://192.168.3.11:4000/visite/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVisites(visites.filter((v) => v.id_viste !== id));
      setMessage("Visite supprimée avec succès.");
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
      setMessage("Erreur lors de la suppression.");
    }
  };

  const afficherDetails = (visite) => {
    setSelectedVisite(visite);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVisites();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-700">Liste des Visites</h2>
        <Link
          to="/admin/CreationVisite"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Insérer une visite
        </Link>
      </div>

      {/* Barre de recherche */}
      <form onSubmit={handleSearch} className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          name="pays"
          placeholder="Pays"
          value={search.pays}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="ville"
          placeholder="Ville"
          value={search.ville}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="type"
          placeholder="Type"
          value={search.type}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Rechercher
        </button>
      </form>

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
      ) : visites.length === 0 ? (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded shadow text-center">
          Aucun résultat trouvé pour la recherche.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Pays</th>
                <th className="px-4 py-3">Ville</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visites.map((visite) => (
                <tr key={visite.id_viste} className="border-b hover:bg-blue-50">
                  <td className="px-4 py-2">{visite.id_viste}</td>
                  <td className="px-4 py-2">{visite.pays}</td>
                  <td className="px-4 py-2">{visite.ville}</td>
                  <td className="px-4 py-2">{visite.type}</td>
                  <td className="px-4 py-2">{visite.description}</td>
                  <td className="px-4 py-2">
                    {visite.image ? (
                      <img
                        src={`data:image/jpeg;base64,${bufferToBase64(visite.image)}`}
                        alt="Visite"
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      "Aucune"
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
                      title="Voir"
                      onClick={() => afficherDetails(visite)}
                    >
                      <FaEye />
                    </button>
                    <Link
                      to={`/admin/modifierVisite/${visite.id_visite}`}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                      title="Modifier"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                      title="Supprimer"
                      onClick={() => supprimerVisite(visite.id_visite)}
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

      {/* Modal détails */}
      {showModal && selectedVisite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <h3 className="text-xl font-bold text-blue-700 mb-4">
              Détails de la Visite
            </h3>
            <table className="w-full text-left text-sm">
              <tbody>
                <tr><td className="font-bold pr-2">ID:</td><td>{selectedVisite.id_viste}</td></tr>
                <tr><td className="font-bold pr-2">Pays:</td><td>{selectedVisite.pays}</td></tr>
                <tr><td className="font-bold pr-2">Ville:</td><td>{selectedVisite.ville}</td></tr>
                <tr><td className="font-bold pr-2">Type:</td><td>{selectedVisite.type}</td></tr>
                <tr><td className="font-bold pr-2">Description:</td><td>{selectedVisite.description}</td></tr>
                <tr>
                  <td className="font-bold pr-2">Image:</td>
                  <td>
                    {selectedVisite.image ? (
                      <img
                        src={`data:image/jpeg;base64,${bufferToBase64(selectedVisite.image)}`}
                        alt="Visite"
                        className="w-24 h-24 object-cover rounded"
                      />
                    ) : "Aucune"}
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

export default DetailVisite;
