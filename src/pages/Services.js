import React from "react";
import ttt from '/home/perben/react/tourisme/src/pages/salo.jpg'
import t from '/home/perben/react/tourisme/src/transport.jpg'
import tv from '/home/perben/react/tourisme/src/pages/Tourisme.jpg'

const services = [
  {
    id: 1,
    titre: "Tourisme",
    description: "Trouvez les meilleurs hôtels, auberges et logements confortables pour un séjour inoubliable.",
    image: tv,
    link: "/zonestouristiques"
  },
  {
    id: 2,
    titre: "Hébergement",
    description: "Trouvez les meilleurs hôtels, auberges et logements confortables pour un séjour inoubliable.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60",
    link: "/service/hebergement"
  },
  {
    id: 3,
    titre: "Transport",
    description: "Des voitures avec chauffeur, des bus touristiques et des navettes disponibles selon vos besoins.",
    image: t,
    link: "/service/transport"
  },
  {
    id: 4,
    titre: "Restauration",
    description: "Savourez une cuisine locale et internationale dans nos restaurants partenaires.",
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&q=60",
    link: "/service/restauration"
  },
  {
    id: 5,
    titre: "Coiffure & Esthétique",
    description: "Prenez soin de vous avec nos partenaires salons de beauté et coiffeurs qualifiés.",
    image: ttt,
    link: "/service/coiffure-esthetique"
  }
];

const Services = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 md:px-10">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">Nos Services</h1>
      <div className="space-y-10 max-w-7xl mx-auto">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-xl shadow-md overflow-hidden flex items-center hover:shadow-xl transition"
          >
            {/* Image à gauche */}
            <div className="w-1/3 h-48 overflow-hidden">
              <img
                src={service.image}
                alt={service.titre}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Description à droite */}
            <div className="p-6 w-2/3">
              <h2 className="text-2xl font-semibold text-blue-600 mb-2">{service.titre}</h2>
              <p className="text-gray-700 mb-4">{service.description}</p>
              <a
                href={service.link}
                className="inline-block px-6 py-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition"
              >
                En savoir plus
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
