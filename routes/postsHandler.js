/**
 * Created by user on 6/9/2017.
 */

var express = require('express');
var postsRouter = express.Router();
var Post = require("../models/post");
var userMiddleware = require("../middlewares/userMiddleware");
module.exports = postsRouter;

// authenticate all routes
postsRouter.use(userMiddleware);

postsRouter.route("/")
    .get(function(req,res){
        // returns all posts
        // returns an array of objs, with title and link.
        var query = Post.find({},'-content').populate('author','-password -_id -admin');
        var response = {};
        query.exec(function (err, posts) {
            if(err){
                response.errorCode = "DB Error: "+err;
            }
            else{
                response.errorCode = '';
                response.data = posts;
            }
            res.send(response);
        });
    })
    .post(function (req,res) {
        // insert a new post
        // returns status after insertion

        var postData = req.body;
        postData.author = req.cookies.userid;
        var newPost = new Post(postData);
        res.send(postData);

        var response = {};
        newPost.save(function (err,obj) {
            if(err){
                response.errorCode = 'DB Error: ' + err;
            }
            else{
                response.status = "New post created!";
            }
        });

    });
postsRouter.route("/:postId")
    .get(function (req,res) {
        var response = {};
        var query = Post.find({_id : req.params.postId}).populate('author','-password -_id -admin');
        query.exec(function (err, post) {
            if(err){
                response.errorCode = 'DB Error: ' + err;
            }
            else{
                response.status = "Success";
                response.data = post;
            }
            res.send(response);
        });
    });