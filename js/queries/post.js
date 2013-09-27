var mongoose = require('mongoose');
var Majors = mongoose.model('Majors');
var Users = mongoose.model('Users');
var Groups = mongoose.model('Groups');
var Courses = mongoose.model('Courses');
var Ranks = mongoose.model('Ranks');

// Gets name, email, major and password and adds the user to the db
exports.addUser= function (req,res)
{
    var user = req.body;

    // Check that getting all needed params
    if(user.name && user.email && user.major && user.password)  {
        // Checking if there is a user with same email in the system
        Users.findOne({email : user.email}, function (err, user_exist) {
            if(err){
                res.json({done:'false', msg: "Error: An error occurred while fetching from db."});
            }
            else  // no error
            {
                // A user with this email exists
                if (user_exist)
                {
                    res.json({done:'false', msg: "Error: The email account you entered already exists in the system."});
                }
                else  // email account is new
                {
                    Users.create(user,function(err, newUser)
                    {
                        if (err)
                        {
                            res.json({done:'false', msg: "Error: an error occurred while inserting into db."});
                        }
                        else
                        {
                            res.json({done:'true', userid: newUser._id, name: newUser.name, msg: "Done Successfully."});
                        }
                    });
                }
            }
        });
    }
    else
    {
        res.json({done:'false', msg: "Error: you did not supply either a name or an email or a major or password."});
    }
};

// authenticate user
exports.authenticate  = function(req, res) {
    var email = req.body.email;
    email = email.toLowerCase();
    var password = req.body.password;

    console.log('authenticating user by email: ' + email);
    if (email && password)
    {
        var query = Users.findOne({ email :  email } );

        query.exec(function (err, result) {
            if (err || result === null)
            {
                res.json({done:'false', msg: "Error: there was an error retrieving user by email: " + email});
            }
            else
            {
                if(result.password === password) // password correct
                {
                    res.json({auth:'true', name: result.name, userid: result._id});
                }
                else
                {
                    res.json({auth:'false'});      // password incorrect
                }
            }
        });
    }
    else
    {
        res.json({done:'false', msg: "Error: you did not supply an email or a password"});
    }
};

// gets start_time, location, location_point, course, target, meeting_org and adds the group to the db
exports.addGroup = function(req, res) {

    var group = req.body;

    // Check that getting all needed params
    if(group.location && group.location_point_x && group.location_point_y && group.course && group.target && group.meeting_org)  {
        // Checking if there is a user which is meeting_org (organizer)
        Users.findById(group.meeting_org, function (err, user_exist) {
            if(err){
                res.json({done:'false', msg: "Error: An error occurred while fetching from db."});
            }
            else  // no error
            {
                // A user with meeting_org id does not exists
                if (user_exist === null)
                {
                    res.json({done:'false', msg: "Error: The meeting organizer (meeting_org) does not exists in the system."});
                }
                else  // meeting_org exists
                {
                    var new_group = new Groups();
                    if (group.start_time)
                    {
                        new_group.start_time = group.start_time;
                    }

                    new_group.location = group.location;
                    new_group.location_point.X =  group.location_point_x;
                    new_group.location_point.Y =  group.location_point_y;
                    new_group.course =  group.course;
                    new_group.target = group.target;
                    new_group.meeting_org =  group.meeting_org;
                    new_group.users_in_group.push(group.meeting_org);
                    new_group.save();

                    user_exist.groups.push(new_group._id);
                    user_exist.save();

                    res.json({done:'true', msg: "Done successfully"});

                }
            }
        });
    }
    else
    {
        res.json({done:'false', msg: "Error: you did not supply either a location, location_point, course, target or a meeting_org."});
    }
}


// Gets a group and a user id and adds the user to the group
exports.addUserToGroup = function(req, res) {

    var user_id = req.body.user_id;
    var group_id = req.body.group_id;

    var user;
    var group;

    if (user_id && group_id)
    {
        // Checking the user don't related to the group
        console.log('Retrieving student: ' + user_id);
        var query = Users.findById(user_id, function(err,user) {
            if ((err == null) && user)
            {
                console.log('Retrieving group: ' + group_id);
                var query2 = Groups.findById(group_id, function(err,group) {
                    if ((err == null) && group)
                    {
                        // Checking the group don't contains the user yet
                        console.log('Check if the user is in the group');
                        if (group.users_in_group.indexOf(user_id) == -1)
                        {
                            console.log('Adding user to the group: ' + user_id);

                            group.users_in_group.push(user_id);

                            var user_index = group.requesting_to_join.indexOf(user_id);
                            if (user_index != -1)
                            {
                                console.log('removing user ' + user_id+' from the group requests join . In list user number ' + user_index);
                                group.requesting_to_join.splice(user_index,1);
                            }

                            group.save();
                        }

                        console.log('Check if the group is in the user');
                        if (user.groups.indexOf(group_id) == -1)
                        {
                            console.log('Adding group to the user: ' + group_id);
                            user.groups.push(group_id);
                            user.save();
                        }

                        res.json({done:'true', msg: "Done successfully"});

                    }
                    else
                    {
                        res.json({done:'false', msg: "Error: There was an error finding group: " + group_id});
                    }

                });

                query2.exec(function (err, results) {
                    if (err)
                    {
                        res.json({done:'false', msg: "Error: There was an error finding group: " + group_id});
                    }
                });
            }
            else //user not found
            {
                res.json({done:'false', msg: "Error: There was an error finding user: " + user_id});
            }
        });

        query.exec(function (err, results) {
            if (err)
            {
                res.json({done:'false', msg: "Error: There was an error finding user: " + user_id});
            }
        });
    }
    else
    {
        res.json({done:'false', msg: "Error: you did not supply either a user_id or a group_id or both."});
    }
};

// gets a user and a group and removes the user from the group
exports.removeUserFromGroup = function(req, res) {
    var user_id = req.body.user_id;
    var group_id = req.body.group_id;

    var user;
    var group;

    if (user_id && group_id)
    {
        // Getting the student from the id
        console.log('Retrieving student: ' + user_id);
        var query = Users.findById(user_id, function(err,user) {
            if ((err == null) && user)
            {
                console.log('Retrieving group: ' + group_id);
                var query2 = Groups.findById(group_id, function(err,group) {
                    if ((err == null) && group)
                    {
                        // Checking the group contains the user
                        console.log('Check if the user is in the group');
                        var user_index = group.users_in_group.indexOf(user_id);
                        if (user_index != -1)
                        {
                            console.log('removing user ' + user_id+' from the group . number ' + user_index);
                            //group.users_in_group.push(user_id);
                            group.users_in_group.splice(user_index,1);
                            group.save();
                        }


                        console.log('Check if the group is in the user');
                        var group_index = user.groups.indexOf(group_id);
                        if (group_index != -1)
                        {
                            console.log('Removing group to the user: ' + group_id + 'number '+group_index);
                            user.groups.splice(group_index, 1);
                            user.save();
                        }

                        res.json({done:'true', msg: "Done successfully"});
                    }
                    else
                    {
                        res.json({done:'false', msg: "Error: There was an error finding group: " + group_id});
                    }

                });

                query2.exec(function (err, results) {
                    if (err)
                    {
                        res.json({done:'false', msg: "Error: There was an error finding group: " + group_id});
                    }
                });
            }
            else
            {
                res.json({done:'false', msg: "Error: There was an error finding user: " + user_id});
            }
        });

        query.exec(function (err, results) {
            if (err)
            {
                res.json({done:'false', msg: "Error: There was an error finding user: " + user_id});
            }
        });
    }
    else
    {
        res.json({done:'false', msg: "Error: you did not supply either a user_id or a group_id or both."});
    }
};


// Gets the user id,  ranking user id, and a rank and adds the rank to the db
exports.addRank= function (req,res)
{
    var rank = req.body;

    var user_id = rank.user_id;
    var ranking_user_id = rank.ranking_user_id;
    var points = rank.points;

    var user;
    var ranking_user;

    if(user_id && ranking_user_id && points)
    {
        // user tried to rank himself
        if(user_id === ranking_user_id)
        {
            res.json({done:'false', msg: "Error: One cannot rank himself."});
        }
        // not same user
        else
        {
            // Getting the student from the id
            console.log('Retrieving user: ' + user_id);
            var query = Users.findById(user_id, function(err,user) {
                if ((err == null) && user)
                {
                    console.log('Retrieving ranking user: ' + ranking_user_id);
                    var query2 = Users.findById(ranking_user_id, function(err,ranking_user) {
                        if ((err == null) && ranking_user)
                        {

                            // Check there is no rank already for that user and ranking user pair
                            var rank_exist;
                            var queryFindRank = Ranks.findOne({user_id:user_id, ranking_user_id: ranking_user_id}, function(err,rank_exist) {

                                // user already voted from him
                                if ((err == null) && rank_exist)
                                {
                                    console.log("in rank exist: "+ rank_exist);
                                    res.json({done:'false', msg: "Error: A rank already exist to this user and ranking user."});
                                }
                                else if(err != null)
                                {
                                    res.json({done:'false', msg: "Error: An error occurred while trying to fetch from db"});
                                }
                                else   // Rank does not exist
                                {
                                    if(points<0 || points>5)
                                    {
                                        res.json({done:'false', msg: "Error: points must be 0-5"});
                                    }
                                    else
                                    {
                                        var rank_instance = new Ranks();
                                        rank_instance.user_id = user_id;
                                        rank_instance.ranking_user_id = ranking_user_id;
                                        rank_instance.points = points;
                                        rank_instance.save(function (err) {
                                            if(err)
                                            {
                                                res.json({done:'false', msg: "Error: new rank could not be saved."});
                                            }
                                            else
                                            {
                                                res.json({done:'true', msg: "Done Successfuly"});

                                            }
                                        });
                                    }

                                }
                            });
                            queryFindRank.exec(function (err, results) {
                                if (err)
                                {
                                    res.json({done:'false', msg: "Error: An error occurred while trying to fetch from db"});
                                }
                            });


                        }
                        else
                        {
                            res.json({done:'false', msg: "Error: There was an error finding ranking user: " + ranking_user_id});
                        }

                    });

                    query2.exec(function (err, results) {
                        if (err)
                        {
                            res.json({done:'false', msg: "Error: There was an error finding ranking user: " + ranking_user_id});
                        }
                    });
                }
                else
                {
                    res.json({done:'false', msg: "Error: There was an error finding user: " + user_id});
                }
            });

            query.exec(function (err, results) {
                if (err)
                {
                    res.json({done:'false', msg: "Error: There was an error finding user: " + user_id});
                }
            });
        }
    }

    else
    {
        res.json({done:'false', msg: "Error: you did not supply either a user_id or a ranking_user_id or a rank or all."});
    }


};


// gets a user id and a ranking user id and removes the rank
exports.deleteRank = function(req, res) {
    var user_id = req.body.user_id;
    var ranking_user_id = req.body.ranking_user_id;
    console.log('deleting rank of: '+ user_id +' from ranking user: ' + ranking_user_id);
    if (user_id && ranking_user_id)
    {
        Ranks.remove({ user_id: user_id,  ranking_user_id:ranking_user_id}, function(err) {
            if (err===null) {
                res.json({done:'true', msg: "Done successfully"});
            }
            else
            {
                res.json({done:'false', msg: 'Error: Error in deleting rank of: '+ user_id +' from ranking user: ' + ranking_user_id});
            }
        });
    }
    else
    {
        res.json({done:'false', msg: "Error: you did not supply either a user_id or a ranking_user_id or both."});
    }
};

exports.requestJoin = function(req, res) {
    var user_id = req.body.user_id;
    var group_id = req.body.group_id;

    if (user_id && group_id)
    {
        // Checking the user don't related to the group
        console.log('Retrieving student: ' + user_id);
        var query = Users.findById(user_id, function(err,user) {
            if ((err == null) && user)
            {
                console.log('Retrieving group: ' + group_id);
                var query2 = Groups.findById(group_id, function(err,group) {
                    if ((err == null) && group)
                    {
                        // Checking the group don't contains the user yet
                        console.log('Check if the user is in the group');
                        if (group.users_in_group.indexOf(user_id) == -1)
                        {
                            // Checking the group don't contains the user yet in requests
                            console.log('Check if the user is in the request join list  of group');
                            if (group.requesting_to_join.indexOf(user_id) == -1)
                            {
                                console.log('Adding user to the request join list of group: ' + user_id);
                                //group.users_in_group.push(user_id);
                                group.requesting_to_join.push(user_id);
                                group.save();

                                res.json({done:'true', msg: "Done successfully"});
                            }
                            else  // in request already
                            {
                                res.json({done:'false', msg: "Already waiting for response to join this group."});
                            }
                        }
                        else  // in group already
                        {
                            res.json({done:'false', msg: "Already in this group."});
                        }


                    }
                    else
                    {
                        res.json({done:'false', msg: "Error: There was an error finding group: " + group_id});
                    }

                });

                query2.exec(function (err, results) {
                    if (err)
                    {
                        res.json({done:'false', msg: "Error: There was an error finding group: " + group_id});
                    }
                });
            }
            else //user not found
            {
                res.json({done:'false', msg: "Error: There was an error finding user: " + user_id});
            }
        });

        query.exec(function (err, results) {
            if (err)
            {
                res.json({done:'false', msg: "Error: There was an error finding user: " + user_id});
            }
        });




















        res.json({done:'true', msg: "Done successfully"});
    }
    else
    {
        res.json({done:'false', msg: "Error: you did not supply either a user id or a group id or both."});
    }



};


// gets a user id and a ranking user id and a new rank and updates the rank
exports.updateRank = function(req, res) {
    var user_id = req.body.user_id;
    var ranking_user_id = req.body.ranking_user_id;
    var points = req.body.points;
    console.log('updating rank of user: '+ user_id +' from ranking user: ' + ranking_user_id+' to be: ' + points);
    if (user_id && ranking_user_id && points)
    {
        // invalid points
        if(points<0 || points>5)
        {
            res.json({done:'false', msg: "Error: points must be 0-5"});
        }
        else  // valid points
        {
            var conditions = { user_id: user_id, ranking_user_id: ranking_user_id }
                , update = { points: points }
                , options = { multi: true };

            Ranks.update(conditions, update, options, callback);

            function callback (err, numAffected) {
                // numAffected is the number of updated documents
                if (err)
                {
                    res.json({done:'false', msg: 'Error: Error in updating rank of: '+ user_id +' from ranking user: ' + ranking_user_id});
                }
                else if (numAffected>0)
                {
                    res.json({done:'true', msg: 'Done successfully'});
                }
                else
                {
                    res.json({done:'false', msg: 'Error: did not update any rank. Check correctness of user and ranking user.'});
                }
            }
        }
    }
    else
    {
        res.json({done:'false', msg: "Error: you did not supply either a user_id or a ranking_user_id or points or all."});
    }
};