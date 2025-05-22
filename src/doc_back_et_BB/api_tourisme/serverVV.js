//Pour doc
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');



const express = require('express');
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

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });


async function main() {
const con = await mysql.createConnection({
  host: '192.168.3.11',
  user: 'exode',
  password: 'passer',
  database: 'tourisme'
});


// Middleware pour Swagger
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Middleware pour vérifier le token JWT
 /* const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Token manquant" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ message: "Token invalide" });
      req.user = user;
      next();
    });
  }
*/


// Middleware pour vérifier le token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    console.log(" Aucun token trouvé !");
    return res.status(401).json({ message: "Token manquant" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.log("Token invalide ou expiré :", err.message);
      return res.status(403).json({ message: "Token invalide" });
    }

    console.log("✅ Token valide :", user);
    req.user = user;
    next();
  });
};
 

// **********************************************Touristes*************************************


//Affichage
server.get('/touriste', async (req, res) => {
  try {
    const [result] = await con.query('SELECT * FROM touriste');
    res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});


//Insertion
server.post('/touriste', async (req, res) => {
  const { prenom, nom, numero, email, adresse, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await con.query('INSERT INTO touriste (prenom, nom, numero, email, adresse, password) VALUES (?, ?, ?, ?, ?, ?)',
      [prenom, nom, numero, email, adresse, hashedPassword]);
    res.status(201).json({ message: 'Inscription réussie' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});


//Affichage par ID
server.get('/touriste/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await con.query('SELECT * FROM touriste WHERE id_touriste = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Touriste non trouvé' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

//Modification
server.put('/touriste/:id', async (req, res) => {
    const id = req.params.id;
    const { prenom, nom, numero, email, adresse } = req.body;
  
    try {
      const [result] = await con.query(
        'UPDATE touriste SET prenom = ?, nom = ?, numero = ?, email = ?, adresse = ? WHERE id_touriste = ?',
        [prenom, nom, numero, email, adresse, id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Touriste non trouvé' });
      }
  
      res.json({ message: 'Touriste mis à jour avec succès' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour du touriste' });
    }
  });
  

//Suppression 
server.delete('/touriste/:id', authenticateToken, async (req, res) => {
  //server.delete('/touriste/:id', async (req, res) => {

  try {
    await con.query('DELETE FROM touriste WHERE id_touriste = ?', [req.params.id]);
    res.status(204).send();
  } catch {
    res.status(500).json({ message: 'Erreur lors de la suppression du touriste.' });
  }
});



// *******************************Visites********************************************************************************


//AffichGE
server.get('/visite', async (req, res) => {
  try {
    const [result] = await con.query('SELECT * FROM viste');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});



//Affichage avec filtrage
server.get('/visite/search', async (req, res) => {
  const { pays, ville, type } = req.query;

  let query = 'SELECT * FROM viste WHERE 1=1';
  const params = [];

  if (pays) {
    query += ' AND pays LIKE ?';
    params.push(`%${pays}%`);
  }
  if (ville) {
    query += ' AND ville LIKE ?';
    params.push(`%${ville}%`);
  }
  if (type) {
    query += ' AND type LIKE ?';
    params.push(`%${type}%`);
  }

  try {
    const [result] = await con.query(query, params);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});



//Affichage par ID
server.get('/visite/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await con.query('SELECT * FROM viste WHERE id_visite = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Visite non trouvée' });
    }

    const viste = rows[0];

    // Convertir l'image (buffer) en base64 si elle existe
    if (viste.image) {
      viste.image = viste.image.toString('base64');
    }

    res.json(viste);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Backend - Créer une réservation
server.post("/reservation", upload.single("image"), async (req, res) => {
  try {
    const { id_touriste, id_visite, date, duree, id_guide } = req.body;

    // Vérification des champs manquants
    if (!id_touriste || !id_visite || !date || !duree) {
      return res.status(400).json({ message: "Champs requis manquants." });
    }

    // Si l'ID du guide est fourni, il peut être null si non sélectionné
    const guideId = id_guide || null;

    // Log des données reçues
    console.log("Données reçues pour la réservation :", req.body);

    // Insertion dans la table 'activite_touristique'
    const sql = `
      INSERT INTO activite_touristique (id_touriste, id_visite, date, duree, id_guide)
      VALUES (?, ?, ?, ?, ?)
    `;

    // Exécution de la requête SQL pour insérer la réservation
    await db.query(sql, [id_touriste, id_visite, date, duree, guideId]);

    // Réponse en cas de succès
    res.status(201).json({ message: "Réservation réussie" });
  } catch (err) {
    // Gestion des erreurs spécifiques
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Réservation déjà effectuée" });
    }
    
    // Log d'erreur pour faciliter le débogage
    console.error("Erreur lors de la réservation :", err);
    res.status(500).json({ message: "Erreur lors de la réservation", erreur: err });
  }
});

//Modification
server.put('/visite/:id', upload.single('image'), async (req, res) => {
  const id = req.params.id;
  const { pays, ville, type, description } = req.body;

  const imageBuffer = req.file ? req.file.buffer : null;

  try {
    let query, params;

    if (imageBuffer) {
      query = `
        UPDATE viste 
        SET pays = ?, ville = ?, type = ?, description = ?, image = ?
        WHERE id_visite = ?`;
      params = [pays, ville, type, description, imageBuffer, id];
    } else {
      query = `
        UPDATE viste 
        SET pays = ?, ville = ?, type = ?, description = ?
        WHERE id_visite = ?`;
      params = [pays, ville, type, description, id];
    }

    const [result] = await con.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Aucune visite modifiée (ID invalide ?)" });
    }

    res.json({ message: 'Visite mise à jour avec succès' });
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la visite' });
  }
});


//Insertion des visites
server.post("/visite", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image manquante" });

    const { pays, ville, type, description } = req.body;
    const image = req.file.buffer;

    await con.query(`INSERT INTO visite (pays, ville, type, image, description)
                     VALUES (?, ?, ?, ?, ?)`,
      [pays, ville, type, image, description]);
      
    res.status(201).json({ message: 'Visite ajoutée avec succès' });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Visite déjà enregistrée' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
});



//Suppression
server.delete('/visite/:id', authenticateToken, async (req, res) => {
  try {
    await con.query('DELETE FROM viste WHERE id_visite = ?', [req.params.id]);
    res.status(204).send();
  } catch {
    res.status(500).json({ message: 'Erreur lors de la suppression de la visite.' });
  }
});







// *******************************Guides******************

//Affichage
server.get('/guide', async (req, res) => {
  try {
    const [result] = await con.query('SELECT * FROM guide');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});




// Afficher le guide par son ID
server.get('/guide/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await con.query('SELECT * FROM guide WHERE id_guide = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Guide non trouvé' });
    }

    const guide = rows[0];
    
    // Convertir la photo (buffer) en base64 si elle existe
    if (guide.photo) {
      guide.photo = guide.photo.toString('base64');
    }

    res.json(guide);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});



//Modification




server.put('/guide/:id', upload.single('photo'), async (req, res) => {
  const id = req.params.id;
  const { prenom, nom, numero, email, specialite, commentaire } = req.body;

  const photoBuffer = req.file ? req.file.buffer : null;

  try {
    let query, params;

    if (photoBuffer) {
      query = `
        UPDATE guide 
        SET prenom = ?, nom = ?, numero = ?, email = ?, specialite = ?, commentaire = ?, photo = ?
        WHERE id_guide = ?`;
      params = [prenom, nom, numero, email, specialite, commentaire, photoBuffer, id];
    } else {
      query = `
        UPDATE guide 
        SET prenom = ?, nom = ?, numero = ?, email = ?, specialite = ?, commentaire = ?
        WHERE id_guide = ?`;
      params = [prenom, nom, numero, email, specialite, commentaire, id];
    }

    const [result] = await con.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Aucun guide modifié (ID invalide ?)" });
    }

    res.json({ message: 'Guide mis à jour avec succès' });
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du guide' });
  }
});




//Insertion

server.post("/guide", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Photo manquante" });

    const { prenom, nom, numero, email, password, specialite, commentaire } = req.body;
    const photo = req.file.buffer;
    const hashedPassword = await bcrypt.hash(password, 10);

    await con.query(`INSERT INTO guide (prenom, nom, numero, email, password, specialite, commentaire, photo)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [prenom, nom, numero, email, hashedPassword, specialite, commentaire, photo]);
    res.status(201).json({ message: 'Inscription réussie' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


//Suppression

server.delete('/guide/:id', authenticateToken, async (req, res) => {
  //server.delete('/guide/:id', async (req, res) => {
  try {
    await con.query('DELETE FROM guide WHERE id_guide = ?', [req.params.id]);
    res.status(204).send();
  } catch {
    res.status(500).json({ message: 'Erreur lors de la suppression du guide.' });
  }
});

// *******************************Admins******************

//Affichage
server.get('/admin', async (req, res) => {
  try {
    const [result] = await con.query('SELECT * from admin');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

//Insertion

server.post('/admin', async (req, res) => {
  const { prenom, nom, telephone, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await con.query('INSERT INTO admin (prenom, nom, telephone, email, password) VALUES (?, ?, ?, ?, ?)',
      [prenom, nom, telephone, email, hashedPassword]);
    res.status(201).json({ message: 'Inscription réussie' });
  } catch (err) {
    console.error('Erreur lors de l\'insertion admin :', err); // 👈 AJOUTE ÇA
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email déjà utilisé' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


// Affichage d’un admin par ID
server.get('/admin/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await con.query('SELECT * FROM admin WHERE id_admin = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Administrateur non trouvé' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Modification d’un admin
server.put('/admin/:id', async (req, res) => {
  const id = req.params.id;
  const { prenom, nom, telephone, email } = req.body;

  try {
    const [result] = await con.query(
      'UPDATE admin SET prenom = ?, nom = ?, telephone = ?, email = ? WHERE id_admin = ?',
      [prenom, nom, telephone, email, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Administrateur non trouvé' });
    }

    res.json({ message: 'Administrateur mis à jour avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'administrateur' });
  }
});


//Suppression
server.delete('/admin/:id', authenticateToken, async (req, res) => {
  try {
    await con.query('DELETE FROM admin WHERE id_admin = ?', [req.params.id]);
    res.status(204).send();
  } catch {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'admin.' });
  }
});

// *******************************************Connexion*******************

//Pour l admin

server.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [results] = await con.query('SELECT * FROM admin WHERE email = ?', [email]);

    if (results.length === 0) return res.status(404).json({ message: 'Email ou mot de passe incorrect' });

    const user = results[0];


    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }


/*if (password !== user.password) {
  return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
}*/

    const token = jwt.sign({
      id: user.id_admin,
      prenom: user.prenom,
      nom: user.nom,
      email: user.email,
      telephone: user.telephone
    }, SECRET_KEY, { expiresIn: '22h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


//Pour le touriste
server.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [results] = await con.query('SELECT * FROM touriste WHERE email = ?', [email]);
    if (results.length === 0) return res.status(404).json({ message: 'Email ou mot de passe incorrect' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });

    const token = jwt.sign({
      id: user.id_touriste,
      prenom: user.prenom,
      nom: user.nom,
      email: user.email,
      numero: user.numero
    }, SECRET_KEY, { expiresIn: '22h' });

    //res.json({ token });
    console.log("Token généré :", token);

    res.json({ token });

  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});



// 🔍 Récupérer profil touriste
server.get('/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});


/*************************************************************Gestion des details type de visite************* */

// Exemple : GET /api/monuments
server.get('/monument', async (req, res) => {
  try {
    const [result] = await con.query("SELECT * FROM viste WHERE type = 'Monument' OR type = 'Ville'");
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

//pour la plage
server.get('/plage', async (req, res) => {
  try {
    const [result] = await con.query("SELECT * FROM viste WHERE type = 'Plage' ");
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

//pour le desert

server.get('/desert', async (req, res) => {
  try {
    const [result] = await con.query("SELECT * FROM viste WHERE type = 'Desert' ");
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});



//-------Montagne
server.get('/montagne', async (req, res) => {
  try {
    const [result] = await con.query("SELECT * FROM viste WHERE type = 'Montagne' ");
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


//-------Foret et Parcs
server.get('/foret', async (req, res) => {
  try {
    const [result] = await con.query("SELECT * FROM viste WHERE type = 'Foret' OR type = 'Parc' ");
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


//---------------------------La reservation

// Backend - Créer une réservation
/*server.post("/reservation", (req, res) => {
  const { id_touriste, id_visite, date, duree, id_guide } = req.body;

  console.log("Données reçues :", req.body); // Log des données reçues

  if (!id_touriste || !id_visite || !date || !duree) {
    return res.status(400).json({ message: "Champs requis manquants." });
  }

  const sql = `
    INSERT INTO activite_touristique (id_touriste, id_visite, date, duree, id_guide)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [id_touriste, id_visite, date, duree, id_guide || null], (err, result) => {
    if (err) {
      console.error("Erreur SQL :", err); // Log des erreurs SQL
      return res.status(500).json({ message: "Erreur lors de la réservation", erreur: err });
    }

    res.status(201).json({ message: "Réservation réussie", id: result.insertId });
  });
});*/


// Backend - Créer une réservation
server.post("/reservation", (req, res) => {
  const { id_touriste, id_visite, date, duree, id_guide } = req.body;

  console.log("Données reçues :", req.body); // Log des données reçues

  // Validation des champs requis
  if (!id_touriste || !id_visite || !date || !duree) {
    return res.status(400).json({ message: "Champs requis manquants.", error: "Données incomplètes" });
  }

  // Logique de la requête SQL
  const sql = `
    INSERT INTO activite_touristique (id_touriste, id_visite, date, duree, id_guide)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [id_touriste, id_visite, date, duree, id_guide || null], (err, result) => {
    if (err) {
      console.error("Erreur SQL :", err); // Log des erreurs SQL
      return res.status(500).json({ message: "Erreur lors de la réservation", error: err.message });
    }

    // Log de la réussite de la requête
    console.log("Réservation enregistrée avec l'ID :", result.insertId);
    res.status(201).json({ message: "Réservation réussie", id: result.insertId });
  });
});





//////   Les reservations 
server.get('/reservation', async (req, res) => {
  const query = `
  SELECT 
  a.id_activite_touristique,
  a.date,
  a.duree,
  a.id_guide,
  t.prenom AS touriste_prenom,
  t.nom AS touriste_nom,
  v.pays AS viste_pays,
  v.ville AS viste_ville,
  v.type AS viste_type,
  v.image AS viste_image,
  v.description AS viste_description,
  g.nom AS guide_nom,
  g.prenom AS guide_prenom
FROM 
  activite_touristique a
JOIN 
  touriste t ON a.id_touriste = t.id_touriste
JOIN 
  viste v ON a.id_visite = v.id_visite
JOIN 
  guide g ON a.id_guide = g.id_guide
  `;
  try {
    const [results] = await con.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error("Erreur lors de la récupération des réservations :", err);
    res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
  }
});





server.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});



}

main().catch(err => console.error(err));
