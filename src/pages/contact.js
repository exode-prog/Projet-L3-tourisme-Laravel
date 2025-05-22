import React, { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "service_in9bq6n", // Ton Service ID
        "template_fnq4hsu", // Ton Template ID
        {
          from_name: form.name,
          reply_to: form.email,
          message: form.message,
          to_name: "Exode", // Ton nom ou projet
        },
        "1KYPOZHKFb9Gs0YAA" // Ta clé publique
      )
      .then(
        () => {
          setSubmitted(true);
          setTimeout(() => setSubmitted(false), 4000);
          setForm({ name: "", email: "", message: "" });
        },
        (error) => {
          console.error("Erreur d'envoi :", error.text);
        }
      );
  };

  return (
    <div
      className="relative bg-cover bg-center min-h-screen p-6 md:p-12"
      style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?travel')" }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-4xl mx-auto bg-white/90 rounded-xl shadow-xl p-8 md:p-12">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Contactez-nous
        </h2>

        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 border border-green-400 text-green-700 p-4 rounded mb-6 text-center"
          >
            Merci ! Votre message a bien été envoyé.
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Votre nom"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="exemple@domaine.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={4}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Votre message ici..."
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Envoyer
            </button>
          </div>
        </form>
      </div>

      {/* Carte de localisation réelle - Liberté 2, Dakar */}
      <div className="relative z-10 mt-10 max-w-4xl mx-auto">
        <iframe
          className="w-full h-64 rounded-xl shadow-lg border"
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7735.94861685968!2d-17.450265!3d14.717049!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec172d3de4df8e5%3A0x5f2b77a728ff4f8a!2sLibert%C3%A9%202%2C%20Dakar%2C%20S%C3%A9n%C3%A9gal!5e0!3m2!1sfr!2ssn!4v1712744786234!5m2!1sfr!2ssn"
          allowFullScreen=""
          loading="lazy"
          title="Carte - Liberté 2 Dakar"
        ></iframe>

        <div className="mt-4 text-center">
          <p className="text-gray-800 font-medium">Liberté 2, Dakar, Sénégal</p>
          <a
            href="https://goo.gl/maps/efycLmaiVezNFpec8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Voir sur Google Maps
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
