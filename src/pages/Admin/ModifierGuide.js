import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ModifierGuide = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guide, setGuide] = useState({
    prenom: "",
    nom: "",
    numero: "",
    email: "",
    specialite: "",
    commentaire: "",
    photo: null,  // On va gérer la photo séparément
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const res = await axios.get(`http://192.168.3.11:4000/guide/${id}`);
        setGuide(res.data);
      } catch (err) {
        setMessage("Erreur de récupération des données");
      }
    };
    fetchGuide();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGuide({ ...guide, [name]: value });
  };

  const handleFileChange = (e) => {
    setGuide({ ...guide, photo: e.target.files[0] }); // On garde le fichier photo
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("prenom", guide.prenom);
    formData.append("nom", guide.nom);
    formData.append("numero", guide.numero);
    formData.append("email", guide.email);
    formData.append("specialite", guide.specialite);
    formData.append("commentaire", guide.commentaire);
    if (guide.photo) {
      formData.append("photo", guide.photo); // Ajouter la photo si présente
    }

    try {
      await axios.put(`http://192.168.3.11:4000/guide/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important pour le téléchargement de fichiers
        },
      });
      navigate("/Admin/detailGuide"); // Rediriger après la mise à jour
    } catch (err) {
      setMessage("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">Modifier le guide</h2>
        {message && <p className="text-red-500 mb-4">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="prenom"
            value={guide.prenom}
            onChange={handleChange}
            placeholder="Prénom"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="nom"
            value={guide.nom}
            onChange={handleChange}
            placeholder="Nom"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="numero"
            value={guide.numero}
            onChange={handleChange}
            placeholder="Numéro"
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            value={guide.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="specialite"
            value={guide.specialite}
            onChange={handleChange}
            placeholder="Spécialité"
            className="w-full p-2 border rounded"
          />
          <textarea
            name="commentaire"
            value={guide.commentaire}
            onChange={handleChange}
            placeholder="Commentaire"
            className="w-full p-2 border rounded"
          />
          <input
            type="file"
            name="photo"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            disabled={
              !guide.prenom ||
              !guide.nom ||
              !guide.numero ||
              !guide.email ||
              !guide.specialite ||
              !guide.commentaire
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

export default ModifierGuide;
