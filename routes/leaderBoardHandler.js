
var express = require('express');
var leaderBoardRouter = express.Router();
var User = require("../models/user");
var Challenge = require("../models/challenge");

module.exports = leaderBoardRouter;

leaderBoardRouter.route("/")
    .get(function (req,res) {
        // also sort based on total score.
        var challenges = [];
        Challenge.find({},"-_id -flag -files -description -links -__v").exec(function(err,challengeArray){
            challenges = challengeArray;
        }).then(function() {
            User.find({admin : false}, '-admin -_id -password -email').populate('solves', '-flag -_id -description -category -files -links -__v')
                .exec(function (err, users) {
                    if (!err)
                        res.send({'challenges': challenges, 'users': users});
                        console.log({'challenges': challenges, 'users': users});
                })
        });
    });
