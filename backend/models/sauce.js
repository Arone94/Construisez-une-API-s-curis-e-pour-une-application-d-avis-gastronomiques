// On importe mongoose

const mongoose = require('mongoose');
// Appel le middleware de validation des champs du model de la sauce
const sauceValidation = require('../middleware/check-sauce-input');

// Création d'un schema mangoose pour que les données de la base MongoDB ne puissent pas différer de
//L'id est généré automatiquement par MongoDB
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: { type: [ "String <userId>" ] },
  usersDisliked: { type: [ "String <userId>" ] },
});

// On exporte ce shéma de données
module.exports = mongoose.model('sauce', sauceSchema);

