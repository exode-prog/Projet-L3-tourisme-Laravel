const express = require('express');
//const mysql = require('mysql2');
const mysql = require('mysql2/promise');

const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const server = express();
const port = 4000;
const SECRET_KEY = process.env.JWT_SECRET || "secret";

server.use(cors());
server.use(express.json());

//Pour les images
const multer = require("multer");



// Configuration du stockage des images
const storage = multer.memoryStorage();
const upload = multer({ storage });


//const db = mysql.createConnection({
const con = await mysql.createConnection({
  host: '192.168.1.15',
  user: 'exode',
  password: 'passer',
  database: 'tourisme'
});

//**********************************************Touristes************************************* */


//Affichage

server.get('/touriste', (req, res) => {
  const query = 'SELECT * FROM touriste';
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    res.status(200).json(result);
  });
});



// 🔐 Inscription
server.post('/touriste', async (req, res) => {
  const { prenom, nom, numero, email, adresse, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO touriste (prenom, nom, numero, email, adresse, password) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [prenom, nom, numero, email, adresse, hashedPassword], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Email déjà utilisé' });
      }
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    res.status(201).json({ message: 'Inscription réussie' });
  });
});

//Modification du touriste

server.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await db.query('SELECT * FROM touriste WHERE id_touriste = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Touriste non trouvé' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Erreur récupération du touriste :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});



/*server.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { prenom, nom, numero, email, adresse } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE touriste 
       SET prenom = ?, nom = ?, numero = ?, email = ?, adresse = ? 
       WHERE id_touriste = ?`,
      [prenom, nom, numero, email, adresse, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Aucun touriste modifié" });
    }

    res.json({ message: "Touriste modifié avec succès" });
  } catch (error) {
    console.error("Erreur mise à jour touriste :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

*/

//Suppression d'un touriste 
server.delete('/touriste/:id', (req, res) => { 
  const { id } = req.params; 

  db.query('DELETE FROM touriste WHERE id_touriste = ?', [id], (err) => { 
      if (err) { 
          return res.status(500).json({ message: 'Erreur lors de la suppression du touriste.' }); 
      } 
      res.status(204).send()
  }) 
})

//*******************************visites****************** */

//Affichage

server.get('/visite', (req, res) => {
  const query = 'SELECT * FROM viste';
  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erreur serveur' });
      
    }
    res.status(200).json(result);
  });
});



// 🔐 Inscription
server.post('/visite', async (req, res) => {
  const { prenom, nom, numero, email, password,specialite,commentaire,photo } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO viste (pays, ville, type, image, description) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [pays, ville, type, image, description], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Déjà inseré' });
      }
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    res.status(201).json({ message: 'Ajout réussi' });
  });
});


//Suppression d'une visite
server.delete('/visite/:id', (req, res) => { 
  const { id } = req.params; 

  db.query('DELETE FROM viste WHERE id_visite = ?', [id], (err) => { 
      if (err) { 
          return res.status(500).json({ message: 'Erreur  de suppression de la visite.' }); 
      } 
      res.status(204).send()
  }) 
})



//*******************************Guides****************** */






//Affichage

server.get('/guide', (req, res) => {
  //const query = 'SELECT * FROM guide';
  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erreur serveur' });
      
    }
    res.status(200).json(result);
  });
});



// 🔐 Inscription


server.post("/guide", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Photo manquante" });
    }

    const { prenom, nom, numero, email, password, specialite, commentaire } = req.body;
    const photo = req.file.buffer;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO guide (prenom, nom, numero, email, password, specialite, commentaire, photo)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(query, [prenom, nom, numero, email, hashedPassword, specialite, commentaire, photo], (err, result) => {
      if (err) {
        console.error("Erreur SQL :", err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Email déjà utilisé' });
        }
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      res.status(201).json({ message: 'Inscription réussie' });
    });
  } catch (error) {
    console.error("Erreur interne :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});




//Suppression d'un guide 
server.delete('/guide/:id', (req, res) => { 
  const { id } = req.params; 

  db.query('DELETE FROM guide WHERE id_guide = ?', [id], (err) => { 
      if (err) { 
          return res.status(500).json({ message: 'Erreur lors de la suppression du guide.' }); 
      } 
      res.status(204).send()
  }) 
})








//*******************************Admins****************** */






//Affichage

server.get('/admin', (req, res) => {
  const query = 'SELECT * from admin';
  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erreur serveur' });
      
    }
    res.status(200).json(result);
  });
});



// 🔐 Inscription
server.post('/admin', async (req, res) => {
  const { prenom, nom, telephone, email, password } = req.body;


  const query = 'INSERT INTO admin (prenom, nom, telephone, email, password) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [prenom, nom, telephone, email, password], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Email déjà utilisé' });
      }
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    res.status(201).json({ message: 'Inscription réussie' });
  });
});


//Suppression d'un admin
server.delete('/admin/:id', (req, res) => { 
  const { id } = req.params; 

  db.query('DELETE FROM admin WHERE id_admin = ?', [id], (err) => { 
      if (err) { 
          return res.status(500).json({ message: 'Erreur lors de la suppression de l\'admin.' }); 
      } 
      res.status(204).send()
  }) 
})


//*******************************************Connexion******************* */

//Admin

// Connexion de l'admin
server.post('/admin/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM admin WHERE email = ?';

  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur' });
    if (results.length === 0) return res.status(404).json({ message: 'Email ou mot de passe incorrect' });

    const user = results[0];

    // 🛑 Vérification sans hash (mot de passe en clair)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign({
      id: user.id_admin,
      prenom: user.prenom,
      nom: user.nom,
      email: user.email,
      telephone: user.telephone
    }, SECRET_KEY, { expiresIn: '2h' });

    res.json({ token });
  });
});



//  Connexion du touriste
server.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM touriste WHERE email = ?';

  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur' });
    if (results.length === 0) return res.status(404).json({ message: 'Email ou mot de passe incorrect' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Email ou m ot de passe incorrect' });

    const token = jwt.sign({
      id: user.id_touriste,
      prenom: user.prenom,
      nom: user.nom,
      email: user.email,
      adresse: user.adresse,
      numero: user.numero
    }, SECRET_KEY, { expiresIn: '2h' });

    res.json({ token });
  });
});

// ✅ Middleware pour vérifier le token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// 🔍 Récupérer profil touriste
server.get('/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});


// 🔍 Récupérer profil admin
server.get('/admin/profile', authenticateToken, (req, res) => {
  res.json({ admin: req.user });
});


server.get('/admin/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});


server.listen(port, () => {
  console.log(`Serveur démarré sur http://192.168.1.15:${port}`);
});
 