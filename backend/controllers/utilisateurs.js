const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* Fonction permettant à un nouvel utilisateur de s'inscrire */
exports.signup = (req, res) => {
    if(!req.body.userData) return res.status(400).send(new Error('Bad Request'));
    const email = req.body.userData.userEmail;
    // Hash le mot de passe avant de l'insérer dans la base de donnée
    const password = bcrypt.hashSync(req.body.userData.userPassword, 10);
    const lastName = req.body.userData.userLastName;
    const firstName = req.body.userData.userFirstName;
    db.query("INSERT INTO utilisateur (utilisateurEmail, utilisateurPassword, utilisateurFirstName, utilisateurLastName) VALUES (?, ?, ?, ?);", [email, password, lastName, firstName], function(err) {
        if(err) throw err;
        return res.status(201).json({ message: "Utilisateur bien ajouté !" });
    });
}


/* Fonction permettant à un utilisateur de se connecter */
exports.login = (req, res) => {
    const email = req.body.loginData.loginEmail;
    const password = req.body.loginData.loginPassword;
    db.query("SELECT * FROM utilisateur WHERE utilisateurEmail = ?;", [email], function(err, result) {
        if(err) throw err;
        // Vérifie si l'utilisateur existe
        if(result.length === 0) {
        console.log('L\'utilisateur n\'existe pas !');
        // Renvois une erreur si l'utilisateur n'existe pas
        return res.status(404).json({ message: 'L\'utilisateur n\'est pas dans la BDD !'});
        } else {
            const getPassword = result[0].utilisateurPassword;
            // Vérifie si le mdp rentré est bien le même que celui de la BDD
            if (bcrypt.compareSync(password, getPassword)) {
                console.log('Connexion réussie !');
                // Si le mdp est bon valide la connexion et renvois un token d'identification
                return res.status(200).json({
                    userId: result.utilisateurId,
                    token: jwt.sign(
                      { userId: result.utilisateurId },
                      'RANDOM_TOKEN_SECRET',
                      { expiresIn: '24h' }
                    )
                });
            } else {
                console.log('Mauvais mot de passe !')
                // Si le mdp n'est pas bon bloque la connexion
                return res.status(400).json({ message: 'Mauvais mot de passe !' });
            }
        }
    });
}