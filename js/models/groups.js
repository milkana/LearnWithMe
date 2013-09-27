var mongoose = require('mongoose'),  Schema = mongoose.Schema;

// Group schema
module.exports = function() {
    var groupSchema = new mongoose.Schema({
        start_time       : {type : Date, default: Date.now},
        location         : String,   // description of place (library, home..)
        location_point   : {
                                X: Number,
                                Y: Number
                            } ,
        course            : {type:Number,ref:'Courses', index: true},
        target            : String,
        users_in_group    : [{type : Schema.ObjectId, ref : 'Users', default: []}],
        requesting_to_join : [{type : Schema.ObjectId, ref : 'Users', default: []}],
        meeting_org       : {type : Schema.ObjectId, ref : 'Users', default: null}

    });


//static function that returns all the groups
    groupSchema.statics.findAllGroups = function findSimilarType (cb) {
        return this.model('Groups').find({ type: this.type }, cb);};

    mongoose.model('Groups',groupSchema);
};

