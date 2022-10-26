// On utilise bcrypt pour hasher le mot de passe des utilisateurs

const bcrypt = require('bcrypt');

// On récupère notre model User ,créer avec le schéma mongoose

const User = require('../models/user');

// On utilise le package jsonwebtoken pour attribuer un token à un utilisateur au moment ou il se connecte

const jwt = require('jsonwebtoken');

// On sauvegarde un nouvel utilisateur et crypte son mot de passe avec un hash généré par bcrypt

exports.signup = (req, res, next) => {
      // On appelle la méthode hash de bcrypt et on lui passe le mdp de l'utilisateur, le salte (10) ce sera le nombre de tours qu'on fait faire à l'algorithme

    bcrypt.hash(req.body.password, 10)
    .then( hash => {
        // Création du nouvel utilisateur avec le model mongoose

        const user = new User ({
        // On passe l'email qu'on trouve dans le corps de la requête

            email: req.body.email,
        // On récupère le mdp hashé de bcrypt

            password: hash
        });
        // On enregistre l'utilisateur dans la base de données

        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        // Si il existe déjà un utilisateur avec cette adresse email
        .catch(error => res.status(400).json({ error }));
        
    })
    .catch(error => res.status(500).json({ error }));

};

// Le Middleware pour la connexion d'un utilisateur vérifie si l'utilisateur existe dans la base MongoDB lors du login
//si oui il vérifie son mot de passe, s'il est bon il renvoie un TOKEN contenant l'id de l'utilisateur, sinon il renvoie une erreur

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            // On utilise bcrypt pour comparer les hashs et savoir si ils ont la même string d'origine
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id},
                            'RANDOM_TOKEN_SECRET', // Clé d'encodage du token
                            { expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };