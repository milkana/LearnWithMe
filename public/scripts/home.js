


// Get details in ajax
$( '#home' ).live( 'pageshow',function(event){
    var userid = localStorage.getItem('userid')  ;

    var url = "users/"+userid;

    (function(){
        $.ajax({
            type: "GET",
            url: url,
            cache: false,
            success: function(data) {
                if(data.done === "false")
                {
                    // do nothing
                }
                else
                {
                    // Welcome
                    if((data.name) && (data.email))
                    {
                        document.getElementById("username").innerHTML="Hi " + data.name + " ,";
                        document.getElementById("useremail").innerHTML="e-mail: " + data.email;
                    }

                    (function(data){
                        // Getting majors
                        $.ajax({
                            type: "GET",
                            url: "majors/" + data.major,
                            cache: false,
                            success: function(dataMajor) {
                                if(dataMajor.name)
                                {
                                  document.getElementById("major").innerHTML="Learning: " + dataMajor.name;
                                }
                            }
                        });
                    })(data);

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

});
