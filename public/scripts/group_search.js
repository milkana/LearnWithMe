/**
 * Created with JetBrains WebStorm.
 * User: yh
 * Date: 05/09/13
 * Time: 18:14
 * To change this template use File | Settings | File Templates.
 */



var markersArray = [];
var infoArray = [];
var map;
var myCenter;

// Parse the date in the wanted string
function getDate(dateString)
{
    var date = new Date(dateString);
    var day = date.getDate();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var hour = date.getHours();
    var min = date.getMinutes();

    return day + "/" + month + "/" + year + " " + hour + ":" + min;
}

// Adding request to the user to join the wanted group
function requestJoin(userid,groupid)
{
    $.ajax({
        type: "POST",
        url: "requestJoin",
        cache: false,
        data:
        {
            user_id: userid ,
            group_id: groupid
        },
        success: function(data) {
            // Refreshing the info-content of the group marker
            for (var i = 0; i < infoArray.length; i++ ) {
                if (infoArray[i].groupid == groupid)
                {
                    refreshInfoContent(infoArray[i]);
                }
            }}})
}

// Clearing all the markers
function clearOverlays() {
    for (var i = 0; i < markersArray.length; i++ ) {
        markersArray[i].setMap(null);
    }
    markersArray = [];
    infoArray = [];
}

// Refresh marker
function refreshInfoContent(infoContent)
{
    var result = "<div class='infoBox'>";
    var date = getDate(infoContent.starttime);
    result += "<h2>" + infoContent.target + "</h2>" + "<p> Start Time:" + date + "<br> Location:" + infoContent.location + "<br> Organizer:"+ infoContent.organizer;

    result += "<br> Participants:";

    // Getting the users in the group
    $.ajax({
        type: "GET",
        url: "users/group/" + infoContent.groupid,
        cache: false,
        success: function(data){

            $.each(data,function(){

                // Creating the string of the group participants names
                result += this.name + ",";
            })

            result = result.substring(0,result.length - 1);
            result += " <br> You already requested to join";
            result += "</p>" + "</div>";
            infoContent.setContent(result);
        }})
}

// Add marker
function addMarker(group) {

    // Markers
    var marker=new google.maps.Marker({
        position:new google.maps.LatLng(group.location_point.X,group.location_point.Y)
    });

    marker.setMap(map);
    markersArray.push(marker);

    // Zoom to 9 when clicking on marker
    google.maps.event.addListener(marker,'click',function() {
        map.setZoom(15);
        map.setCenter(marker.getPosition());
    });

    // Building thw infoWindow
    var result = "<div class='infoBox'>";
    var date = getDate(group.start_time);
    result += "<h2>" + group.target + "</h2>" + "<p> Start Time:" + date + "<br> Location:" + group.location;
    var usersArray = group.users_in_group;

    if (usersArray.length > 0)
    {
        // Getting the users in the group
        $.ajax({
            type: "GET",
            url: "users/group/" + group._id,
            cache: false,
            success: function(data){

                var isCurrentUserInGroup = false;
                var userid = localStorage.getItem('userid');
                var organizerName;
                var names = "<br> Participants:";
                $.each(data,function(){

                    // Creating the string of the group participants names
                    names += this.name + ",";

                    // Checking if this is the current user
                    if (userid == this._id)
                    {
                        isCurrentUserInGroup = true;
                    }
                    // Getting the group orginaizer name
                    if (group.meeting_org == this._id)
                    {
                        organizerName = this.name;
                    }

                })

                names = names.substring(0,names.length - 1);
                result += "<br> Organizer:" + organizerName;
                result += names;

                // Creating message to the info window
                if (isCurrentUserInGroup)
                {
                    result += " <br> You are registered in this group.";
                }
                else
                {
                    // Check if the user alerday requested to join the group
                    if ($.inArray(userid,group.requesting_to_join) > -1)
                    {
                        result += " <br> You already requested to join";
                    }
                    else
                    {
                        result += "<a href=\"";
                        result += "javascript:requestJoin('"+ userid + "','" + group._id;
                        result += "');\"";
                        result += "> Request To Join </a>";
                    }
                }

                result += "</p>" + "</div>";

                var infowindow = new google.maps.InfoWindow({
                    content:result,
                    groupid:group._id,
                    starttime:group.start_time,
                    location:group.location,
                    target:group.target,
                    organizer:organizerName
                });

                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.open(map,marker);
                });

                infoArray.push(infowindow);

            }});
    }
}


$("#groupsearch").promise().done(function() {

    function NoPosition(error)
    {
        var errors = {
            1: 'Permission denied',
            2: 'Position unavailable',
            3: 'Request timeout'
        };
        console.log("Error: " + errors[error.code]);

        defaultLocation();
    }

    function defaultLocation()
    {
        myCenter=new google.maps.LatLng(32.054717,34.775248); // just a default- arlozorov
        map.setCenter(myCenter);
    }

    function initialize()
    {
        var mapProp = {
            zoom:15,
            mapTypeId:google.maps.MapTypeId.ROADMAP
        };

        map=new google.maps.Map(document.getElementById("map"),mapProp);

        if(navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(function(position) {
            myCenter = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(myCenter);

            },NoPosition);

        }
        else
        {
            defaultLocation();
        }


        var userid = localStorage.getItem('userid');

        // Getting the major of the user
        (function(userid){
            $.ajax({
                type: "GET",
                url: "users/" + userid,
                cache: false,
                success: function(data){
                    var major = data.major;

                    // Getting the courses by the major
                    (function(){$.ajax({
                        type: "GET",
                        url: "courses/major/" + major,
                        cache: false,
                        success: function(data){
                            $.each(data,function(){
                                // Adding the courses
                                $('#select-choice-1').append('<option value="' + this._id +'">'+ this.name +'</option>');
                            })}});
                    })();

                    $('#select-choice-1')
                        .change(function () {

                            // Get The Selected Course
                            var selectedCourse = $('#select-choice-1').find(":selected").val();

                            if (selectedCourse > 0)
                            {
                                // Remove the markers
                                clearOverlays();

                                // Get The groups for the course
                                (function(selectedCourse){
                                    $.ajax({
                                        type: "GET",
                                        url: "groups/course/" + selectedCourse,
                                        cache: false,
                                        success: function(data){
                                            $.each(data,function(){
                                                    // Add the Markers
                                                    addMarker(this);
                                                }
                                            )
                                        }
                                    });
                                })(selectedCourse);

                            }
                        })
                        .change();
                }});
        })(userid);

        $( document ).bind( "pageshow", function( event, data ){
            google.maps.event.trigger(map, 'resize');
            map.setCenter(myCenter);
        });
    }

    google.maps.event.addDomListener(window, 'load', initialize);
});

