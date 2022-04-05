const db = require('../config/db');

/* Fonction permettant de créer un post*/
exports.postCreate = (req, res) => {
    if(!req.body.postTxt) return res.status(400).send(new Error('Bad Request'));
    // Récupère l'image et le nom de l'utilisateur qui as crée le post
    const userId = req.body.userId;
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

/* Fonction permettant de récupérer les posts */
exports.getAllPosts = (req, res) => {
    // Récupère le text de chaque post du plus récent au plus ancien
    db.query("SELECT postTxt, postImg, postUserPicture, postDate, postUserName FROM post ORDER BY postId DESC LIMIT 10;", function(err, result) {
        if(err) throw err;
        return res.status(200).json(result);
    });
}