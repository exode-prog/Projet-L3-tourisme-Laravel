import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ConnexionGuide = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://192.168.3.11:4000/admin", {
        email,
        password,
      });

      if (res.data.token) {
        localStorage.setItem("adminToken", res.data.token);
        navigate("/Admin/DashboardAdmin");
      } else {
        setMessage("Identifiants invalides");
      }
    } catch (err) {
      setMessage("Erreur de connexion");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto mt-20 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4 text-center">Connexion Guides</h2>
      {message && <p className="text-red-500 mb-2">{message}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border mb-3 rounded"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border mb-3 rounded"
          required
        />
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default ConnexionGuide;
