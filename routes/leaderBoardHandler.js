
var express = require('express');
var leaderBoardRouter = express.Router();
var User = require("../models/user");
var Challenge = require("../models/challenge");

module.exports = leaderBoardRouter;

leaderBoardRouter.route("/")
    .get(function (req,res) {

        var challenges = [];
        Challenge.find({}," -_id -flag -files -description -links -__v").exec(function(err,challengeArray){
            challenges = challengeArray;
        }).then(function() {
            User.find({admin : false}, '-admin -_id -password -email').populate('solves', 'title points -_id')
                .exec(function (err, users) {
                    if (!err)
                        res.send({'challenges': challenges, 'users': users});
                })
        });
    });
