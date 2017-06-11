/**
 * Created by user on 6/9/2017.
 */

var express = require('express');
var userRouter = express.Router();

module.exports = userRouter;

userRouter.route("/")
    .post(function (req,res) {
        res.clearCookie("userid").send("logging you out!");
        // clear all the cookies!
    });
