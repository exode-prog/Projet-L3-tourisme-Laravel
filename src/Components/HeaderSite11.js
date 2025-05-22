import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import { Link } from "react-router-dom";
import axios from "axios";

const HeaderSite = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const profileRef = useRef(null);

  const toggleProfile = () => setProfileOpen(!profileOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleLinkClick = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://192.168.3.11:4000/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data && res.data.user) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Erreur de récupération du profil :", error.message);
        setError("Erreur de récupération du profil");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

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
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <img
              src="./Logo.png"
              
              className="h-10 w-10 rounded-full"
            />
            <span className="text-lg md:text-2xl font-bold">Tourisme-Travel</span>
          </Link>
        </div>

        {/* Menu Mobile */}
        <button className="text-white text-2xl md:hidden" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Recherche */}
        <div className="relative w-full max-w-xs mt-3 md:mt-0 ml-auto flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Recherche..."
            className="w-40 pl-9 pr-3 py-1.5 text-sm rounded-md text-black focus:outline-none"
          />
          <BiSearch className="absolute top-2 left-2 text-gray-500 text-base" />
        </div>

        {/* Profil utilisateur */}
        <div className="relative ml-4" ref={profileRef}>
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

                {loading ? (
                  <p>Chargement...</p>
                ) : error ? (
                  <p className="text-red-600">{error}</p>
                ) : (
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${user?.prenom || "Utilisateur"}+${user?.nom || ""}&background=random&size=64`}
                      alt="Avatar"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="text-sm">
                      {user ? (
                        <>
                          <p className="font-medium">{user.prenom} {user.nom}</p>
                          <p className="text-gray-500 text-xs">Utilisateur connecté</p>
                        </>
                      ) : (
                        <>
                          <p className="font-medium">Non connecté</p>
                          <p className="text-gray-500 text-xs">Aucune session</p>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {user ? (
                  <>
                    <Link
                      to="/authentification/ProfileUser"
                      className="block mt-2 text-center w-full bg-blue-600 text-white py-1.5 text-sm rounded-md hover:bg-blue-700 transition no-underline"
                    >
                      Profil
                    </Link>
                    <button
                      className="mt-2 w-full bg-red-600 text-white py-1.5 text-sm rounded-md hover:bg-red-700 transition"
                      onClick={() => {
                        localStorage.removeItem("token");
                        setUser(null);
                        setProfileOpen(false);
                      }}
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <Link
                    to="/authentification/Connexion"
                    className="block mt-2 text-center w-full bg-green-600 text-white py-1.5 text-sm rounded-md hover:bg-green-700 transition no-underline"
                  >
                    Se connecter
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Desktop */}
      <nav className="hidden md:flex gap-6 justify-center text-sm md:text-base">
        <a href="/Zonestouristiques" onClick={handleLinkClick} className="hover:text-gray-300">Zones touristiques</a>
        <a href="/guide" onClick={handleLinkClick} className="hover:text-gray-300">Guides</a>
        <a href="/Services" onClick={handleLinkClick} className="hover:text-gray-300">Nos services</a>
        <a href="/apropos" onClick={handleLinkClick} className="hover:text-gray-300">À propos</a>
        <a href="/contact" onClick={handleLinkClick} className="hover:text-gray-300">Contacts</a>
      </nav>

      {/* Navigation Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 space-y-2 text-sm bg-gray-700 p-4 rounded-md animate-fade-in-down">
          <a href="/zonestouristiques" className="block text-white hover:text-gray-300" onClick={handleLinkClick}>Zones touristiques</a>
          <a href="/guide" className="block text-white hover:text-gray-300" onClick={handleLinkClick}>Guides</a>
          <a href="/Services" className="block text-white hover:text-gray-300" onClick={handleLinkClick}>Nos services</a>
          <a href="/apropos" className="block text-white hover:text-gray-300" onClick={handleLinkClick}>À propos</a>
          <a href="/contact" className="block text-white hover:text-gray-300" onClick={handleLinkClick}>Contacts</a>
        </div>
      )}
    </header>
  );
};

export default HeaderSite;
