const db = require('../config/db');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* Fonction permettant à un nouvel utilisateur de s'inscrire */
exports.signup = (req, res) => {
    if(!req.body.userData) return res.status(400).send(new Error('Bad Request'));
    const email = req.body.userData.userEmail;
    // Hash le mot de passe avant de l'insérer dans la base de donnée
    const password = bcrypt.hashSync(req.body.userData.userPassword, 10);
    const picture = `${req.protocol}://${req.get('host')}/images/${req.body.userData.userPicture}`;
    const lastName = req.body.userData.userLastName;
    const firstName = req.body.userData.userFirstName;
    db.query("SELECT utilisateurEmail FROM utilisateur WHERE utilisateurEmail=?", [email], function(err, result) {
        if(err) throw err;
        if(result.length === 1) {
            return res.status(401).json({ message: 'Cet utilisateur existe déjà !' })
        } else {
            db.query("INSERT INTO utilisateur (utilisateurEmail, utilisateurPassword, utilisateurPicture, utilisateurFirstName, utilisateurLastName) VALUES (?, ?, ?, ?, ?);", [email, password, picture, lastName, firstName], function(err) {
                if(err) throw err;
                return res.status(201).json({ message: "Utilisateur bien ajouté !" });
            });
        }
    })
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
                    userId: result[0].utilisateurId,
                    token: jwt.sign(
                        { id: result[0].utilisateurId },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '2h' }
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

/* Fonction permettant de récupérer tous les utilisateurs */
exports.getAllUser = (req, res) => {
    db.query("SELECT * FROM utilisateur ORDER BY utilisateurId DESC LIMIT 3 ", function(err, result) {
        if(err) throw err;
        return res.status(200).json(result);
    })
}

/* Fonction permettant de récupérer l'utilisateur' */
exports.getUser = (req, res) => {
    const id = req.body.id;
    db.query("SELECT * FROM utilisateur WHERE utilisateurId = ?;", [id], function(err, result) {
        if(err) throw err;
        return res.status(200).json(result)
    });
}

/* Fonction permettant de renvoyer si un utilisateur est admin ou non */
exports.isAdmin = (req, res) => {
    const id = req.params.id;
    db.query("SELECT utilisateurIsAdmin FROM utilisateur WHERE utilisateurId = ?;", [id], function(err, result) {
        if(err) throw err;
        return res.status(200).json(result)
    });
}

/* Fonction permettant de modifier un utilisateur */
exports.modifyUser = (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const id = req.body.id;
    if(firstName.length === 0 || lastName.length === 0) return res.status(400).json({error: 'Merci de rentrez un nouveau nom !'});
    // Modifie l'utilisateur
    db.query("UPDATE utilisateur SET utilisateurFirstName=?, utilisateurLastName=? WHERE utilisateurId =?", [firstName, lastName, id], function(err) {
        if(err) throw err;
        return res.status(200).json({ message: 'Votre compte a bien été modifié !' });
    })
}

/* Fonction permettant de supprimer un utilisateur */
exports.deleteUser = (req, res) => {
    const id = req.body.userId;
    // Supprime le profil de l'utilisateur et sa photo de profil
    db.query("SELECT utilisateurPicture FROM utilisateur WHERE utilisateurId = ?", [id], function(err, result) {
        if (err) throw err;
        for(let value of result) {
        const filename = value.utilisateurPicture.split('/images/')[1];
        // Supprime l'image de l'utilisateur
            fs.unlink(`images/${filename}`, (err => { if(err) console.log(err) }));
        }
    })
    // Supprime l'utilisateur
    db.query("DELETE FROM utilisateur WHERE utilisateurId =?", [id], function(err) {
        if(err) throw err;
        return res.status(200).json({ message: 'Votre compte a bien été supprimé !' })
    })

    // Supprime les posts de l'utilisateur et les images de ses posts
    db.query("SELECT postImg FROM post WHERE postUserId = ?", [id], function(err, result) {
        if (err) throw err;
        for(let image of result) {
        if(image.postImg === 'http://localhost:3000/images/undefined') {
            console.log('Ce post ne contient pas d\'image')
        } else {
            const filename = image.postImg.split('/images/')[1];
            // Supprime les images des posts
                fs.unlink(`images/${filename}`, (err => { if(err) console.log(err) }));
            }
        }
    })
    // Supprime les posts de l'utilisateur
    db.query("DELETE FROM post WHERE postUserId =?", [id], function(err) {
        if(err) throw err;
    })
}
