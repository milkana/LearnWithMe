/**
 * Created with JetBrains WebStorm.
 * User: yh
 * Date: 05/09/13
 * Time: 19:06
 * To change this template use File | Settings | File Templates.
 */

$( '#newgroup' ).live( 'pageinit',function(event){
    var userid = localStorage.getItem('userid');

    // Getting major of user
    (function(userid){
        $.ajax({
            type: "GET",
            url: "users/" + userid,
            cache: false,
            success: function(data){

                var major = data.major;

                // Getting courses of major
                (function(major)
                {
                    $.ajax({
                        type: "GET",
                        url: "courses/major/" + major,
                        cache: false,
                        success: function(coursedata){
                            $.each(coursedata,function(){
                                $('#new_course').append('<option value="' + this._id +'">'+ this.name +'</option>');
                            })
                        }
                    });
                })(major);

            }

        });
    })(userid);


    // Validate input
    $("#openNewForm").validate({

        // Beautifully insert error in combo
        errorPlacement: function(error, element) {
            if (element.attr("name") === "new_course") {
                error.insertAfter($(element).parent());
            } else {
                error.insertAfter(element);
            }
        } ,

        submitHandler: function(form) {
            // Preparing params
            var date = $('#new_start_date').val(), time= $('#new_start_time').val() ;

            var fullDate = new Date(date+' '+time+ ':00').toISOString();

            var userid = localStorage.getItem('userid');

            // Creating group in DB
            (function(userid,fullDate){
                $.ajax({
                    type: "POST",
                    url: "addGroup",
                    cache: false,
                    data:
                    {
                        location: $('#new_location_desc').val() , // description or address
                        course: $('#new_course').val() ,
                        target: $('#new_target').val() ,
                        meeting_org: userid,
                        start_time: fullDate,
                        location_point_x : $('#latitude').val(),
                        location_point_y : $('#longitude').val()
                    },
                    success: function(data) {
                        if(data.done === "true")
                        {
                            $.mobile.changePage($("#home"));

                            // Init
                            $('#new_location_desc').val("") ;
                            $('#new_course').val("");
                            $('#new_target').val("");
                            $('#new_start_date').val("");
                            $('#new_start_time').val("");

                        }else      // did not add group
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
            })(userid,fullDate);

        }
    });

});

// Place marker on map
function placeMarker(location) {

    newMap.clearOverlays();

    var marker = new google.maps.Marker({
        position: location,
        map: newMap
    });

    markersArray.push(marker);

    // Update hiddens
    $("#latitude").val(location.lat()) ;
    $("#longitude").val(location.lng()) ;

}

// Getting point of address
function showAddress(address) {

    geocoder.geocode( { 'address': address}, function(results, status) {

        if (status == google.maps.GeocoderStatus.OK) {
            placeMarker(results[0].geometry.location);
            newMap.setCenter(results[0].geometry.location);
        }
    })};

var myCenter;
var newMap;
var marker;
var markersArray = [];
var geocoder;

$("#open_new").promise().done(function() {

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
        var location=new google.maps.LatLng(32.054717,34.775248); // default is arlozorov
        initMap(location);
    }

    function initMap(position)
    {
        myCenter = position;
        newMap.setCenter(myCenter);

        // Creating marker
        var marker = new google.maps.Marker({
            position: myCenter,
            map: newMap
        });

        // Init
        $("#latitude").val(myCenter.lat()) ;
        $("#longitude").val(myCenter.lng()) ;

        markersArray.push(marker);
        google.maps.event.addListener(newMap, 'click', function(event) {
            placeMarker(event.latLng, newMap);
        });


        $( document ).bind( "pageshow", function( event, data ){
            google.maps.event.trigger(newMap, 'resize');
            newMap.setCenter(myCenter);
        });
    }


    // Init map
    function initialize()
    {
        var mapProp = {
            zoom:15,
            mapTypeId:google.maps.MapTypeId.ROADMAP
        };

        newMap = new google.maps.Map(document.getElementById("new_map"),mapProp);
        geocoder = geocoder = new google.maps.Geocoder();  // for the address coder



        if(navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(function(position) {;
                var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                initMap(geolocate);

            },NoPosition);

        }
        else
        {
            defaultLocation();
        }
    }

    google.maps.Map.prototype.clearOverlays = function() {
        for (var i = 0; i < markersArray.length; i++ ) {
            markersArray[i].setMap(null);
        }
    }

    google.maps.event.addDomListener(window, 'load', initialize);
});



