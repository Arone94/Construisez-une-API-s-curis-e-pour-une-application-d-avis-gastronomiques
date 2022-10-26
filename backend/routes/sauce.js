// Ajout de plugin externe nécessaire pour utiliser le router d'Express
const express = require('express');
// Appel du routeur avec la méthode mise à disposition par Express
const router = express.Router();

// Ajout des middleweares
// On importe le middleware auth pour sécuriser les routes
const auth = require('../middleware/auth');
//On importe le middleware multer pour la gestion des images
const multer = require('../middleware/multer-config');
const checkSauceInput = require("../middleware/check-sauce-input");
const sauceCtrl = require('../controllers/sauce');

// En exportant dans le controller la logique métier, les fonctions, on voit plus clairement quelles sont les routes dont on dispose
// On a quelque chose de plus modulaire plus facile à comprendre et plus facile à maintenir

// Création des différentes ROUTES de l'API en leurs précisant, dans l'ordre, leurs middlewares et controllers
// Routes CRUD (create, read, update and delete)
router.get('/', auth, sauceCtrl.getAllSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, checkSauceInput, sauceCtrl.createSauce);
router.put('/:id', auth, multer, checkSauceInput, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeOrNot)

module.exports = router;