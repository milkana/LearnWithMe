var mongoose = require('mongoose');
var demidata = require('./demidata');

if(process.env.VCAP_SERVICES){
    var env = JSON.parse(process.env.VCAP_SERVICES);
    var mongo = env['mongodb-1.8'][0]['credentials'];
}
else{
    var mongo = {
        "hostname":"localhost",
        "port":27017,
        "username":"",
        "password":"",
        "name":"",
        "db":"learn"
    }
}

var generate_mongo_url = function(obj){
    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'test');

    if(obj.username && obj.password){
        return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
    else{
        return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
}

exports.connect = function(){

    // connecting
    mongoose.connect(generate_mongo_url(mongo),function (err){
        if (err) throw err;
    });

    var conn = mongoose.connection;

    conn.on('error', console.error.bind(console, 'connection error:'));
    conn.once('open', function callback () {

        // In case db was already populated, we drop so we wont have all demi-data twice.
        conn.db.dropDatabase(function (err){
            if (err) throw err;
        });

        // Populating collections in documents
        demidata.populate();

    });
};

