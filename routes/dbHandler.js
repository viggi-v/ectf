var express = require('express');

var adminMiddleware = require("../middlewares/adminMiddleware");

var Challenge = require('../models/challenge');
var User = require('../models/user');

var dbRouter = express.Router();
module.exports = dbRouter;

dbRouter.route("/")
    .get(adminMiddleware,function(req,res){
        // return the entire data out.
        var Users = [];
        User.find({}).exec(function(err,users){
            if(!err){
                Users = users;
            }
        }).then(function() {
            Challenge.find({}, function (err,challenges) {
                if(!err){
                    res.send({'users' : Users, 'challenges' : challenges})
                }
                else res.send("Error" + err);
            });
        });
    })
    .post(adminMiddleware,function(req,res){
        var users = req.body.users;
        var challenges = req.body.challenges;
        var errString = '';
        users.forEach(function(obj){
            var newUser = new User(obj);
            newUser.save(function(err){
                if(err) {
                    errString += err;
                }
            });
        });
        challenges.forEach(function(obj){
            var newChallenge = new Challenge(obj);
//            newChallenge.link = newChallenge.title.trim.replace(/[^a-zA-Z0-9_]/gi,'');
//            console.log(newChallenge.link);
            newChallenge.save(function(err){
                if(err) {
                    errString += err;
                }
            });
        });
        if(errString)
            res.send(errString);
        else res.send("Inserted Successfully");
    });