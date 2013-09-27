/**
 * Created with JetBrains WebStorm.
 * User: Admin
 * Date: 9/13/13
 * Time: 11:35 AM
 * To change this template use File | Settings | File Templates.
 */

$( '#sys_msgs' ).live( 'pageinit',function(event){
    "use strict";

    var conn = null;
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
        $('#content_msgs').html($('<p>', { text: 'Sorry, but your browser doesn\'t '
            + 'support WebSockets.'} ));
        $('#msg_form').hide();
        return;
    }

    // connects to the websocket
    var connect = function (){
        var connTimeOut;
        // open conn
        conn = new WebSocket("ws://"+window.location.hostname +":8888",'echo-protocol');

        $('#disconnectspan').show();
        $('#connectspan').hide();
        $('#msg_form').show();

        conn.onopen = function () {
            clearInterval(connTimeOut);
            console.log("on open event");
        };

        conn.onerror = function (error) {
            console.log("on error event");
        };

        conn.onclose = function () {
            console.log("on close event");
        };

        // most important part - incoming messages
        conn.onmessage = function (message) {

            // try to parse JSON message. Because we know that the server always returns
            // JSON this should work without any problem but we should make sure that
            // the massage is not chunked or otherwise damaged.
            try {

                $('#content_msgs').append(message.data);

                // scroll
                $('#content_msgs').stop().animate({
                    scrollTop: $("#content_msgs")[0].scrollHeight
                }, 800);

            } catch (e) {
                //  probably invalid json
                console.log("error in onmessage");
                return;
            }


        };

        /**
         * If the server wasn't able to respond to the
         * in 5 seconds then show some error message to notify the user that
         * something is wrong.
         */
        connTimeOut = setInterval(function() {
            if (conn.readyState !== 1) {
                console.log('Unable to comminucate with the WebSocket server.');
                $('#content_msgs').html($('<p>', { text: 'Unable to comminucate with the WebSocket server.'} ));
                $('#msg_form').hide();
                $('#connectspan').hide();
                $('#disconnectspan').hide();
            }
        }, 5000);
    };

    // connect to ws
    connect();

    $('#disconnect').click(function(e){
        e.preventDefault();
        if (conn)
        {
            // closeconnection. not show sending input
            conn.close();
            console.log("closing the connection");
            $('#connectspan').show();
            $('#disconnectspan').hide();
            $('#msg_form').hide();

        }
    });

    $('#connect').click(function(e){
        e.preventDefault();
         connect();
    });


    $('#post_submit').click(function(e)
    {
        e.preventDefault();
        var name = localStorage.getItem('name')  ;
        var msg = $('#msg').val();
        if ($('#msg').val().length > 0)
        {
            console.log(name+":"+msg);
            var date = new Date();
            conn.send("<div><"+date.getHours()+":"+date.getMinutes()+"> <span class='username'> " + name + "</span> : <span class='message'>" + msg + "</span></div><br/>");
        }
        $('#msg').val("");
    } );
});

