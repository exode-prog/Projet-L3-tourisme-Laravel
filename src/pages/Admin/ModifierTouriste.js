import React, { useEffect, useState } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config"; 

const ModifierTouriste = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [touriste, setTouriste] = useState({
    prenom: "",
    nom: "",
    numero: "",
    email: "",
    adresse: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTouriste = async () => {
      try {
        // Récupération du touriste par ID
        const res = await axios.get(`${API_URL}/touriste/${id}`);
        
        setTouriste(res.data);
      } catch (err) {
        setMessage("Erreur de récupération des données");
      }
    };
    fetchTouriste();
  }, [id]);

  const handleChange = (e) => {
    setTouriste({ ...touriste, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Récupération du token si nécessaire (sinon enlever cette partie)
      const token = localStorage.getItem("token");
      
      await axios.put(
        `${API_URL}/touriste/${id}`,
        touriste,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      
      navigate("/Admin/detailTouriste"); // redirection vers la liste après MAJ
    } catch (err) {
      setMessage("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">Modifier le touriste</h2>
        {message && <p className="text-red-500 mb-4">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="prenom"
            value={touriste.prenom}
            onChange={handleChange}
            placeholder="Prénom"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="nom"
            value={touriste.nom}
            onChange={handleChange}
            placeholder="Nom"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="numero"
            value={touriste.numero}
            onChange={handleChange}
            placeholder="Numéro"
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            value={touriste.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="adresse"
            value={touriste.adresse}
            onChange={handleChange}
            placeholder="Adresse"
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            disabled={
              !touriste.prenom || !touriste.nom || !touriste.numero || !touriste.email || !touriste.adresse
            }
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            Valider les modifications
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModifierTouriste;
