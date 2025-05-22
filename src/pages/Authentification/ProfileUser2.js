import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

const ProfileUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setError("Vous n'êtes pas connecté. Veuillez vous connecter pour accéder à votre profil.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/touriste/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.touriste);
          setIsAuthenticated(true);
          setError(null);
        } else {
          const errorData = await response.json();
          console.error("Erreur HTTP:", response.status, errorData);
          setError(errorData.error || "Vous n'êtes pas connecté. Veuillez vous connecter pour accéder à votre profil.");
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Erreur réseau ou serveur:", error);
        setError("Erreur lors de la connexion au serveur. Vérifiez votre connexion ou l'état du serveur.");
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    alert("Déconnexion réussie !");
    navigate("/Authentification/Connexion");
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Chargement du profil...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl text-red-600">{error || "Vous n'êtes pas connecté. Veuillez vous connecter pour accéder à votre profil."}</h2>
        <button
          onClick={() => navigate("/Authentification/Connexion")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Se connecter
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Profil utilisateur</h2>

      <div className="flex items-center space-x-4 mb-6">
        <img
          src={`https://ui-avatars.com/api/?name=${user.prenom}+${user.nom}&background=random&size=128`}
          alt="Avatar"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold">{user.prenom} {user.nom}</h3>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <p><strong>Nom :</strong> {user.nom}</p>
        <p><strong>Prénom :</strong> {user.prenom}</p>
        <p><strong>Email :</strong> {user.email}</p>
        <p><strong>Numéro :</strong> {user.numero}</p>
        <p><strong>Adresse :</strong> {user.adresse}</p>
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
      >
        Déconnexion
      </button>
    </div>
  );
};

export default ProfileUser;