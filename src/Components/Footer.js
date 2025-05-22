import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-8">
      <section className="flex justify-center items-center space-x-6 mb-6">
        <span>Restez connectés sur nos réseaux sociaux :</span>
        <div className="flex space-x-4">
          <a href="#" className="text-white text-3xl hover:text-gray-400">
            <FaFacebook />
          </a>
          <a href="#" className="text-white text-3xl hover:text-gray-400">
            <FaTwitter />
          </a>
          <a href="#" className="text-white text-3xl hover:text-gray-400">
            <FaLinkedin />
          </a>
          <a href="#" className="text-white text-3xl hover:text-gray-400">
            <FaYoutube />
          </a>
        </div>
      </section>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Colonne Contacts */}
        <div>
          <h5 className="text-lg font-semibold mb-4">Contacts</h5>
          <p>Email: info@tourisme-line.com</p>
          <p>+221 700987679</p>
        </div>

        {/* Colonne A propos */}
        <div>
          <h5 className="text-lg font-semibold mb-4">À propos</h5>
          <p>Nous sommes une entreprise de tourisme dédiée à offrir les meilleures expériences en voyage.</p>
        </div>

        {/* Colonne Navigation */}
        <div>
          <h5 className="text-lg font-semibold mb-4">Navigation</h5>
          <ul>
            <li><a href="/acceuil" className="hover:text-gray-400">Acceuil</a></li>
            <li><a href="/contact" className="hover:text-gray-400">Nous contacter</a></li>
            <li><a href="/aprpos" className="hover:text-gray-400">À propos de nous</a></li>
          </ul>
        </div>

        {/* Colonne Adresse */}
        <div>
          <h5 className="text-lg font-semibold mb-4">Adresse</h5>
          <p>Sénégal</p>
          <p>Dakar Sacré-Cœur</p>
          <p>+221 700987679</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
