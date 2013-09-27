var mongoose = require('mongoose'),  Schema = mongoose.Schema;

// users schema
module.exports = function() {
    var userSchema = new mongoose.Schema({
        name    : String,
        groups  : [{type : Schema.ObjectId, ref : 'Groups', default: []}],
        email   : String,
        major   : {type : Number, ref : 'Majors', index: true},
        password: String

    });

    // static function that returns all the users
    userSchema.statics.findAllUsers = function findSimilarType (cb) {
        return this.model('Users').find({ type: this.type }, cb);
    };

   mongoose.model('Users',userSchema);

};




