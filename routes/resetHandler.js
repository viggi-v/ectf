/**
 * Created by user on 6/9/2017.
 */
/**
 * Created by user on 6/9/2017.
 */

var express = require('express');
var resetRouter = express.Router();

var User = require("../models/user");
var Posts = require("../models/post");
var adminMiddleware = require("../middlewares/adminMiddleware");
module.exports = resetRouter;


resetRouter.use(adminMiddleware);
resetRouter.route("/")
    .delete(function (req,res) {
        console.log("Removing everything...");
        User.remove({},function () {
            // do nothing
        });
        Posts.remove({},function () {
            // do nothing
        });
    });