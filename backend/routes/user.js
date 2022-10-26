// Ajout de plugin externe nécessaire pour utiliser le router d'Express

const express = require('express');

const router = express.Router();

const userCtrl = require('../controllers/user');

const checkPassword = require("../middleware/check-password");
const checkEmail = require("../middleware/check-email");

// Création des routes Inscription et Connexion de l'API avec les middlewares
// et les controllers d'authentification et de sécurité qui leur sont appliquées

// Chiffre le mot de passe de l'utilisateur, ajoute l'utilisateur à la base dedonnées
router.post('/signup', checkEmail, checkPassword, userCtrl.signup);// Crée un nouvel utilisateur
// Vérifie les informations d'identification de l'utilisateur, enrenvoyant l'identifiant userID depuis la base de données et un TokenWeb JSON signé(contenant également l'identifiant userID)

router.post('/login', userCtrl.login); // Connecte un utilisateur


module.exports = router;