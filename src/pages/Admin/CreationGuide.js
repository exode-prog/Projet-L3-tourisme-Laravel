import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreationGuide = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    numero: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialite: "",
    commentaire: "",
    photo: null,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Vérification de la correspondance des mots de passe
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    // Récupérer le token JWT depuis localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vous devez être connecté pour ajouter un guide.");
      return;
    }

    // Préparer les données pour l'envoi
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "confirmPassword" && formData[key]) {
        data.append(key, formData[key]);
      }
    });

    try {
      const res = await axios.post("http://192.168.1.21:8000/api/guides", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Guide ajouté avec succès !");
      // Réinitialiser le formulaire
      setFormData({
        prenom: "",
        nom: "",
        numero: "",
        email: "",
        password: "",
        confirmPassword: "",
        specialite: "",
        commentaire: "",
        photo: null,
      });

      // Redirection après un délai pour afficher le message
      setTimeout(() => {
        navigate("/admin/dashboardAdmin");
      }, 2000);
    } catch (err) {
      console.error("Erreur lors de l'ajout du guide", err);
      if (err.response) {
        // Erreurs spécifiques renvoyées par le backend
        setError(
          err.response.data.error ||
            err.response.data.message ||
            "Erreur lors de l'ajout du guide."
        );
      } else {
        setError("Impossible de se connecter au serveur.");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-600 text-center">
        Ajouter un Guide Touristique
      </h2>
      {message && (
        <p className="text-green-600 mb-4 text-center font-semibold">{message}</p>
      )}
      {error && (
        <p className="text-red-600 mb-4 text-center font-semibold">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <input
              type="text"
              name="prenom"
              id="prenom"
              placeholder="Prénom"
              value={formData.prenom}
              onChange={handleChange}
              className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              type="text"
              name="nom"
              id="nom"
              placeholder="Nom"
              value={formData.nom}
              onChange={handleChange}
              className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="numero" className="block text-sm font-medium text-gray-700">
              Numéro
            </label>
            <input
              type="text"
              name="numero"
              id="numero"
              placeholder="Numéro"
              value={formData.numero}
              onChange={handleChange}
              className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmer mot de passe
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirmer mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="specialite" className="block text-sm font-medium text-gray-700">
            Spécialité
          </label>
          <input
            type="text"
            name="specialite"
            id="specialite"
            placeholder="Spécialité"
            value={formData.specialite}
            onChange={handleChange}
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="commentaire" className="block text-sm font-medium text-gray-700">
            Commentaire
          </label>
          <textarea
            name="commentaire"
            id="commentaire"
            placeholder="Commentaire"
            value={formData.commentaire}
            onChange={handleChange}
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
            Photo
          </label>
          <input
            type="file"
            name="photo"
            id="photo"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          {formData.photo && (
            <div className="mt-4">
              <img
                src={URL.createObjectURL(formData.photo)}
                alt="Aperçu de la photo"
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full"
        >
          Ajouter le guide
        </button>
      </form>
    </div>
  );
};

export default CreationGuide;