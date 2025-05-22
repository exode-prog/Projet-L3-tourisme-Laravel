import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ModifierVisite = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [visite, setVisite] = useState({
    pays: "",
    ville: "",
    type: "",
    description: "",
    image: null,
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchVisite = async () => {
      try {
        const res = await axios.get(`http://192.168.3.11:4000/visite/${id}`);
        setVisite(res.data);
      } catch (err) {
        setMessage("Erreur lors du chargement des données.");
        
      }
    };
    fetchVisite();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVisite({ ...visite, [name]: value });
  };

  const handleFileChange = (e) => {
    setVisite({ ...visite, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const formData = new FormData();
    formData.append("pays", visite.pays);
    formData.append("ville", visite.ville);
    formData.append("type", visite.type);
    formData.append("description", visite.description);
    if (visite.image) {
      formData.append("image", visite.image);
    }

    try {
      await axios.put(`http://192.168.3.11:4000/visite/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/admin/dashboardAdmin");
    } catch (err) {
      setMessage("Erreur lors de la modification de la visite.");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-green-700 text-center">Modifier la Visite Touristique</h2>
        {message && <p className="text-red-500 mb-4">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="pays"
            value={visite.pays}
            onChange={handleChange}
            placeholder="Pays"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="ville"
            value={visite.ville}
            onChange={handleChange}
            placeholder="Ville"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="type"
            value={visite.type}
            onChange={handleChange}
            placeholder="Type (Plage, Montagne...)"
            className="w-full p-2 border rounded"
          />
          <textarea
            name="description"
            value={visite.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-2 border rounded"
          />
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full p-2 border rounded"
          />

          {visite.image && typeof visite.image === "object" && (
            <img
              src={URL.createObjectURL(visite.image)}
              alt="Aperçu"
              className="w-32 h-32 object-cover rounded"
            />
          )}

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Mettre à jour
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModifierVisite;
