var mongoose = require('mongoose'),  Schema = mongoose.Schema;

// Majors schema
module.exports = function() {
    var majorSchema = new mongoose.Schema({
        _id     : Number,
        name    : String
    });

    //static function that returns all the majors
    majorSchema.statics.findAllMajors = function findSimilarType (cb) {
        return this.model('Majors').find({ type: this.type }, cb);
    };

   mongoose.model('Majors',majorSchema);
};


