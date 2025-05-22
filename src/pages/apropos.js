import React from "react";
import { motion } from "framer-motion";
import { FaFacebook, FaTwitter, FaLinkedin, FaYoutube } from "react-icons/fa";

const Apropos = () => {
  return (
    <div className="bg-white min-h-screen p-6 md:p-12">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-blue-700 mb-6"
        >
          À propos de nous
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-700 text-lg leading-relaxed mb-8"
        >
          Bienvenue sur notre plateforme de tourisme dédiée à l'exploration, à
          l'aventure et à la découverte de nouvelles cultures et paysages. Nous
          mettons en relation les voyageurs avec des services authentiques pour
          vivre des expériences inoubliables à travers nos plages, montagnes,
          déserts, forêts, parcs animaliers et sites culturels.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid gap-6 md:grid-cols-2"
        >
          <div className="bg-blue-50 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">
              Notre mission
            </h3>
            <p className="text-gray-600">
              Offrir aux touristes locaux et internationaux une plateforme
              simple et accessible pour découvrir les richesses culturelles et
              naturelles de notre région, tout en soutenant le tourisme
              responsable et durable.
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">
              Nos services
            </h3>
            <ul className="text-gray-600 list-disc list-inside text-left">
              <li>Réservation de logements et hébergements</li>
              <li>Location de voitures et transport local</li>
              <li>Guides touristiques personnalisés</li>
              <li>Activités culturelles, sportives et gastronomiques</li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 shadow-md md:col-span-2">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">
              Pourquoi nous choisir ?
            </h3>
            <p className="text-gray-600">
              Parce que nous connaissons le terrain, les meilleurs spots, les
              gens passionnés et les traditions locales. Nous mettons l’humain
              au cœur du voyage pour une immersion totale. Notre réseau de
              partenaires est sélectionné avec soin pour garantir sécurité,
              confort et authenticité.
            </p>
          </div>
        </motion.div>

        {/* Réseaux sociaux */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <div className="bg-blue-700 rounded-xl p-6 shadow-lg text-white">
            <h4 className="text-lg font-medium mb-4">
             Nous suivre  sur nos réseaux sociaux :
            </h4>
            <div className="flex justify-center space-x-6 text-3xl">
              <a href="#" className="hover:text-gray-300" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="#" className="hover:text-gray-300" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className="hover:text-gray-300" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="#" className="hover:text-gray-300" aria-label="YouTube">
                <FaYoutube />
              </a>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Apropos;
