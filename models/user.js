/**
 * Created by user on 6/9/2017.
 */

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: {type : Boolean, default : false},
    email : {
        type : String,
        trim: true,
        lowercase: true,
        unique: true,
        required : true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    solves : [
        {type : Schema.Types.ObjectId, ref : "Challenge"}
    ]
});

var User = mongoose.model('User',userSchema);

module.exports = User;