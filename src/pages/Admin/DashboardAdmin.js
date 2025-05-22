import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaMapMarkedAlt,
  FaUsersCog,
  FaCalendarCheck,
  FaUserShield,
  FaMapSigns,
  FaFileInvoice,
  FaSignOutAlt,
} from "react-icons/fa";

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [adminNom, setAdminNom] = useState('');
  const [adminPrenom, setAdminPrenom] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/Admin/ConnexionAdmin');
      return;
    }

    // Récupère nom et prénom
    const nom = localStorage.getItem('adminNom');
    const prenom = localStorage.getItem('adminPrenom');
    setAdminNom(nom || '');
    setAdminPrenom(prenom || '');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminNom");
    localStorage.removeItem("adminPrenom");
    navigate("/Admin/ConnexionAdmin");
  };

  const navItems = [
    { label: "Touristes", icon: <FaUser />, link: "/admin/DetailTouriste" },
    { label: "Visites", icon: <FaMapMarkedAlt />, link: "/admin/DetailVisite" },
    { label: "Guides touristiques", icon: <FaMapSigns />, link: "/admin/DetailGuide" },
    { label: "Administrateurs", icon: <FaUserShield />, link: "/admin/DetailAdmin" },
    { label: "Réservations", icon: <FaCalendarCheck />, link: "/admin/reservationListe" },
    { label: "Factures", icon: <FaFileInvoice />, link: "/admin/DetailFacture" }
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
            Tableau Admin
          </h2>
          <nav className="space-y-4">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="flex items-center gap-3 text-gray-700 hover:bg-blue-100 px-3 py-2 rounded-md transition"
              >
                <span className="text-xl text-blue-600">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 mt-6"
        >
          <FaSignOutAlt /> Déconnexion
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-700">
          Bienvenue {adminPrenom} {adminNom}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {navItems.map((card, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-4xl text-blue-600">{card.icon}</div>
                <h2 className="text-xl font-semibold mt-4 text-gray-800">
                  {card.label}
                </h2>
                <Link
                  to={card.link}
                  className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Gérer
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardAdmin;
