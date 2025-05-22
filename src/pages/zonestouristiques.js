import React from "react";
import { Link } from "react-router-dom";

// Importation des images descriptives
import Plage from '../assets/Tourisme/plage.jpg';
import Foret from '../assets/Tourisme/parc-national-des-virunga.jpg';
import Desert from '../assets/Tourisme/sable.jpg';
import Montagne from '../assets/Tourisme/kilima.jpg';

import Tour from './Tour.jpg';

const zones = [
  {
    id: 1,
    titre: "Plages",
    description: "Les plages offrent un cadre parfait pour la détente et les activités nautiques. Que ce soit pour le surf, la baignade ou simplement profiter du soleil, les plages restent un incontournable pour les amoureux de la mer.",
    image: Plage,
    link: "/typezone/plage"  // Lien vers la page de détails
  },
  {
    id: 2,
    titre: "Forêts",
    description: "Les forêts offrent une expérience immersive dans la nature, un lieu de tranquillité et de beauté. La randonnée et l'observation de la faune sont des activités populaires dans les forêts tropicales et tempérées.",
    image: Foret,
    link: "/typezone/foretParc"  // Lien vers la page de détails
  },
  {
    id: 3,
    titre: "Monuments",
    description: "Les grand monuments du mondes.",
    image: Tour,
    link: "/typezone/monument"  // Lien vers la page de détails
  },
  {
    id: 4,
    titre: "Déserts",
    description: "Les déserts offrent des paysages époustouflants, souvent silencieux et mystérieux. C'est l'endroit idéal pour les aventuriers en quête de paysages spectaculaires et de sensations fortes.",
    image: Desert,
    link: "/typezone/desert"  // Lien vers la page de détails
  },
  {
    id: 5,
    titre: "Montagnes",
    description: "Les montagnes offrent des panoramas spectaculaires et sont idéales pour les passionnés de randonnée et d'escalade. Les paysages montagneux peuvent varier, des sommets enneigés aux forêts verdoyantes.",
    image: Montagne,
    link: "/typezone/montagne"  // Lien vers la page de détails
  }
];

const ZonesTouristiques = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 md:px-10">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">Nos Zones Touristiques</h1>
      <div className="space-y-10 max-w-7xl mx-auto">
        {zones.map((zone) => (
          <div key={zone.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row hover:shadow-xl transition">
            {/* Image à gauche */}
            <img
              src={zone.image}
              alt={zone.titre}
              className="w-full md:w-1/3 h-auto object-cover"
            />
            {/* Description à droite */}
            <div className="p-6 w-full md:w-2/3">
              <h2 className="text-2xl font-semibold text-blue-600 mb-2">{zone.titre}</h2>
              <p className="text-gray-700 mb-4">{zone.description}</p>
              <Link to={zone.link}>
                <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
                  Explorer les différents endroits
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ZonesTouristiques;