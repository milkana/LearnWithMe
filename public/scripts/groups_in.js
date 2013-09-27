/**
 * Created with JetBrains WebStorm.
 * User: yh
 * Date: 07/09/13
 * Time: 23:54
 * To change this template use File | Settings | File Templates.
 */

// get ranks in ajax
$( '#groupsin' ).live( 'pageinit',function(event){

    var refresh = function(){
        $('#groups_list').empty();

        var userid = localStorage.getItem('userid')  ;

        (function(){
            // Getting user
            $.ajax({
                type: "GET",
                url: 'users/'+userid,
                cache: false,
                success: function(data) {
                    if(data.done === "false")
                    {
                        // show error message
                        $.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, data.msg, true );

                        // hide after delay
                        setTimeout( $.mobile.hidePageLoadingMsg, 2000 );
                    }
                    else
                    {
                        // Getting his groups
                        var groupsIds = data.groups;
                        (function(groupsIds){
                            for (var i = 0; i < groupsIds.length; i++)
                            {
                                // Adding group to groups list
                                createItemForGroup(groupsIds[i]);
                            }
                        }(groupsIds));
                    }
                },
                error: function() { // server couldn't be reached or other error
                    // show error message
                    $.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, "Sorry, the server has encountered a problem. Try again later.", true );

                    // hide after delay
                    setTimeout( $.mobile.hidePageLoadingMsg, 2000 );
                }
            });
        })();
    };

    // Creating a list item of group
    var createItemForGroup = function(groupId)
    {
        // Getting groupby id
        var group;
        (function(groupId) {
            $.ajax({
                type: "GET",
                url: "group/" + groupId,
                cache: false,
                success: function(groupdata){
                    group = groupdata;
                    cont(group);
                }
            });
        })(groupId);
    };

    // Getting group details
    var cont = function(group)
    {
        var courseName;
        (function(group) {
            $.ajax({
                type: "GET",
                url: "course/" + group.course,
                cache: false,
                success: function(coursedata){
                    courseName = coursedata.name;
                    createDetails(group, courseName);
                }
            });
        })(group);

    };

    // Creating details
    var createDetails = function(group, courseName)
    {
        var userid = localStorage.getItem('userid')  ;

        var users;
        // Getting users of group
        $.ajax({
            type: "GET",
            url: "users/group/" + group._id,
            cache: false,
            success: function(data){
                var names = "";
                $.each(data,function(){

                    // Do Something
                    names += this.name + ",";

                });
                users = names.substring(0,names.length - 1);


                // This is the owner. he can delete group
                if(group.meeting_org === userid)
                {
                    addHTML(group, courseName, users, 'delete');
                }
                else // Just participating. can leave group
                {
                    addHTML(group, courseName, users, 'leave');
                }

            }
        });
    };


    // Add the html DOM
    var addHTML = function(group, courseName, users, action)
    {
        var button = (action == "leave" ? "Leave" : "Delete");

        $('#groups_list').append('' +
            '<li>' +
            '<span id='+group._id+'> ' +
            ' Target : ' + group.target +
            ', Location  : ' + group.location +
            ', Start time : ' + new Date(group.start_time).toLocaleString()+
            ', Course : ' + courseName +
            ', Participants : ' + users +
            '<input class="'+ action +'_submit ui-btn-text" id= "'+group._id+'" type="submit" value="'+ button +' Group" data-role="button" data-inline="true" data-theme="c" />'+
            '</span>' +
            '</li>');

        $('#groups_list').listview('refresh');
        $('#groups_list').trigger('create');
    };


      // Event leaving by click
    $("#groups_list").on("click", ".leave_submit", function(e){

        var groupChosen =  e.target.id;
        var userid = localStorage.getItem('userid')  ;

        // ajax removing user from group
        $.ajax({
            type: "POST",
            url: "removeUserFromGroup",
            cache: false,
            data:
            {
                user_id : userid,
                group_id: groupChosen
            },
            success: function(data) {

                if(data.done === "true")
                {
                    refresh();
                }else      // error leaving
                {
                    // show error message
                    $.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, data.msg, true );

                    // hide after delay
                    setTimeout( $.mobile.hidePageLoadingMsg, 2000 );
                }
            },
            error: function() { // server couldn't be reached or other error }
                // show error message
                $.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, "Sorry, the server has encountered a problem. Try again later.", true );

                // hide after delay
                setTimeout( $.mobile.hidePageLoadingMsg, 2000 );
            }
        });

    });


    // Event on clicking delete
    $("#groups_list").on("click", ".delete_submit", function(e){

        var groupChosen =  e.target.id;

        // ajax delete group
        $.ajax({
            type: "DELETE",
            url: "groups/"+ groupChosen,
            cache: false,
            success: function(data) {

                if(data.done === "true")
                {
                    refresh();
                }else      // error deleting
                {
                    // show error message
                    $.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, data.msg, true );

                    // hide after delay
                    setTimeout( $.mobile.hidePageLoadingMsg, 2000 );
                }
            },
            error: function() { // server couldn't be reached or other error }
                // show error message
                $.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, "Sorry, the server has encountered a problem. Try again later.", true );

                // hide after delay
                setTimeout( $.mobile.hidePageLoadingMsg, 2000 );
            }
        });

    });


    $( '#groupsin' ).live( 'pagebeforeshow',function(event){
        refresh();
    });

});
