/**
 * Created by Vighnesh on 6/9/2017.
 */

var User = require("../models/user");
var AES = require("crypto-js/AES");
var properties = require("../bin/properties");
var express = require('express');
var userMiddleWare = require("../middlewares/userMiddleware");
var userRouter = express.Router();

var authForAdmin = require("../middlewares/adminAuth");

module.exports = userRouter;

userRouter.route("/")
    .get(userMiddleWare,function(req,res){
        // returns all users
        // returns an array of objs, with name and link.
        var response = {};
        var query = User.find({},'username name -_id');
        query.exec(function (err, users) {
            if(err){
                response.errorCode = "DB Error: "+ err;
            }
            else{
                response.errorCode = '';
                response.data = users;
            }
            res.send(response);
        })
    })
    .post(function(req,res) {
        // register a new user
        // returns status after insertion
        var response = {};
        var userData = req.body;
        var newUser = new User(userData);
        var adminAuth = authForAdmin(userData);
        if(adminAuth) {
            newUser.save(function (err, user) {
                if (err) {
                    response.errorCode = "DB Error: " + err;
                }
                else {
                    response.status = "Insert Successful";
                    if(userData.admin)
                        response.status +=", you fuckin admin!";
                }
                res.send(response);
            });
        }
        else{
            response.errorCode = "Invalid Admin Key";
            res.send(response);
        }
    });
userRouter.route("/:username")
    .get(userMiddleWare,function (req,res) {
        // returns full details of a specific user with userName.
        var response = {};
        var query = User.findOne({username : req.params.username},'-password -id');
        query.exec(function(err,obj){
            if(err){
                response.errorCode = "DB Error: "+ err;
            }
            else{
                response.data = obj;
            }
            res.send(obj);
        });
    })
    .post(function (req,res) {
        // authenticates the user.
        var username = req.params.username;
        var password = req.body.password;
        var response = {};

        response.statusText = "";

        User.findOne({username : username},function(err,user){
            // Sorry for the long if-else thingy

            if(err){
                response.statusText = "DB Error: "+err;
                res.send(response);
            }
            else{
                if(user){
                    // A user found, let's check if passwords match

                    if(user.password === password){ // change to encrypted one later
                        response.statusText = "Success";

                        res.cookie('userid',user._id,{
                            expire : new Date() + 7*86400 // for a day
                        }).send(response);
                    }
                    else{
                        response.statusText = "Invalid Password";
                        res.send(response);
                    }
                }
                else{
                    // No User Found
                    response.statusText = "Invalid UserName";
                    res.send(response);
                }
            }
        });
    })