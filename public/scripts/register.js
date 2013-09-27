/**
 * Created with JetBrains WebStorm.
 * User: yh
 * Date: 05/09/13
 * Time: 14:02
 * To change this template use File | Settings | File Templates.
 */

$(document).on("pageshow", "#register", function() {

    // Getting all majors
    (function(){
        $.ajax({
            type: "GET",
            url: 'majors',
            cache: false,
            success: function(data){
                $.each(data,function(){
                        $('#reg_major').append('<option value="' + this._id +'">'+ this.name +'</option>');
                    }
                )
            }
        });
    })();

    // Validating form
    $("#registerForm").validate({

        // Beatifully placing error under combo
        errorPlacement: function(error, element) {
            if (element.attr("name") === "reg_major") {
                error.insertAfter($(element).parent());
            } else {
                error.insertAfter(element);
            }
        } ,

        submitHandler: function(form) {

            // Adding user via ajax
            $.ajax({
                type: "POST",
                url: "addUser",
                cache: false,
                data:
                {
                    name: $('#reg_username').val() ,
                    email: $('#reg_email').val().toLowerCase() ,
                    major: $('#reg_major').val() ,
                    password: $('#reg_password').val()
                },
                success: function(data) {

                    if(data.done === "true")
                    {
                        // Add was successful. Keep user id
                        localStorage.setItem('userid', data.userid);
                        localStorage.setItem('name', data.name);

                        $.mobile.changePage($("#home"));  // go home
                    }else     // not saved
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

        }
    });
});