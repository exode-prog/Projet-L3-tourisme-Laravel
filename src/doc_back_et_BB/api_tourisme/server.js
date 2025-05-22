/*
//Importation des modules du projet
const express = require('express')
const mysql = require('mysql2')
const bodyParser = require('body-parser')

const bcrypt = require('bcrypt') //pour le shage du mot de passe

//On initialise le projet

const server = express()

const PORT = 4000 //on initialise le port


server.use(bodyParser.json())

//Configuration de la connexion a la base de donnees

const   db = mysql.createConnection({
	host : '192.168.1.99',
	user : 'exode',
	password : 'passer',
	database : 'tourisme'



})
//Gestion  en cas d erreurs

	db.connect((err)=>{
		if(err){
			console.error('Il y a une erreur quelque part pendant la connexion a la base :',err)
			process.exit(1);

	}

		console.log('Connexion reussie a la base de donnees')
})


//------------------------------------------------------Table des touristes----------------------------------------------------------------------------

//Afficage des touristes
server.get('/touriste',(req,res)=>{
	db.query('select * from touriste',(err,results)=>{
		if (err){
			return res.status(500).json({ message: 'Erreur pendant la recuperation'})

		}
		res.json(results)

	})

})

//Affichage d'un touriste par son nom ou prenom

//On recherche le touriste par son prenom ou nom

server.get('/touriste/:motcle', (req, res) => {
    const { motcle } = req.params;
    const search = `%${motcle}%`; // pas besoin de .toLowerCase() avec COLLATE

    const query =` 
        SELECT * FROM touriste
        WHERE prenom COLLATE utf8mb4_general_ci LIKE ?
        OR nom COLLATE utf8mb4_general_ci LIKE ?
    `

    db.query(query, [search, search], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur serveur.', error: err })
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Aucun touriste trouvé.' })
        }
        res.json(results)
    })
})

*/

//Insertion des touristes
/*server.post('/touriste', async (req, res) => {
    const { prenom, nom, numero, password, email, adresse } = req.body;

    if (!prenom || !nom || !numero || !password || !email || adresse === undefined) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // 10 = niveau de complexité (cost)
        const query = 'INSERT INTO touriste (prenom, nom, numero, email, adresse,password) VALUES (?, ?, ?, ?, ?, ?)';

        db.query(query, [prenom, nom, numero, email, adresse,hashedPassword,], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur lors de l\'ajout du client.' })
            }

            res.status(201).json({ 
                id: result.insertId,
                prenom, nom, numero, email, adresse  //  Ne pas renvoyer le password (même haché)
            })
        })
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur lors du hachage.' })
    }
})*/





// Importation des modules du projet
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors'); // ✅ Ajouté

// Initialisation de l'application
const server = express();
const PORT = 4000;

// Configuration CORS 🔧
server.use(cors({
  origin: 'http://192.168.1.99:3001', // Autoriser ton frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// Gérer aussi les requêtes OPTIONS pré-vol (preflight)
server.options('*', cors());

// Middlewares
server.use(bodyParser.json());

// Connexion à la base de données
const db = mysql.createConnection({
  host: '192.168.1.99',
  user: 'exode',
  password: 'passer',
  database: 'tourisme'
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base :', err);
    process.exit(1);
  }
  console.log('Connexion réussie à la base de données');
});

// Route POST pour l'inscription
server.post('/touriste', async (req, res) => {
  console.log("Requête reçue:", req.body);

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
    res.status(500).json({ message: 'Erreur serveur lors du hachage.' });
  }
});























//Mettre a jour les informations du touriste
server.put('/touriste/:email', async (req, res) => {
    const { email } = req.params;
    const { prenom, nom, numero, password, adresse, ancienPassword } = req.body;

    if (!prenom || !nom || !numero || !password || !adresse || !ancienPassword) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires, y compris l\'ancien mot de passe.' });
    }

    try {
        // 1. Récupérer le mot de passe actuel depuis la base
        db.query('SELECT password FROM touriste WHERE email = ?', [email], async (err, results) => {
            if (err || results.length === 0) {
                return res.status(404).json({ message: 'Utilisateur introuvable.' })
           }

            const motDePasseActuel = results[0].password

            // 2. Comparer l'ancien mot de passe avec celui dans la base
            const match = await bcrypt.compare(ancienPassword, motDePasseActuel)
            if (!match) {
                return res.status(401).json({ message: 'Email ou mot de passe incorrect .' }) // Ancien mot de passe incorrect
            }

            // 3. Hasher le nouveau mot de passe
            const nouveauMdpHache = await bcrypt.hash(password, 10);

            // 4. Effectuer la mise à jour
            const updateQuery = `
                UPDATE touriste 
                SET prenom = ?, nom = ?, numero = ?, password = ?, adresse = ?
                WHERE email = ?
            `;

            db.query(updateQuery, [prenom, nom, numero, nouveauMdpHache, adresse, email], (errUpdate) => {
                if (errUpdate) {
                    return res.status(500).json({ message: 'Erreur lors de la mise à jour.' })
                }

                res.json({ message: 'Profile mis à jour avec succès.' })
            })
	})
        
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur.' })
    }
})
 

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





//--------------------------Gestion des guides---------------------------


//Afficage des guides
server.get('/guide',(req,res)=>{
        db.query('select * from guide',(err,results)=>{
                if (err){
                        return res.status(500).json({ message: 'Erreur pendant la recuperation'})

                }
                res.json(results)

        })

})

//Affichage d'un guide par son nom ou prenom

//On recherche le guide par son prenom ou nom

server.get('/guide/:motcle', (req, res) => {
    const { motcle } = req.params;
    const search = `%${motcle}%`; // pas besoin de .toLowerCase() avec COLLATE

    const query =`
        SELECT * FROM guide
        WHERE prenom COLLATE utf8mb4_general_ci LIKE ?
        OR nom COLLATE utf8mb4_general_ci LIKE ?
    `

    db.query(query, [search, search], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur serveur.', error: err })
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Aucun guide trouvé.' })
        }
        res.json(results)
    })
})

//Insertion des guides
server.post('/guide', async (req, res) => {
    const { prenom, nom, numero, email,password, specialite,commentaire } = req.body;

    if (!prenom || !nom || !numero || !email || !password || !specialite || !commentaire  === undefined) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // 10 = niveau de complexité (cost)
        const query = 'INSERT INTO guide (prenom, nom, numero, email,password,specialite,commentaire) VALUES (?, ?, ?, ?, ?, ?,?)';

        db.query(query, [prenom, nom, numero,email, hashedPassword, specialite, commentaire], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur lors de l\'ajout du client.' })
            }

            res.status(201).json({
                id: result.insertId,
                prenom, nom, numero, email, specialite,commentaire  //  Ne pas renvoyer le password (même haché)
            })
        })
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur lors du hachage.' })
    }
})


//Mettre a jour les informations du touriste
server.put('/guide/:email', async (req, res) => {
    const { email } = req.params;
    const { prenom, nom, numero, password, ancienPassword } = req.body;

    if (!prenom || !nom || !numero || !password || !ancienPassword) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires, y compris l\'ancien mot de passe.' });
    }

    try {
        // 1. Récupérer le mot de passe actuel depuis la base
        db.query('SELECT password FROM guide WHERE email = ?', [email], async (err, results) => {
            if (err || results.length === 0) {
                return res.status(404).json({ message: 'Utilisateur introuvable.' })
           }
            const motDePasseActuel = results[0].password

            // 2. Comparer l'ancien mot de passe avec celui dans la base
            const match = await bcrypt.compare(ancienPassword, motDePasseActuel)
            if (!match) {
                return res.status(401).json({ message: 'Email ou mot de passe incorrect .' }) // Ancien mot de passe incorrect
            }

            // 3. Hasher le nouveau mot de passe
            const nouveauMdpHache = await bcrypt.hash(password, 10);

            // 4. Effectuer la mise à jour
            const updateQuery = `
                UPDATE guide
                SET prenom = ?, nom = ?, numero = ?, password = ?
                WHERE email = ?
            `;

            db.query(updateQuery, [prenom, nom, numero, nouveauMdpHache, email], (errUpdate) => {
                if (errUpdate) {
                    return res.status(500).json({ message: 'Erreur lors de la mise à jour.' })
                }

                res.json({ message: 'Profile mis à jour avec succès.' })
            })
        })
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur.' })
    }
})


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


//***********************************Gestion des visites***********************************


//Afficage des des lieux de visites
server.get('/visite',(req,res)=>{
        db.query('select * from viste',(err,results)=>{
                if (err){
                        return res.status(500).json({ message: 'Erreur pendant la recuperation'})

                }
                res.json(results)

        })

})

//Affichage d'un lieu touristique par le nom du pays

//On recherche le guide par son prenom ou nom

server.get('/visite/:motcle', (req, res) => {
    const { motcle } = req.params;
    const search = `%${motcle}%`; // pas besoin de .toLowerCase() avec COLLATE

    const query =`
        SELECT * FROM viste
        WHERE pays COLLATE utf8mb4_general_ci LIKE ?
        OR ville COLLATE utf8mb4_general_ci LIKE ?
    `;

    db.query(query, [search, search], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur serveur.', error: err })
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Aucun lieu trouvé.' })
        }
        res.json(results)
    })
})



//Insertion des visites
server.post('/visite', async (req, res) => {
    const { pays, ville,type,image, description} = req.body;

    if (!pays || !ville || !type || !image || !description   === undefined) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    try {
        
        const query = 'INSERT INTO viste (pays,ville,type,image,description) VALUES (?, ?, ?, ?, ?)';

        db.query(query, [pays,ville,type,image,description], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur lors de l\'ajout de la visite.' })
            }

            res.status(201).json({
                id: result.insertId,
            pays,ville,type,image,description  //  
	    })
        })
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur lors du hachage.' })
    }
})



//Mettre a jour les informations d'une visite
server.put('/visite/:id', async (req, res) => {
    const { id } = req.params;
    const { pays, ville, type, image, description } = req.body;

    if (!pays || !ville || !type || !image || !description) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    try {
            //  On effectue la mise à jour
            const updateQuery = `
                UPDATE viste
                SET pays = ?, ville = ?, type = ?, image = ?,description = ?
		               WHERE id_visite = ?
            `;

            db.query(updateQuery, [pays, ville, type, image, description,id], (errUpdate) => {
                if (errUpdate) {
                    return res.status(500).json({ message: 'Erreur lors de la mise à jour.' })
                }

                res.json({ message: 'Visite  mise à jour avec succès.' })
            })
        
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur.' })
    }
})


//Suppression d'une visite
server.delete('/visite/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM viste WHERE id_visite = ?', [id], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la suppression de  la visite.' });
        }
        res.status(204).send()
    })
})



//Demarrage du serveur


server.listen(PORT,()=>{
	console.log(`Le serveur est en marche sur http:192.168.1.99:${PORT}`)

})





