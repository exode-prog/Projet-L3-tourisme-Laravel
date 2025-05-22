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
      const userId = localStorage.getItem("user_id");

      console.log('Token utilisé :', token);
      console.log('User ID utilisé :', userId);
      console.log('Envoi de la requête à :', `${API_URL}/touriste/profile`);

      if (!token) {
        setError("Aucun token trouvé. Veuillez vous connecter.");
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/touriste/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log('Réponse API /touriste/profile :', response.status, data);

        if (response.ok) {
          setUser(data.touriste || data.user || data);
          setIsAuthenticated(true);
          setError(null);
        } else {
          console.error("Erreur HTTP:", response.status, data);
          setError(data.error || "Erreur lors de la récupération du profil. Veuillez vous reconnecter.");
          localStorage.removeItem("token");
          localStorage.removeItem("user_id");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Erreur réseau ou serveur:", error);
        setError("Erreur lors de la connexion au serveur. Vérifiez votre connexion ou l'état du serveur.");
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setUser(null);
    setIsAuthenticated(false);
    alert("Déconnexion réussie !");
    navigate("/Authentification/Connexion");
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Chargement du profil...</div>;
  }

  if (!isAuthenticated || error) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl text-red-600">{error || "Vous n'êtes pas connecté. Veuillez vous connecter."}</h2>
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
          src={`https://ui-avatars.com/api/?name=${user.prenom || ''}+${user.nom || ''}&background=random&size=128`}
          alt="Avatar"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold">{user.prenom || 'Non défini'} {user.nom || 'Non défini'}</h3>
          <p className="text-gray-500">{user.email || 'Non défini'}</p>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <p><strong>Nom :</strong> {user.nom || 'Non défini'}</p>
        <p><strong>Prénom :</strong> {user.prenom || 'Non défini'}</p>
        <p><strong>Email :</strong> {user.email || 'Non défini'}</p>
        <p><strong>Numéro :</strong> {user.numero || 'Non défini'}</p>
        <p><strong>Adresse :</strong> {user.adresse || 'Non défini'}</p>
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