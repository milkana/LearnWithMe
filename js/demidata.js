var async = require('async');
var mongoose = require('mongoose'),  Schema = mongoose.Schema;

require('./models/ranks.js')(mongoose);
require('./models/groups.js')(mongoose);
require('./models/users.js')(mongoose);
require('./models/majors.js')(mongoose);
require('./models/courses.js')(mongoose);

var Ranks = mongoose.model('Ranks');
var Groups = mongoose.model('Groups');
var Users = mongoose.model('Users');
var Majors = mongoose.model('Majors');
var Courses = mongoose.model('Courses');

// populating majors
var majorData = [
    {_id: 1, name : 'Computer Science'},
    {_id: 2, name : 'Mathematics'},
    {_id: 3, name : 'Management'},
    {_id: 4, name : 'English'}

];

// populating courses
var CoursesData = [
    {_id: 1, name : 'Linear Algebra',major:majorData[0]._id},
    {_id: 2, name : 'Logics',major:majorData[0]._id},
    {_id: 3, name : 'Mobile Web',major:majorData[0]._id},
    {_id: 4, name : 'OOP',major:majorData[0]._id},
    {_id: 5, name : 'English Basics',major:majorData[3]._id},
    {_id: 6, name : 'English Expert',major:majorData[3]._id},
    {_id: 7, name : 'Micro Economics',major:majorData[2]._id},
    {_id: 8, name : 'Project Management',major:majorData[2]._id},
    {_id: 9, name : 'Hedva',major:majorData[1]._id},
    {_id: 10, name : 'Statistics',major:majorData[1]._id}
];

// populating users
var user1 = new Users({
    _id     : "520f514f97db77a41c000001",
    name    : "Tom",
    email   : "tom@mail.mta.ac.il",
    major   : majorData[0],
    password: "password1"
});
var user2 = new Users({
    _id     : '520f514f97db77a41c000002',
    name    : "yuval",
    email   : "yuval@mail.mta.ac.il",
    major   : majorData[0],
    password: "myspacetom"
});
var user3 = new Users({
    _id     : '520f514f97db77a41c000003',
    name    : "Yael",
    email   : "yael@mail.mta.ac.il",
    major   : majorData[0],
    password: "yael1234"
});
var user4 = new Users({
    _id     : '520f514f97db77a41c000004',
    name    : "Milkana",
    email   : "milkana@mail.mta.ac.il",
    major   : majorData[0],
    password: "12345"
});
var user5 = new Users({
    _id     : '520f514f97db77a41c000015',
    name    : "Bodek",
    email   : "bodek@mail.mta.ac.il",
    major   : majorData[0],
    password: "12345"
});
var user6 = new Users({
    _id     : '520f514f97db77a41c000016',
    name    : "Fany",
    email   : "fany@mail.mta.ac.il",
    major   : majorData[1],
    password: "12345"
});
var user7 = new Users({
    _id     : '520f514f97db77a41c000017',
    name    : "Shlomi",
    email   : "shlomi@mail.mta.ac.il",
    major   : majorData[2],
    password: "12345"
});

// populating groups
var group1 = new Groups({
    _id              : '520f514f97db77a41c000005',
    start_time       : Date.now()+806000,
    location         : "Libary",
    course           : CoursesData[2]._id,
    target           : "Presentations",
    meeting_org      : user1,
    users_in_group   : [user1,user2,user3]  ,
    requesting_to_join:[user5,user6]
});
var group2 = new Groups({
    _id              : '520f514f97db77a41c000006',
    start_time       : Date.now()+880000,
    location         : "Apartment",
    course           : CoursesData[1]._id,
    target           : "Homework",
    meeting_org      : user3,
    users_in_group   : [user3,user1,user4],
    requesting_to_join:[user6,user2]
});
var group3 = new Groups({
    _id              : '520f514f97db77a41c000011',
    start_time       : Date.now()+99000000,
    location         : "Cafe hillel rest",
    course           : CoursesData[1]._id,
    target           : "Homework",
    meeting_org      : user3,
    users_in_group   : [user3],
    requesting_to_join:[user1,user4]
});
var group4 = new Groups({
    _id              : '520f514f97db77a41c000018',
    start_time       : Date.now()+700000,
    location         : "over the rainbow",
    course           : CoursesData[3]._id,
    target           : "Summaries",
    meeting_org      : user3,
    users_in_group   : [user3],
    requesting_to_join:[user1,user4,user5, user6]
});
var group5 = new Groups({
    _id              : '520f514f97db77a41c000019',
    start_time       : Date.now()+40000,
    location         : "house",
    course           : CoursesData[0]._id,
    target           : "books",
    meeting_org      : user7,
    users_in_group   : [user5,user1,user2,user3,user7],
    requesting_to_join:[user1,user4]
});
// populating ranks

var rank1 = new Ranks({
    _id              :'520f514f97db77a41c000008',
    user_id          :user1,
    ranking_user_id  :user2,
    points           :5
})
var rank2 = new Ranks({
    _id              :'520f514f97db77a41c000009',
    user_id          :user3,
    ranking_user_id  :user2,
    points           :2
})
var rank3 = new Ranks({
    _id              :'520f514f97db77a41c000010',
    user_id          :user3,
    ranking_user_id  :user4,
    points           :5
})
var rank4 = new Ranks({
    _id              :'520f514f97db77a41c000020',
    user_id          :user3,
    ranking_user_id  :user1,
    points           :5
})
var rank5 = new Ranks({
    _id              :'520f514f97db77a41c000021',
    user_id          :user3,
    ranking_user_id  :user6,
    points           :5
})
var rank6 = new Ranks({
    _id              :'520f514f97db77a41c000022',
    user_id          :user3,
    ranking_user_id  :user5,
    points           :5
})
var rank7 = new Ranks({
    _id              : '520f514f97db77a41c000007',
    user_id          :user2,
    ranking_user_id  :user4,
    points           :1
})
var rank8 = new Ranks({
    _id              : '520f514f97db77a41c000027',
    user_id          :user3,
    ranking_user_id  :user4,
    points           :1
})
var rank9 = new Ranks({
    _id              : '520f514f97db77a41c000087',
    user_id          :user3,
    ranking_user_id  :user5,
    points           :1
})

// insert if id does not exist
var createIfValidDataModel = function (model,data,cb){
    model.find({ _id:data._id}, function (err, docs) {
        if (docs.length){
           // those id exist so do nothing
        }else{  // they dont exist so add them
            model.create(data,function(err){
                cb(err,data);
            });
        }
    });
};

// creates the data in the db
var scanArrayAndCreateDataIfNeeded = function (model,Array){
    // populating asynchronously
    async.each(Array, function (item, cb) {
        // if id's exist so dont add
        createIfValidDataModel(model,item,cb)
    }, function (err) {
        if (err) throw err;
    })
};

// Populating DB with demo data
exports.populate = function(){
    scanArrayAndCreateDataIfNeeded(Majors,majorData);
    scanArrayAndCreateDataIfNeeded(Courses,CoursesData);

    // referencing groups to the users in their array
    user1.groups.push(group1);
    user2.groups.push(group1);
    user3.groups.push(group1);

    user1.groups.push(group2);
    user3.groups.push(group2);
    user4.groups.push(group2) ;

    user3.groups.push(group3);

    user3.groups.push(group4);

    user5.groups.push(group5);
    user1.groups.push(group5);
    user2.groups.push(group5);
    user3.groups.push(group5);
    user7.groups.push(group5);


    // group locations
    group1.location_point.X = 32.085556;
    group1.location_point.Y = 34.781717;

    group2.location_point.X = 32.079475;
    group2.location_point.Y = 34.780279;

    group3.location_point.X = 32.089475;
    group3.location_point.Y = 34.780279;

    group4.location_point.X = 32.080475;
    group4.location_point.Y = 34.780279;

    group5.location_point.X = 32.089475;
    group5.location_point.Y = 34.783279;

    // saving all
    user1.save();
    user2.save();
    user3.save();
    user4.save();
    user5.save();
    user6.save();
    user7.save();
    group1.save();
    group2.save();
    group3.save();
    group4.save();
    group5.save();
    rank1.save();
    rank2.save();
    rank3.save();
    rank4.save();
    rank5.save();
    rank6.save();
    rank7.save();
    rank8.save();
    rank9.save();
};




