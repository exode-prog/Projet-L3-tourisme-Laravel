import React, { useState } from "react";
import { FaBed, FaCar, FaUtensils, FaCut, FaMapMarkedAlt, FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Images des services
import hebergementImg from "../assets/Tourisme/imageServices/hebergement.png";
import restaurantImg from "../assets/Tourisme/imageServices/restaurant.jpg";
import tourismeImg from "../assets/Tourisme/imageServices/tourisme.jpg";
import voitureImg from "../assets/Tourisme/imageServices/voiture.jpg";
import coiffureImg from "../assets/Tourisme/imageServices/coiffure.webp";
import guideImg from "../assets/Tourisme/imageServices/guide.jpg";
import heroImage from "../assets/Tourisme/imageServices/TourismGarde.jpg";

// Images pour slider
import first from '../assets/Tourisme/desert.jpg';
import second from '../assets/Tourisme/nature.jpg';
import third from '../assets/Tourisme/egypte.jpg';
import fourth from '../assets/Tourisme/eau.jpg';
import fifth from '../assets/Tourisme/plage.jpg';
import sixth from '../assets/Tourisme/rocher.jpg';

// Images pour section "En savoir plus"
import image1 from "../assets/Tourisme/avion.jpg";
import image2 from "../assets/Tourisme/camera.jpg";
import image3 from "../assets/Tourisme/christ_bresil.webp";
import image4 from "../assets/Tourisme/egypte.jpg";
import image5 from "../assets/Tourisme/girafe.jpg";
import image6 from "../assets/Tourisme/eiffel.jpg";
import image7 from "../assets/Tourisme/delta-okavago.jpg";
import image8 from "../assets/Tourisme/goree.jpg";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

const data2 = [
  { image: image1, description: "Informatique théorique et quantique" },
  { image: image2, description: "Génie logiciel et développement" },
  { image: image3, description: "Recherche opérationnelle et IA" },
  { image: image4, description: "Bio-informatique et vision 3D" },
  { image: image5, description: "Une girafe dans la nature" },
  { image: image6, description: "La merveille de la tour Eiffel" },
  { image: image7, description: "Le gorille un animal fantastique" },
  { image: image8, description: "L'île de Gorée un endroit historique" },
];

const data = [
  {
    image: image1,
    title: "Découvrez nos plages magnifiques et reposantes.",
    link: "#plage",
  },
  {
    image: image2,
    title: "Parcourez nos villes avec votre appareil photo.",
    link: "#monument",
  },
  {
    image: image3,
    title: "Admirez les monuments du monde dans un seul endroit.",
    link: "#parc",
  },
  {
    image: image4,
    title: "Remontez dans le temps à travers nos sites historiques.",
    link: "#parc",
  },
  {
    image: image5,
    title: "Partez à l’aventure dans la nature avec notre faune locale.",
    link: "#parc",
  }
];

const services = [
  {
    title: "Hébergement",
    description: "Des hôtels confortables et logements adaptés à tous les budgets.",
    icon: <FaBed className="text-5xl text-blue-500" />,
    link: "/hebergement",
    image: hebergementImg,
  },
  {
    title: "Location de voiture",
    description: "Explorez en liberté grâce à nos voitures fiables.",
    icon: <FaCar className="text-5xl text-green-500" />,
    link: "/location-voiture",
    image: voitureImg,
  },
  {
    title: "Restaurants",
    description: "Savourez les plats locaux dans nos restaurants partenaires.",
    icon: <FaUtensils className="text-5xl text-red-500" />,
    link: "/restaurants",
    image: restaurantImg,
  },
  {
    title: "Salons de coiffure",
    description: "Offrez-vous un moment de beauté dans nos salons.",
    icon: <FaCut className="text-5xl text-purple-500" />,
    link: "/salons",
    image: coiffureImg,
  },
  {
    title: "Sites touristiques",
    description: "Découvrez des lieux emblématiques et naturels.",
    icon: <FaMapMarkedAlt className="text-5xl text-yellow-500" />,
    link: "/attractions",
    image: tourismeImg,
  },
  {
    title: "Guides touristiques",
    description: "Profitez de visites guidées par des experts locaux.",
    icon: <FaInfoCircle className="text-5xl text-teal-500" />,
    link: "/guides",
    image: guideImg,
  },
];

const Acceuil = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openServices, setOpenServices] = useState({});

  const toggleDropdown = (index) => {
    setOpenServices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-10">
      <div
        className="relative w-full h-80 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl font-bold">Explorez les merveilles de notre destination</h1>
          <p className="mt-4 text-lg">Un voyage inoubliable vous attend. Détente, aventure, et découvertes au cœur de notre région.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 text-center">
        <p className="italic text-lg text-gray-600">
          "Laissez-vous emporter par la beauté des paysages, l'hospitalité des gens et les expériences uniques qui feront de votre séjour un souvenir inoubliable."
        </p>
      </div>

      {/* 🎯 SLIDER data2 ICI */}
      <div className="mt-12 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Découvrez nos expériences uniques</h2>
        <Slider {...settings}>
          {data2.map((item, index) => (
            <div key={index} className="p-3">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img
                  src={item.image}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute bottom-0 w-full bg-black bg-opacity-60 text-white text-center py-2 px-3">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <p className="lead text-dark mt-10 text-center text-lg">
        Explorez, goûtez, ressentez et laissez-vous envoûter par la beauté et l’authenticité de ces endroits exceptionnels.  
        Préparez-vous à vivre des <span className="text-green-600 font-bold">moments inoubliables</span> et à repartir avec des souvenirs gravés à jamais !
      </p>

      <div className="py-8 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {data.map((item, index) => (
          <div
            key={index}
            className="rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-64 object-cover"
            />
            <div className="bg-gradient-to-t from-black to-transparent text-white p-4 text-center">
              <p className="font-bold mb-2">{item.title}</p>
              <a href={item.link} className="text-yellow-300 hover:underline">En savoir plus</a>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto mt-10">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-10">
          Nos services
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                {service.icon}
                <h3 className="mt-4 text-xl font-semibold text-gray-800">
                  {service.title}
                </h3>
                <p className="text-gray-600 mt-2 text-sm">{service.description}</p>
                <button
                  onClick={() => toggleDropdown(index)}
                  className="mt-3 text-sm text-blue-600 hover:underline focus:outline-none"
                >
                  {openServices[index] ? "Masquer les détails" : "Voir plus"}
                </button>
              </div>

              {openServices[index] && (
                <div className="mt-4 text-sm text-gray-700 border-t pt-3">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-32 object-cover rounded-md mb-3"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-100 rounded-md mb-3 flex items-center justify-center text-gray-400 text-xs">
                      Image non disponible
                    </div>
                  )}

                  <Link
                    to={service.link}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Aller au service
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Acceuil;
