const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

// On crée notre schéma de données pour créer un utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// On utilise le plugin uniqueValidator pour garantir un email unique
userSchema.plugin(uniqueValidator);

// On exporte ce schéma sous forme de modèle : le modèle s'appellera user et on lui passe le shéma de données
module.exports = mongoose.model('User', userSchema);