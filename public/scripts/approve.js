/**
 * Created with JetBrains WebStorm.
 * User: yh
 * Date: 07/09/13
 * Time: 12:43
 * To change this template use File | Settings | File Templates.
 */



// Get ranks in ajax
$( '#approve' ).live( 'pageinit',function(event){

    // Refreshing list
    var refresh = function(){
        $('#awaiting_data').empty();
        var userid = localStorage.getItem('userid')  ;

        // Getting all groups by organizer
        $.ajax({
            type: "GET",
            url: 'groups/organizer/'+userid,
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
                    // Going over my groups
                    for (var i = 0; i < data.length; i++)
                    {
                        var currGroup = data[i];
                        (function(currGroup) {

                            // Getting course name
                            var courseName;
                            $.ajax({
                                type: "GET",
                                url: "course/" + currGroup.course,
                                cache: false,
                                success: function(coursedata){
                                    courseName = coursedata.name;
                                }   ,
                                error: function(err){
                                    console.log(err);
                                },
                                complete: function()
                                {
                                    // Getting users requesting to join
                                    var users = {};

                                    var i=0;
                                    var requestingId;
                                    var getNamesAjax =
                                        function(i){
                                            requestingId =  currGroup.requesting_to_join[i];

                                            // Getting name of user
                                            $.ajax({
                                                type: "GET",
                                                url: "users/" + requestingId,
                                                cache: false,
                                                success: function(reqdata){
                                                    users[requestingId]  = reqdata.name;
                                                    i++;
                                                    if(i<currGroup.requesting_to_join.length)
                                                    {
                                                        getNamesAjax(i);
                                                    }
                                                    else
                                                    {
                                                        // Continue function
                                                        cont();
                                                    }

                                                }
                                            });
                                        } ;
                                    getNamesAjax(i);

                                    // Creating users to list
                                    var cont = function(){
                                        var userslist = '';
                                        for(var i=0;i<currGroup.requesting_to_join.length;i++)
                                        {
                                            var currId =  currGroup.requesting_to_join[i];
                                            (function(currId)
                                            {
                                                userslist +=
                                                    '<li>' +
                                                        users[currId] + ' <input class="approve_submit" id= "'+currId+'" type="submit" value="Approve Join" data-role="button" data-inline="true" data-theme="a" />'+
                                                        '</li>'
                                            }(currId));

                                        }

                                        // Creating list of groups
                                        var name;
                                        $('#awaiting_data').append('' +
                                            '<li>' +
                                            '<span id='+currGroup._id+'> ' +
                                            ' Target : ' + currGroup.target +
                                            ', Location  : ' + currGroup.location +
                                            ', Start time : ' + new Date(currGroup.start_time).toLocaleString()+
                                            ', Course : ' + courseName +
                                            '<ul data-role="listview" data-inset="true" id="'+ currGroup._id +'" data-filter="false" class="users_awaiting" data-theme="a"> '+
                                            userslist +
                                            '</ul>' +

                                            '</span>' +
                                            '</li>');

                                        $('#awaiting_data').listview('refresh');
                                        $('#awaiting_data').trigger('create');
                                    };
                                }
                            });

                        })(currGroup);
                    }

                }
            },
            error: function() { // server couldn't be reached or other error
                // show error message
                $.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, "Sorry, the server has encountered a problem. Try again later.", true );

                // hide after delay
                setTimeout( $.mobile.hidePageLoadingMsg, 2000 );
            }
        });
    };

    // When approving a user
    $("#awaiting_data").on("click", ".approve_submit", function(e){

        var userChosen =  e.target.id;

        var groupChosen = (e.target.parentElement.parentElement.parentElement).id;

        // Ajax add to group
        $.ajax({
            type: "POST",
            url: "addUserToGroup",
            cache: false,
            data:
            {
                user_id: userChosen ,
                group_id:groupChosen
            },
            success: function(data) {

                if(data.done === "true")
                {
                    refresh();
                }
                else      // error adding
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


    $( '#approve' ).live( 'pagebeforeshow',function(event){
        refresh();
    });

});
