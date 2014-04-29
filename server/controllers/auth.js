var passport =  require('passport')
    , User = require('../models/User.js');

// Establish database connection
var mongo = require('mongodb');

var mongoUri = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://ioyou:ioyou@dbh85.mongolab.com:27857/heroku_app24539980';

var db = mongo.Db.connect(mongoUri, function (error, databaseConnection) {
    db = databaseConnection;
});


module.exports = {
    register: function(req, res, next) {
        try {
            User.validate(req.body);
        }
        catch(err) {
            return res.send(400, err.message);
        }

        User.addUser(req.body.username, req.body.password, req.body.role, function(err, user) {
            if(err === 'UserAlreadyExists') return res.send(403, "User already exists");
            else if(err)                    return res.send(500);

            req.logIn(user, function(err) {
                if(err)     { next(err); }
                else        { res.json(200, { "role": user.role, "username": user.username }); }
            });
        });
    },

    login: function(req, res, next) {
        passport.authenticate('local', function(err, user) {

            if(err)     { return next(err); }
            if(!user)   { return res.send(400); }


            req.logIn(user, function(err) {
                if(err) {
                    return next(err);
                }

                if(req.body.rememberme) req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
                res.json(200, { "role": user.role, "username": user.username });
            });
        })(req, res, next);
    },

    logout: function(req, res) {
        req.logout();
        res.send(200);
    },

    newTransaction: function(req, res) {
        if (req.body.payer && req.body.payee && req.body.amount && req.body.reason) {
            db.collection('ioyou', function(er, collection) {
                collection.insert({"payer" : req.query.payer, "payee" : req.query.payee, "amount" : req.query.amount, "reason" : req.query.reason }, function(err, result) { 
                });
            });
            res.send(200);
        }
        else
            res.send(400);
    }
};
