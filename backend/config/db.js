const mysql = require('mysql2');

/* Connexion à la BDD MySQL */
let db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : process.env.SQL_PASSWORD,
    database : 'groupomania'
});
  
db.connect(function(err) {
    if(err) throw err;
    console.log('Vous êtes bien connecté à la BDD !')
});

module.exports = db;
