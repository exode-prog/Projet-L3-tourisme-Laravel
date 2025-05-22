import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config";

const ModifierVisite = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pays: "",
    ville: "",
    type: "",
    description: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisite = async () => {
      try {
        const res = await axios.get(`${API_URL}/visites/${id}`);
        const visite = res.data;
        setFormData({
          pays: visite.pays || "",
          ville: visite.ville || "",
          type: visite.type || "",
          description: visite.description || "",
          image: null, // Nouvelle image non chargée par défaut
        });
        if (visite.image) {
          setPreviewImage(`data:image/jpeg;base64,${visite.image}`);
        }
        setLoading(false);
      } catch (err) {
        console.error("Erreur de récupération de la visite :", err.response || err);
        setError(err.response?.data?.message || "Erreur lors du chargement des données.");
        setLoading(false);
      }
    };
    fetchVisite();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files[0]) {
      if (files[0].size > 2 * 1024 * 1024) {
        setError("L'image est trop volumineuse (max 2 Mo).");
        return;
      }
      setPreviewImage(URL.createObjectURL(files[0]));
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`${API_URL}/visites/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(res.data.message || "Visite mise à jour avec succès !");
      setTimeout(() => navigate("/admin/DetailVisite"), 2000);
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err.response || err);
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat().join(", ");
        setError(`Erreur de validation : ${errorMessages}`);
      } else {
        setError(err.response?.data?.message || "Erreur lors de la mise à jour.");
      }
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">Chargement...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-green-700 text-center">
        Modifier la Visite Touristique
      </h2>
      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="pays"
            placeholder="Pays"
            value={formData.pays}
            onChange={handleChange}
            required
            maxLength={55}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="ville"
            placeholder="Ville"
            value={formData.ville}
            onChange={handleChange}
            required
            maxLength={55}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="type"
            placeholder="Type (ex: Plage, Montagne...)"
            value={formData.type}
            onChange={handleChange}
            required
            maxLength={55}
            className="border p-2 rounded w-full"
          />
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <div className="flex flex-col items-center">
          <label htmlFor="image" className="mb-2">
            Modifier l'image (JPEG/PNG, max 2 Mo)
          </label>
          <input
            type="file"
            name="image"
            accept="image/jpeg,image/png"
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          {previewImage && (
            <div className="mt-4">
              <img
                src={previewImage}
                alt="Aperçu"
                className="w-32 h-32 object-cover rounded-md"
                onError={(e) => console.error("Erreur de chargement de l'image d'aperçu")}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Mettre à jour
        </button>
      </form>
    </div>
  );
};

export default ModifierVisite;