const db = require('../config/db');
const fs = require('fs')

/* Fonction permettant de créer un post*/
exports.postCreate = (req, res) => {
    if(!req.body.postTxt) return res.status(400).send(new Error('Bad Request'));
    // Récupère l'image et le nom de l'utilisateur qui as crée le post
    const userId = req.body.userId;
    // Déroulement si le post ne contient pas d'image
    if(!req.body.postPic) {
        db.query("SELECT utilisateurPicture, utilisateurFirstName, utilisateurLastName FROM utilisateur WHERE utilisateurId=?", [userId], function (err, picture) {
            if(err) throw err;
            let profilePicture = '';
            let name = '';
            for(let image of picture) {
                profilePicture = image.utilisateurPicture;
                name = image.utilisateurFirstName + ', ' + image.utilisateurLastName;
            }
            // Insère le noveau post dans la BDD
            const text = req.body.postTxt;
            db.query("INSERT INTO post (postTxt, postUserId, postUserPicture, postUserName) VALUES (?, ?, ?, ?);", [text, userId, profilePicture, name], function(err) {
                if(err) throw err;
                return res.status(201).json({ message: 'Votre post as bien été crée !' })
            })
        });
    // Déroulement si le post contient une image
    } else {
        db.query("SELECT utilisateurPicture, utilisateurFirstName, utilisateurLastName FROM utilisateur WHERE utilisateurId=?", [userId], function (err, picture) {
            if(err) throw err;
            let profilePicture = '';
            let name = '';
            for(let image of picture) {
                profilePicture = image.utilisateurPicture;
                name = image.utilisateurFirstName + ', ' + image.utilisateurLastName;
            }
            // Insère le noveau post dans la BDD
            const text = req.body.postTxt;
            let pic = null;
            if(req.body.postPic !== '') pic = `${req.protocol}://${req.get('host')}/images/${req.body.postPic}`;
            db.query("INSERT INTO post (postTxt, postUserId, postImg, postUserPicture, postUserName) VALUES (?, ?, ?, ?, ?);", [text, userId, pic, profilePicture, name], function(err) {
                if(err) throw err;
                return res.status(201).json({ message: 'Votre post as bien été crée !' })
            })
        });
    }
}

/* Fonction permettant de récupérer les posts */
exports.getAllPosts = (req, res) => {
    // Récupère des posts particulier si on a utilisé la barre de recherche
    if(req.params.q) {
        let filter = req.params.q;
        db.query("SELECT postId, postTxt, postImg, postUserPicture, DATE(postDate) as postDate, postUserName, postUserId FROM post WHERE MATCH(postTxt, postUserName) AGAINST(?);", [filter], function(err, result) {
            if(err) throw err;
            return res.status(200).json(result);
        });
    } else {
        // Récupère le text de chaque post du plus récent au plus ancien
        db.query("SELECT postId, postTxt, postImg, postUserPicture, DATE(postDate) as postDate, postUserName, postUserId FROM post ORDER BY postId DESC LIMIT 10;", function(err, result) {
            if(err) throw err;
            return res.status(200).json(result);
        });
    }
}

/* Fonction pemettant de supprimer un post */
exports.deletePost = (req, res) => {
    const id = req.body.postId;
    db.query("SELECT postImg, postUserId FROM post WHERE postId =?", [id], function(err, result) {
        if (err) throw err;
        // On supprime l'image si il y'en as une
        for(let value of result) {
            if(value.postImg === null) {
                console.log('Il n\'y as pas d\'image')
            } else {
                const filename = value.postImg.split('/images/')[1];
                fs.unlink(`images/${filename}`, (err => {
                    if(err) console.log(err)
                }));
            }

        // Vérifie que la personne qui essaie de supprimer le post est bien l'utilisateur qui l'as crée
        if(req.body.userId == 70) {
            // L'admin as le droit de supprimer tous les posts
            db.query("DELETE FROM post WHERE postId =?", [id], function(err) {
                if(err) throw err;
                return res.status(200).json({ message: 'Votre post a bien été supprimé !' })
            })
        } else if(value.postUserId != req.body.userId) {
            // Si ce n'est pas le cas renvois une erreur
            res.status(401).json({ error: 'Vous n\'êtes pas autorisé à supprimer ce post !' })
        } else {
            // Sinon supprime le post
            db.query("DELETE FROM post WHERE postId =?", [id], function(err) {
                if(err) throw err;
                return res.status(200).json({ message: 'Votre post a bien été supprimé !' })
            })
        }
        }
    })
}