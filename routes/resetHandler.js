/**
 * Created by user on 6/9/2017.
 */
/**
 * Created by user on 6/9/2017.
 */

var express = require('express');
var resetRouter = express.Router();

var User = require("../models/user");
var Challenge = require("../models/challenge");
var adminMiddleware = require("../middlewares/adminMiddleware");
module.exports = resetRouter;


resetRouter.use(adminMiddleware);
resetRouter.route("/")
    .delete(function (req,res) {
        console.log("Removing everything...");
        User.remove({"_id" : {$ne : req.cookies.userid}},function () {
            // do nothing
        });
        Challenge.remove({},function () {
            // do nothing
        });
        res.send("Deleted all!");
    });