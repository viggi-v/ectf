/**
 * Created by user on 6/9/2017.
 */
var User = require("../models/user");
var userMiddleWare = function (req,res,next) {
    // checks if the user is logged in, and re routes
    if(req.cookies.userid){
        User.findOne({"_id":req.cookies.userid}, function (err,user) {
            if(err || !user){
                res.send("Invaild/Corrupt cookie : Log in again");
            }
            else{
                next();
            }
        })
    }
    else
        res.send("You must be logged in to access this route");
};

module.exports = userMiddleWare;