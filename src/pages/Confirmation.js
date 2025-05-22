// src/pages/Confirmation.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Confirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-8">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-xl text-center">
        <h2 className="text-3xl font-bold text-green-600">Réservation réussie !</h2>
        <p className="mt-4 text-lg text-gray-700">
          Merci pour votre réservation. Vous recevrez un e-mail de confirmation.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
