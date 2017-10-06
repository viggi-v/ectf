/**
 * Created by user on 10/1/2017.
 */

var express = require('express');

var adminMiddleware = require("../middlewares/adminMiddleware");
var userMiddleware = require("../middlewares/userMiddleware");

var Challenge = require('../models/challenge');
var User = require('../models/user');

var challengeRouter = express.Router();

challengeRouter.route('/')
    .get(function(req,res){
        var user = {};
        User.findOne({"_id" : req.cookies.userid},function(err,userObj){
            user = userObj;
        })
            .then(function(){
            Challenge.find({}, '-description -flag -files -links')
                .exec(function (err, challenges) {
                    if (err)
                        res.send('Error : ', err);
                    else{
                        var ch = [];//challenges;
                        for(var i = 0; i < challenges.length; i++){
                            ch[i]= {data : challenges[i],solved : user.solves.indexOf(challenges[i]._id) > -1};
                        }
                        res.send(ch);
                    }
                });
            });
    });

challengeRouter.route('/challenge/:challengeTitle')
    .get(userMiddleware,function (req,res) {
        // todo
        // return problem statement and links of a particular challenge,
        Challenge.find({"title" : req.params.challengeTitle},'-flag').exec(function(err,challenge){
            if(err)
                res.send("Error : ", err);
            else
                res.send(challenge);
        });
    })
    .post(userMiddleware,function(req,res){
        // this is where we submit the flag.
        // todo improve the security
        console.log("it's here!");
        var flag = req.body.flag;
        Challenge.findOne({'title' : req.params.challengeTitle},function(err,challenge){
            if(challenge.flag === flag){
                // todo change the cookie name later
                User.findOne({"_id":req.cookies.userid},function(err,user){
                    if(!err){
                        if(user.solves.indexOf(challenge._id) === -1) {
                            user.solves.push(challenge._id);
                            user.save(function () {
                                res.send("Flag correct! point added!");
                            });
                        }
                        else{
                            res.send("already solved!");
                        }
                    }
                });
            }

            else
                res.send("Better luck next time!!")
        });
    });
challengeRouter.route('/admin')
    .get(adminMiddleware,function (req,res) {
        Challenge.find({},'-files -links -description -flag')
            .exec(function(err,challenges){
                if(err)
                    res.send('Error : ',err);
                else
                    res.send(challenges);
            })
    })
    .post(adminMiddleware,function (req,res) {
        var challengeData = req.body;
        var newChallenge = new Challenge(challengeData);
        newChallenge.save(function(err,challenge){
            if(err)
                res.send('Error : '+err);
            else
                res.send('Challenge inserted!')
            });
        });

challengeRouter.route('/admin/:challengeId')
    .get(adminMiddleware,function(req,res){
        Challenge.findOne({"_id" : req.params.challengeId},function(err,challenge){
                if(err)
                    res.send("Error : ", err);
                else
                    res.send(challenge);
            });
        })
    .post(adminMiddleware,function (req,res) {
        Challenge.findOne({"_id" : req.params.challengeId},function(err,challenge){
            if(!err){
                console.log(challenge);
                challenge.title = req.body.title;
                challenge.points = req.body.points;
                challenge.category = req.body.category;
                challenge.description = req.body.description;
                challenge.flag = req.body.flag;
                challenge.save(function(er){
                    if(!er)
                        res.send("Success");
                    else res.send("DB Error : "+er);
                });
            }
            else
                res.send("DB Error:"+err);
        });
    })
    .delete(adminMiddleware,function(req,res){
        Challenge.remove({"_id":req.params.challengeId},function(err){
            if(err)
                res.send("error "+err);
            else res.send("Challenge Deleted");
        });
    });

module.exports = challengeRouter;