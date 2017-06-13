/**
 * Created by user on 6/7/2017.
 */
var dbProps = {
    adminPassword : "0d52a26acfc79f227419c268d60c1fc4d1b5fd6aff8243fc98f27b73652802f5",
    // I think they won't guess it :P
    prod: {
        url:""
    },
    dev: {
        //url: "mongodb://localhost:27017"
        url: "mongodb://sva:sva97@ds119772.mlab.com:19772/ieeespwd"
    }
};

exports.db_properties = dbProps;
