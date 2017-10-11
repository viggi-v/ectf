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
            }).then(function(){
            Challenge.find({}, '-description -flag -files -links')
                .exec(function (err, challenges) {
                    if (err)
                        res.send('Error : ', err);
                    else{
                        var ch = [];//challenges;
                        for(var i = 0; i < challenges.length; i++){
                            console.log(user);
                            if(user && user.solves.length > 0) ch[i]= {data : challenges[i],solved : user.solves.indexOf(challenges[i]._id) > -1};
                            else ch[i] = {data : challenges[i],solved :false}
                        }
                        res.send(ch);
                    }
                });
            });
    });

challengeRouter.route('/challenge/:challengeLink')
    .get(userMiddleware,function (req,res) {
        // todo
        // return problem statement and links of a particular challenge,
        Challenge.find({"link" : req.params.challengeLink},'-flag').exec(function(err,challenge){
            if(err)
                res.send("Error : ", err);
            else
                res.send(challenge);
        });
    })
    .post(userMiddleware,function(req,res){
        // this is where we submit the flag.
        // todo improve the security
        var flag = req.body.flag;
        console.log(req.body);
        Challenge.findOne({'link' : req.params.challengeLink},function(err,challenge){
            console.log(challenge.flag + " and " + flag);
            if(challenge.flag === flag){
                User.findOne({"_id":req.cookies.userid},function(err,user){
                    if(!err){
                        if(user.solves.indexOf(challenge._id) === -1) {
                            user.solves.push(challenge._id);
                            user.save(function () {
                                res.send({"solved" : true});
                            });
                        }
                        else{
                            res.send({"solved" : false});
                        }
                    }
                });
            }

            else
                res.send({"solved" : false});
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
                challenge.files = req.body.files;
                challenge.links = req.body.links;

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