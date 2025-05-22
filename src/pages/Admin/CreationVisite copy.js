import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreationVisite = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pays: "",
    ville: "",
    type: "",
    description: "",
    image: null,
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

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const res = await axios.post("http://192.168.3.11:4000/visite/", data);
      setMessage("Visite ajoutée avec succès !");
      setFormData({
        pays: "",
        ville: "",
        type: "",
        description: "",
        image: "",
      });
      navigate('/admin/dashboardAdmin');
    } catch (err) {
      setError("Erreur lors de l'ajout de la visite.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-green-600 text-center">
        Ajouter une Visite Touristique
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
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="ville"
            placeholder="Ville"
            value={formData.ville}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="type"
            placeholder="Type (ex: Plage, Montagne...)"
            value={formData.type}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />

        <div className="flex flex-col items-center">
          <label htmlFor="image" className="mb-2">Ajouter une image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          {formData.image && (
            <div className="mt-4">
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Aperçu"
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Ajouter la visite
        </button>
      </form>
    </div>
  );
};

export default CreationVisite;
