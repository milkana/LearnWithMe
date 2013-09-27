var mongoose = require('mongoose');
var Majors = mongoose.model('Majors');
var Users = mongoose.model('Users');
var Groups = mongoose.model('Groups');
var Courses = mongoose.model('Courses');
var Ranks = mongoose.model('Ranks');


// Returns all the majors from the DB
exports.getMajors = function(req, res) {
    Majors.findAllMajors(function(err, result) {
        if (err) {
            res.json({done:'false', msg: "Error: there was an error retreiving majors."});
        }
        else
        {
            res.send(result);
        }
    });
};

// Returns all the courses from the DB
exports.getCourses = function(req, res) {
    Courses.findAllCourses(function(err, result) {
        if (err) {
            res.json({done:'false', msg: "Error: there was an error retreiving courses."});
        }
        else
        {
            res.send(result);
        }
    });
};

// Returns all the users from the DB
exports.getUsers = function(req, res) {
    Users.findAllUsers(function(err, result) {
        if (err) {
            res.json({done:'false', msg: "Error: there was an error retreiving users."});
        }
        else
        {
            res.send(result);
        }
    });
};

// Returns all the ranks from the DB
exports.getRanks = function(req, res) {
    Ranks
        .findAllRanks()
        .exec(function(err, result){
            if (err) {
                res.json({done:'false', msg: "Error: there was an error retreiving ranks."});
            }
            else
            {
                res.send(result);
            }
        });
};

// Returns all the groups from the DB
exports.getGroups = function(req, res) {
    Groups
        .findAllGroups()
        .exec(function(err, result){
            if (err) {
                res.json({done:'false', msg: "Error: there was an error retreiving groups."});
            }
            else
            {
                res.send(result);
            }

        });
};

// Gets a group id and returns the group
exports.getGroupByID = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving group: ' + id);
    if (id)
    {
        var query = Groups.findById(id);
        query.exec(function (err, results) {
            if (err)
            {
                res.json({done:'false', msg: "Error: there was an error retrieving group by id:" + id});
            }
            else
            {
                res.send(results);
            }
        });
    }
    else
    {
        res.json({done:'false', msg: "Error: you did not supply a group id"});
    }
};

// Gets a major id and returns the major
exports.getMajorByID = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving major: ' + id);
    if (id)
    {
        var query = Majors.findById(id);
        query.exec(function (err, results) {
            if (err)
            {
                res.json({done:'false', msg: "Error: there was an error retrieving major by id:" + id});
            }
            else
            {
                res.send(results);
            }
        });
    }
    else
    {
        res.json({done:'false', msg: "Error: you did not supply a major id"});
    }
};

// Gets a course id and returns the course
exports.getCourseByID = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving course: ' + id);
    if (id)
    {
        var query = Courses.findById(id);
        query.exec(function (err, results) {
            if (err)
            {
                res.json({done:'false', msg: "Error: there was an error retrieving course by id:" + id});
            }
            else
            {
                res.send(results);
            }
        });
    }
    else
    {
        res.json({done:'false', msg: "Error: you did not supply a course id"});
    }
};


// Gets a user id and returns the user
exports.getUserByID = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving student: ' + id);
    if (id)
    {
        var query = Users.findById(id);
        query.exec(function (err, results) {
            if (err)
            {
                res.json({done:'false', msg: "Error: there was an error retrieving user by id:" + id});
            }
            else
            {
                res.send(results);
            }
        });
    }
    else
    {
        res.json({done:'false', msg: "Error: you did not supply a user id"});
    }
};

// Gets a course id and returns the all the groups that learn this course
exports.getGroupsByCourseID = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving groups by course id: ' + id);
    if (id)
    {
        var query = Groups.find({ course : id });
        query.exec(function (err, results) {
            if (err)
            {
                res.json({done:'false', msg: "Error: there was an error retrieving groups by course id:" + id});
            }
            else
            {
                res.send(results);
            }

        });
    }
    else
    {
        res.json({done:'false', msg: "Error: you did not supply a course id"});
    }
};

// Gets a user id and returns al ranks he made
exports.getRanksByRankingUserID = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving ranks by user id: ' + id);
    if (id)
    {
        var query = Ranks.find({ ranking_user_id : id });
        query.exec(function (err, results) {
            if (err)
            {
                res.json({done:'false', msg: "Error: there was an error retrieving ranks by ranking user id:" + id});
            }
            else
            {
                res.send(results);
            }

        });
    }
    else
    {
        res.json({done:'false', msg: "Error: you did not supply a user id"});
    }
};

// Gets a user id and returns the all the groups that were organized by him
exports.getGroupsByOrganizerID = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving groups by user id: ' + id);
    if (id)
    {
        var query = Groups.find({ meeting_org : id });
        query.exec(function (err, results) {
            if (err)
            {
                res.json({done:'false', msg: "Error: there was an error retrieving groups by user organizer id:" + id});
            }
            else
            {
                res.send(results);
            }

        });
    }
    else
    {
        res.json({done:'false', msg: "Error: you did not supply a user id"});
    }
};

// Gets a major id and returns all the cousrses of that major
exports.getCoursesByMajorID = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving courses by major id: ' + id);
    if (id)
    {
        var query = Courses.find({ major : id });
        query.exec(function (err, results) {
            if (err)
            {
                res.json({done:'false', msg: "Error: there was an error retrieving courses by major id: " + id});
            }
            else
            {
                res.send(results);
            }
        });
    }
    else
    {
        res.json({done:'false', msg: "Error: you did not supply a major id"});
    }
};

// gets a user by email
exports.getUserByEmail  = function(req, res) {
    var email = req.params.email;
    console.log('Retrieving user by email: ' + email);
    if (email)
    {
        var query = Users.find({ email : email });
        query.exec(function (err, results) {
            if (err)
            {
                res.json({done:'false', msg: "Error: there was an error retrieving user by email: " + email});
            }
            else
            {
                res.send(results);
            }
        });
    }
    else
    {
        res.json({done:'false', msg: "Error: you did not supply an email"});
    }
};


// Gets a group id and returns the names of participants
exports.getUsersInGroup = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving users for group id: ' + id);
    if (id)
    {
        Groups.findById(id, function (err, group) {
            if((err) || (group==null)){
                res.json({done:'false', msg: "Error: An error occurred while fetching from db."});
            }
            else  // no error
            {
                Users.find({_id: { $in: group.users_in_group}},function (err,users)
                {
                    if ((err == null) && users)
                    {
                        res.send(users);
                    }
                    else
                    {
                        res.json({done:'false', msg: "Error: An error occurred while fetching from db."});
                    }

                })
            }
        })
    }
    else
    {
        res.json({done:'false', msg: "Error: you did not supply a group id"});
    }
};

// gets a user id and gets the rank average
exports.getAverageRankById = function(req, res) {
    var user_id = req.params.id;
    console.log('getting average rank of user: '+ user_id);
    if (user_id)
    {
        var query = Users.findById(user_id, function(err,user) {
            if ((err == null) && user)
            {
                var ranks;
                var queryFindRanks = Ranks.find({user_id:user_id}, function(err,ranks) {
                    // there were ranks
                    if ((err == null) && ranks)
                    {
                        var sum=0;
                        var num_of_ranks=ranks.length ;

                        // There was atleast one rank
                        if(num_of_ranks>0)
                        {
                            for(var i=0;i<num_of_ranks;i++){
                                sum += ranks[i].points;
                            }
                            var average = sum/num_of_ranks;

                            res.json({done:'true', ranks: num_of_ranks,  AverageRank :  average});
                        }
                        else // there were no ranks
                        {
                            res.json({done:'true', ranks: 0});
                        }
                    }
                    else
                    {
                        res.json({done:'false', msg: "Error: An error occurred while trying to fetch ranks from db"});
                    }
                });
                queryFindRanks.exec(function (err, results) {
                    if (err)
                    {
                        res.json({done:'false', msg: "Error: An error occurred while trying to fetch ranks from db"});
                    }
                });
            }
            else //user not found
            {
                res.json({done:'false', msg: "Error: There was an error finding user: " + user_id});
            }
        });
    }
    else
    {
        res.json({done:'false', msg: "Error: you did not supply a user id."});
    }
};