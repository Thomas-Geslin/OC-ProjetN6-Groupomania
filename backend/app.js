const express = require('express');
require('dotenv').config();

const utilisateurRoutes = require('./routes/utilisateurs');
const postRoutes = require('./routes/posts');
const path = require('path');

const app = express();
app.use(express.json());

/* Fonction pemrettant de désactiver la sécurité CROS */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/utilisateur', utilisateurRoutes);
app.use('/api/post', postRoutes);

module.exports = app;