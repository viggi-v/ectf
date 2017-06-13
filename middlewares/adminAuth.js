/**
 * Created by user on 6/9/2017.
 */

var properties = require("../bin/properties");
var SHA256 = require("crypto-js/sha256");
function authForAdmin(user){
    // not a middleware, actually.
    // for using signup
    if(user.admin){
        return SHA256(user.adminpassword) === properties.db_properties.adminPassword;
    }
    else{
        // if he's not an admin he is always authenticated.
        return true;

    }
}
module.exports = authForAdmin;