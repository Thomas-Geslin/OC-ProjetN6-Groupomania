const express = require('express');

const utilisateurRoutes = require('./routes/utilisateurs');

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

app.use('/api/utilisateur', utilisateurRoutes);

module.exports = app;