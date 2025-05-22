const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const server = express();
const PORT = 4000;

// Middleware CORS pour autoriser les requêtes du frontend
server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://192.168.1.194:3000'); // Adresse du frontend
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Méthodes autorisées
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With'); // En-têtes autorisés
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Permet l'envoi de cookies
  next();
});

// Middleware pour parser le JSON
server.use(bodyParser.json());

// Connexion à la base de données
const db = mysql.createConnection({
  host: '192.168.1.194',
  user: 'exode',
  password: 'passer',
  database: 'tourisme'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base :', err);
    process.exit(1);
  }
  console.log('✅ Connexion réussie à la base de données');
});

// Route POST pour inscrire un touriste
server.post('/touriste', async (req, res) => {
  console.log("📥 Requête reçue:", req.body);

  const { prenom, nom, numero, email, adresse, password } = req.body;

  if (!prenom || !nom || !numero || !email || !adresse || !password) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO touriste (prenom, nom, numero, email, adresse, password) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(query, [prenom, nom, numero, email, adresse, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ message: "Cet email est déjà utilisé." });
        }
        return res.status(500).json({ message: 'Erreur lors de l\'ajout du client.', error: err });
      }

      res.status(201).json({
        id: result.insertId,
        prenom, nom, numero, email, adresse
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur lors du hachage du mot de passe.' });
  }
});

// Démarrage du serveur
server.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});
