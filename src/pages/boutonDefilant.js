import React, { useState, useEffect } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const BoutonDefilant = () => {
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);

  // Détecter la position de la page
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;

    // Vérifier si l'utilisateur est en haut de la page
    if (scrollPosition === 0) {
      setIsAtTop(true);
      setIsAtBottom(false);
    } 
    // Vérifier si l'utilisateur est en bas de la page
    else if (scrollPosition + windowHeight >= documentHeight - 1) { // -1 pour éviter les problèmes de précision
      setIsAtTop(false);
      setIsAtBottom(true);
    } else {
      setIsAtTop(false);
      setIsAtBottom(false);
    }
  };

  // Ajouter un événement pour écouter le défilement
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fonction pour faire défiler la page vers le bas ou vers le haut
  const scrollTo = (direction) => {
    if (direction === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (direction === "bottom") {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Bouton pour descendre */}
      {isAtTop && (
        <button
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
          onClick={() => scrollTo("bottom")}
        >
          <FaArrowDown />
        </button>
      )}

      {/* Bouton pour monter */}
      {isAtBottom && (
        <button
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
          onClick={() => scrollTo("top")}
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
};

export default BoutonDefilant;
