/**
 * Created with JetBrains WebStorm.
 * User: yh
 * Date: 03/09/13
 * Time: 00:56
 * To change this template use File | Settings | File Templates.
 */

$( '#login' ).live( 'pageinit',function(event){

    // Validating form
    $("#loginForm").validate({

        submitHandler: function(form) {
            // Authenticate
            $.ajax({
                type: "POST",
                url: "auth",
                cache: false,
                data:
                {
                    email: $('#email').val() ,
                    password: $('#password').val()
                },
                success: function(data) {

                    if((data.auth === "true") && (data.userid !== null) && (data.userid !== undefined))
                    {
                        // Authenticated. Keep userid
                        localStorage.setItem('userid', data.userid);
                        localStorage.setItem('name', data.name);

                        $.mobile.changePage($("#home"));  // go home
                    }else      // password incorrect
                    {
                        // show error message
                        $.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, "The email you entered or the password was incorrect.", true );

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
        }
    });
});