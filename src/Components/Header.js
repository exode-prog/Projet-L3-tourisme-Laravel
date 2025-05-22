import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLinkClick = () => {
    setMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
    <div className="flex items-center space-x-3">
    <Link
  to="/"
  className="flex items-center space-x-3"
>
  <img
    src="https://via.placeholder.com/40"
    alt="Tourisme-Line Logo"
    className="h-10 w-10 rounded-full"
  />
  <span className="text-2xl font-bold text-white no-underline hover:no-underline">
    Tourisme-Travel
  </span>
</Link>

</div>

        {/* Menu principal - Desktop */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/dashboard" className="hover:text-gray-400">
            Tableau de bord
          </Link>
          <a href="/apropos" className="hover:text-gray-400">
            A propos
          </a>
          <a href="/Services" className="hover:text-gray-400">
            Services
          </a>
          <a href="/contact" className="hover:text-gray-400">
            Contact
          </a>
        </nav>

        {/* Menu utilisateur + hamburger */}
        <div className="flex items-center space-x-4">
          {/* Hamburger - Mobile only */}
          <div className="md:hidden" ref={mobileMenuRef}>
            <button onClick={toggleMobileMenu} className="text-2xl">
              <FaBars />
            </button>
          </div>

          {/* Icône utilisateur */}
          <div ref={userMenuRef}>
            <button onClick={toggleMenu} className="text-xl focus:outline-none">
              <FaUserCircle />
            </button>

            {/* Dropdown utilisateur */}
            {menuOpen && (
              <div className="absolute right-4 top-16 w-48 bg-white text-gray-800 shadow-xl rounded-xl z-50 p-3 space-y-2 animate-fade-in">
                <Link
                  to="/Authentification/Connexion"
                  onClick={handleLinkClick}
                  className="block px-4 py-2 text-sm font-medium bg-blue-100 hover:bg-blue-200 rounded-lg no-underline transition duration-200"
                >
                  Se connecter
                </Link>
                <Link
                  to="/Authentification/Inscription"
                  onClick={handleLinkClick}
                  className="block px-4 py-2 text-sm font-medium bg-green-100 hover:bg-green-200 rounded-lg no-underline transition duration-200"
                >
                  Créer un compte
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu mobile déroulant */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden mt-4 flex flex-col space-y-2 text-center bg-gray-700 rounded-lg p-4"
        >
          <Link
            to="/dashboard"
            onClick={handleLinkClick}
            className="text-white hover:text-gray-300"
          >
            Tableau de bord
          </Link>
          <a
            href="#about"
            onClick={handleLinkClick}
            className="text-white hover:text-gray-300"
          >
            About
          </a>
          <a
            href="#services"
            onClick={handleLinkClick}
            className="text-white hover:text-gray-300"
          >
            Services
          </a>
          <a
            href="#contact"
            onClick={handleLinkClick}
            className="text-white hover:text-gray-300"
          >
            Contact
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
