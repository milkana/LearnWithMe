var mongoose = require('mongoose'),  Schema = mongoose.Schema;

// Course schema
module.exports = function() {

    var courseSchema = new Schema({
        _id     : Number,
        name    : String,
        major   :{type : Number, ref : 'Majors', index: true}

    });

    //staticfunction that returns all the courses
     courseSchema.statics.findAllCourses = function findSimilarType (cb) {
     return this.model('Courses').find({ type: this.type }, cb);
     };

     mongoose.model('Courses',courseSchema);

};

