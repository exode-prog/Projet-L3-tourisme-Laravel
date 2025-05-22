import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import { Link } from "react-router-dom";

const HeaderSite = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const profileRef = useRef(null);

  const toggleProfile = () => setProfileOpen(!profileOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false); // Fermer le menu mobile lorsque le lien est cliqué
  };

  const user = {
    firstName: "Exode",
    lastName: "NGAMENEDE",
  };

  // Fermer le menu profil si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
        {/* Logo + Titre avec lien vers /dashboard */}
        <div className="flex items-center space-x-2">
          <Link to="/dashboard">
            <img
              src="https://via.placeholder.com/40"
              alt="Tourisme-Line Logo"
              className="h-10 w-10 rounded-full"
            />
            <span className="text-lg md:text-2xl font-bold">Tourisme-Travel</span>
          </Link>
        </div>

        {/* Bouton menu mobile */}
        <button
          className="text-white text-2xl md:hidden"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Barre de recherche (à droite) */}
        <div className="relative w-full max-w-xs mt-3 md:mt-0 ml-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Recherche..."
            className="w-full pl-9 pr-3 py-1.5 text-sm rounded-md text-black focus:outline-none"
          />
          <BiSearch className="absolute top-2 left-2 text-gray-500 text-base" />
        </div>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex flex-wrap justify-center md:justify-start gap-4 text-sm md:text-base ml-5">
          <a href="/Zonestouristiques" className="hover:text-gray-300" onClick={handleLinkClick}>Zones touristiques</a>
          <a href="/guide" className="hover:text-gray-300" onClick={handleLinkClick}>Guides</a>
          <a href="/Services" className="hover:text-gray-300" onClick={handleLinkClick}>Nos services</a>
          <a href="/apropos" className="hover:text-gray-300" onClick={handleLinkClick}>À propos</a>
          <a href="/contact" className="hover:text-gray-300" onClick={handleLinkClick}>Contacts</a>
        </nav>

        {/* Profil utilisateur */}
        <div className="relative ml-2" ref={profileRef}>
          <button onClick={toggleProfile} className="text-xl hover:text-gray-300">
            <FaUserCircle />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white text-black shadow-lg rounded-xl z-50 animate-fade-in">
              <div className="absolute top-0 right-4 -mt-2 w-4 h-4 bg-white rotate-45 shadow-md"></div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-blue-600 mb-3 border-b pb-2">
                  Mon Profil
                </h3>

                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&size=64`}
                    alt="Avatar"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="text-sm">
                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-gray-500 text-xs">Utilisateur</p>
                  </div>
                </div>

                <Link
                  to="/authentification/ProfileUser"
                  className="block mt-2 text-center w-full bg-blue-600 text-white py-1.5 text-sm rounded-md hover:bg-blue-700 transition no-underline"
                >
                  Profil
                </Link>

                <button
                  className="mt-2 w-full bg-red-600 text-white py-1.5 text-sm rounded-md hover:bg-red-700 transition"
                  onClick={() => alert("Déconnexion...")}
                >
                  Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 space-y-2 text-sm bg-gray-700 p-4 rounded-md animate-fade-in-down">
          <a href="/zonestouristiques" className="block text-white hover:text-gray-300" onClick={handleLinkClick}>Zones touristiques</a>
          <a href="/guide" className="block text-white hover:text-gray-300" onClick={handleLinkClick}>Guides</a>
          <a href="/Services" className="block text-white hover:text-gray-300" onClick={handleLinkClick}>Nos services</a>
          <a href="/apropos" className="block text-white hover:text-gray-300" onClick={handleLinkClick}>A propos de nous</a>
          <a href="/contact" className="block text-white hover:text-gray-300" onClick={handleLinkClick}>Contacts</a>
        </div>
      )}
    </header>
  );
};

export default HeaderSite;
