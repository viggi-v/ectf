/**
 * Created by user on 6/9/2017.
 */
var User =require("../models/user");

var adminMiddleware = function () {
    if(res.cookies.username){
        User.findOne({"_id":res.cookies.id},function(err,user){
            if(err || !user || !user.admin){
                res.send("You don't have the privilege to access this route");
            }
            else{
                next();
            }
        });
    }
    else{
        res.send("You must login from an admin account to access this route");
    }
}
module.exports = adminMiddleware;