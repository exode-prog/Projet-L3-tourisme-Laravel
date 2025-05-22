import React, { useState } from "react";
import { Link } from "react-router-dom";

import ExodusPhoto from './Exodus.jpg';
import MariamPhoto from './Mariam.jpeg';

const guides = [
  {
    id: 1,
    nom: "NGAMENEDE",
    prenom: "EXODE",
    zone: "Montagnes du Fouta",
    specialite: "Randonnée",
    commentaire: "Exode est passionné par la nature et les sentiers reculés.",
    photo: ExodusPhoto
  },
  {
    id: 2,
    nom: "RIANG",
    prenom: "MARIAM",
    zone: "Plages de la côte",
    specialite: "Culture et traditions",
    commentaire: "MARIAM adore partager les histoires locales et les chants traditionnels.",
    photo: MariamPhoto
  }
];

const Guide = () => {
  const [selectedGuide, setSelectedGuide] = useState(guides[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
        Nos Guides Touristiques
      </h1>

      <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
        {/* Colonne gauche : Liste des guides */}
        <div className="md:w-1/2 space-y-4">
          {guides.map((guide) => (
            <div
              key={guide.id}
              className={`bg-white p-4 rounded-lg shadow cursor-pointer border-l-4 ${
                selectedGuide.id === guide.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-transparent"
              }`}
              onClick={() => setSelectedGuide(guide)}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={guide.photo}
                  alt={`${guide.prenom} ${guide.nom}`}
                  className="w-20 h-20 object-cover rounded" // carré
                />
                <div>
                  <h2 className="text-lg font-semibold">
                    {guide.prenom} {guide.nom}
                  </h2>
                  <p className="text-sm text-gray-600">Zone : {guide.zone}</p>
                  <p className="text-sm text-gray-600">Spécialité : {guide.specialite}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Colonne droite : Détail du guide sélectionné */}
        <div className="md:w-1/2 bg-white p-8 rounded-xl shadow-md">
          <div className="flex justify-center mb-6">
            <img
              src={selectedGuide.photo}
              alt={`${selectedGuide.prenom} ${selectedGuide.nom}`}
              onClick={() => setIsModalOpen(true)}
              className="h-72 w-72 object-cover rounded shadow-md border border-blue-200 cursor-pointer hover:scale-105 transition"
            />
          </div>

          <h2 className="text-2xl font-bold text-blue-700 mb-3 text-center">
            {selectedGuide.prenom} {selectedGuide.nom}
          </h2>
          <p className="text-gray-700 text-lg mb-2 text-center">
            <span className="font-semibold">Zone :</span> {selectedGuide.zone}
          </p>
          <p className="text-gray-700 text-lg mb-3 text-center">
            <span className="font-semibold">Spécialité :</span> {selectedGuide.specialite}
          </p>
          <p className="italic text-gray-600 mb-4 text-center">
            "{selectedGuide.commentaire}"
          </p>

          <div className="text-center">
            <Link
              to={`/guides/${selectedGuide.id}`}
              className="mt-4 inline-block bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
            >
              Voir le profil
            </Link>
          </div>
        </div>
      </div>

      {/* MODAL pour afficher l'image en grand */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <img
            src={selectedGuide.photo}
            alt="Grande vue"
            className="max-w-[90%] max-h-[80vh] rounded shadow-lg border-4 border-white object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default Guide;
