// App.js fait appel aux différentes fonctions implémentées dans l'APi : Accès aux images, aux route User, aux route Sauce

// import des modules npm - Ajout des plugins externes
const express = require('express');

// utilisation du module 'helmet' pour la sécurité en protégeant l'application de certaines vulnérabilités
// il sécurise nos requêtes HTTP, sécurise les en-têtes, contrôle la prélecture DNS du navigateur, empêche le détournement de clics
// et ajoute une protection XSS mineure et protège contre le reniflement de TYPE MIME
// cross-site scripting, sniffing et clickjacking
const helmet = require('helmet');
const session = require('cookie-session');
const nocache = require('nocache');

// Pour gérer la demande POST provenant de l'application front-end, nous devrons être capables d'extraire l'objet JSON de la demande, on importe donc body-parser

const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const path = require('path');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// utilisation du module 'dotenv' pour masquer les informations de connexion à la base de données à l'aide de variables d'environnement
require('dotenv').config();

// Connexion à la base de données MongoDB
mongoose.connect(process.env.DB_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
 
const app = express();
app.use(express.json());

// Middleware Header pour contourner les erreurs en débloquant certains systèmes de sécurité CORS, afin que tout le monde puisse faire des requetes depuis son navigateur

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Protection XSS

app.use(helmet.xssFilter());


// Options pour sécuriser les cookies
const expiryDate = new Date(Date.now() + 3600000); // 1 heure (60 * 60 * 1000)
app.use(session({
  name: 'session',
  secret: process.env.SEC_SES,
  cookie: {
    secure: true,
    httpOnly: true,
    domain: 'http://localhost:3000',
    expires: expiryDate
  }
}));

// Middleware qui permet de parser les requêtes envoyées par le client, on peut y accéder grâce à req.body
app.use(bodyParser.urlencoded({
  extended: true
}));

// Transforme les données arrivant de la requête POST en un objet JSON facilement exploitable

app.use(bodyParser.json());



//Désactive la mise en cache du navigateur
app.use(nocache());

// Gestion de la ressource image de façon statique
// Midleware qui permet de charger les fichiers qui sont dans le repertoire images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Va servir les routes dédiées aux sauces
app.use('/api/sauces', sauceRoutes);

// Va servir les routes dédiées aux utilisateurs
app.use('/api/auth', userRoutes);

// Export de l'application express pour déclaration dans server.js
module.exports = app;