var mongoose = require('mongoose'),  Schema = mongoose.Schema;

// Ranks schema
module.exports = function() {
    var ranksSchema = new mongoose.Schema({
        user_id             : { type: Schema.ObjectId, ref: 'Users', default: null, index: true },
        ranking_user_id    :  { type: Schema.ObjectId, ref: 'Users', default: null },
        points              : { type:Number,  default: null, min:0, max:5}

    });

    //static function that returns all the ranks
    ranksSchema.statics.findAllRanks = function findSimilarType (cb) {
        return this.model('Ranks').find({ type: this.type }, cb);};

    mongoose.model('Ranks',ranksSchema);

};




