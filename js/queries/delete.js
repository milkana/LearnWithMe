var mongoose = require('mongoose');
var Users = mongoose.model('Users');
var Groups = mongoose.model('Groups');

// Gets an id of a group and deletes it
exports.deleteGroupByID = function(req, res) {
    var id = req.params.id;
    console.log('Deleting group: ' + id);
    if (id)
    {
        Groups.findById(id, function (err, group) {
            if(err){
                res.json({done:'false', msg: "Error: An error occurred while fetching from db."});
            }
            else  // no error
            {
                // Group doesnt exist
                if(group===null)
                {
                    res.json({done:'false', msg: "Error: did not find a group with the specified id."});
                }
                else   // Group exist
                {
                    var users_in_group = group.users_in_group;

                    // Going over users to remove the group from them
                    for(var i=0;i<users_in_group.length;i++)
                    {
                        var curr_user_id = users_in_group[i];
                        Users.findById(curr_user_id,function (err, curr_user) {
                            if(!err && curr_user){
                                //  res.send("Error: An error occurred while fetching from db.");
                                var group_index = curr_user.groups.indexOf(id);
                                if (group_index != -1)
                                {
                                    console.log('Removing group to the user: ' + curr_user._id + 'number '+ group_index);
                                    curr_user.groups.splice(group_index, 1);
                                    curr_user.save();
                                }
                            }

                        } );
                    }

                    // Removing group from DB
                    Groups.remove({ _id: id}, function(err) {
                        if (err===null) {
                            res.json({done:'true', msg: "Done successfully"});
                        }
                        else
                        {
                            res.json({done:'false', msg: 'Error: Error in deleting Group : '+ id});
                        }
                    });
                }
            }
        });
    }
    else
    {
        res.json({done:'false', msg: "Error: you did not supply an id."});
    }
}