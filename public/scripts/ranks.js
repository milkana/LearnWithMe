// get ranks in ajax
$( '#usersrank' ).live( 'pageinit',function(event){
    var refresh = function(){
        $('#rank-data').empty();

        var userid = localStorage.getItem('userid')  ;

        (function(userid){
            //Getting a list with all the users
            $.ajax({
                type: "GET",
                url: "users/",
                cache: false,
                success: function(data) {
                    if(data.done === "false")   //error
                    {
                        // show error message
                        $.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, data.msg, true );

                        // hide after delay
                        setTimeout( $.mobile.hidePageLoadingMsg, 2000 );
                    }
                    else      //no error
                    {
                        // Going over the users to find the relevant data and add them to the list
                        for (var i = 0; i < data.length; i++)
                        {
                            var currUser = data[i];
                            (function(currUser) {

                                //Getting the average
                                var url = "./averageRank/" + currUser._id;
                                $.ajax({
                                    type: "GET",
                                    url: url,
                                    cache: false,
                                    success: function(dataAvg) {
                                        if(dataAvg.done === "false")  //error
                                        {
                                            // show error message
                                            $.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, dataAvg.msg, true );

                                            // hide after delay
                                            setTimeout( $.mobile.hidePageLoadingMsg, 2000 );
                                        }
                                        else        //no error
                                        {
                                            // default - no one voted
                                            var averageData = "no ranks";

                                            // checking if someone voted
                                            if (dataAvg.ranks > 0)
                                            //rounding the average X.XX
                                                averageData = Math.round(dataAvg.AverageRank*100)/100;

                                            //disabling the user to vote for her/himself
                                            if(currUser._id != userid)
                                            {
                                                //finding all the users that the current user have already voted for
                                                (function(dataAvg,currUser){
                                                    var url2 = "./ranks/ranking_user/" + userid;
                                                    $.ajax({
                                                        type: "GET",
                                                        url: url2,
                                                        cache: false,
                                                        success: function(arrayRanks) {
                                                            if(arrayRanks.done === "false")        //error
                                                            {

                                                                // show error message
                                                                $.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, arrayRanks.msg, true );

                                                                // hide after delay
                                                                setTimeout( $.mobile.hidePageLoadingMsg, 2000 );

                                                            }
                                                            else    //no error
                                                            {

                                                                // getting rank of user
                                                                var result = $.grep(arrayRanks, function(e){ return e.user_id == currUser._id; });

                                                                // User already ranked
                                                                if (result.length > 0)
                                                                {
                                                                    $('#rank-data').append('' +
                                                                        '<li>' +
                                                                        '<span id="userRank"> ' +
                                                                        currUser.name +'&nbsp&nbsp&nbsp'+ '<br/> Current average: '+ averageData + '&nbsp&nbsp&nbsp'+
                                                                        '<label for="rank">Rank:</label>'+
                                                                        '<input class="points" type="range" name="rank" id="rank" value="'+result[0].points+'" min="0" max="5"  /> '+
                                                                        '<input class="rank_update" id= "'+currUser._id+'" type="submit" value="Update Rank!" data-role="button" data-inline="true" data-theme="b" />'+
                                                                        '</span>' +
                                                                        '</li>');
                                                                }
                                                                else // user did not rank him
                                                                {
                                                                    $('#rank-data').append('' +
                                                                        '<li>' +
                                                                        '<span id="userRank"> ' +
                                                                        currUser.name +'&nbsp&nbsp&nbsp'+ '<br/> Current average: '+ averageData + '&nbsp&nbsp&nbsp'+
                                                                        '<label for="rank">Rank:</label>'+
                                                                        '<input class="points" type="range" name="rank" id="rank" value="0" min="0" max="5"  /> '+
                                                                        '<input class="rank_add" id= "'+currUser._id+'" type="submit" value="Rank!" data-role="button" data-inline="true" data-theme="b" />'+
                                                                        '</span>' +
                                                                        '</li>');

                                                                }
                                                                //refreshing the list item
                                                                $('#rank-data').listview('refresh');
                                                                $('#rank-data').trigger('create');

                                                            }
                                                        }
                                                    })
                                                })(dataAvg,currUser);
                                            }
                                            else // the authorized user average
                                            {      $('#rank-data').append('' +
                                                '<li><span id="userRank"> ' +
                                                currUser.name +'&nbsp&nbsp&nbsp'+ '<br/> Current average: '+ averageData+
                                                '</span></li>');
                                                $('#rank-data').listview('refresh');
                                                $('#rank-data').trigger('create');
                                            }
                                        }
                                    }
                                });
                            })(currUser);
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
        })(userid);
    };

    //handling the click on Rank Update button
    $("#rank-data").on("click", ".rank_update", function(e){

        //getting the data from the list element
        var userChosen =  e.target.id;
        var chosenRank =$(e.target.parentElement.parentElement).children(".points").val();

        //getting the user id from the storage
        var userid = localStorage.getItem('userid')  ;

        //updating the previous rank
        (function(userChosen,chosenRank,userid){
            $.ajax({
                type: "POST",
                url: "updateRank",
                cache: false,
                data:
                {
                    user_id : userChosen,
                    ranking_user_id : userid,
                    points : chosenRank
                },
                success: function(data) {

                    if(data.done === "true")     // the update passed successfully
                    {
                        refresh();
                    }
                    else    // update error -  wrong data etc...
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
        })(userChosen,chosenRank,userid);
    });

    //handling the click on Add Rank button
    $("#rank-data").on("click", ".rank_add", function(e){

        //getting the data from the list element
        var userChosen =  e.target.id;
        var chosenRank =$(e.target.parentElement.parentElement).children(".points").val();

        //getting the user id from the storage
        var userid = localStorage.getItem('userid')  ;

        //adding a new rank
        (function(userChosen,chosenRank,userid){
            $.ajax({
                type: "POST",
                url: "addRank",
                cache: false,
                data:
                {
                    user_id : userChosen,
                    ranking_user_id : userid,
                    points : chosenRank
                },
                success: function(data) {

                    if(data.done === "true")  //no error - refreshing the list
                    {
                        refresh();
                    }
                    else    //error during the add
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
        })(userChosen,chosenRank,userid);
    });

    // preparing the page before loading
    $( '#usersrank' ).live( 'pagebeforeshow',function(event){
        refresh();
    });
});

$(document).ready(function() {
    $("#chat").click(function(){
        var url = "/chat.html"
        var thePopup = window.open( url, "Chat", "location=0,height=300,width=300" );

    });
});


