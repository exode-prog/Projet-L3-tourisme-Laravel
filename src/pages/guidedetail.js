// GuideDetail.jsx
import React from "react";
import { useParams } from "react-router-dom";

const guides = [
  {
    id: 1,
    nom: "Diallo",
    prenom: "Amadou",
    zone: "Montagnes du Fouta",
    specialite: "Randonnée",
    description: "Amadou est un expert en sentiers montagneux avec 10 ans d'expérience...",
    photo: "https://via.placeholder.com/600x400"
  },
  {
    id: 2,
    nom: "Camara",
    prenom: "Fatou",
    zone: "Plages de la côte",
    specialite: "Culture et traditions",
    description: "Fatou vous fera découvrir les contes, chants et danses de la région côtière...",
    photo: "https://via.placeholder.com/600x400"
  }
];

const GuideDetail = () => {
  const { id } = useParams();
  const guide = guides.find((g) => g.id === parseInt(id));

  if (!guide) {
    return <p className="text-center mt-10 text-red-600">Guide non trouvé.</p>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <img
          src={guide.photo}
          alt={`${guide.prenom} ${guide.nom}`}
          className="w-full h-96 object-cover rounded-xl mb-6"
        />
        <h1 className="text-3xl font-bold text-blue-700 mb-2">
          {guide.prenom} {guide.nom}
        </h1>
        <p className="text-gray-700 mb-2"><strong>Zone :</strong> {guide.zone}</p>
        <p className="text-gray-700 mb-2"><strong>Spécialité :</strong> {guide.specialite}</p>
        <p className="text-gray-600 leading-relaxed mt-4">{guide.description}</p>
      </div>
    </div>
  );
};

export default GuideDetail;
