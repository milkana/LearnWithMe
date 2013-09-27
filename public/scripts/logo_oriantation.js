/**
 * Created with JetBrains WebStorm.
 * User: Admin
 * Date: 9/13/13
 * Time: 9:36 AM
 * To change this template use File | Settings | File Templates.
 */

$( '#home' ).live( 'pageinit',function(event){
    if (window.DeviceOrientationEvent) {
        console.log("DeviceOrientation is supported");
        window.addEventListener('deviceorientation', function(eventData)
        {
            // get event data
            var LR = eventData.gamma;
            var FB = eventData.beta;
            var DIR = eventData.alpha;
            deviceOrientationHandler(LR, FB, DIR);
        }, false);
    }
    else
    {
        console.log("Not supported on your device or browser.  Sorry.");
    }

    // rotate logo
    function deviceOrientationHandler(LR, FB, DIR) {
        // Apply the transform to the image
        var logo = document.getElementById("imgLogo");
        logo.style.webkitTransform ="rotate("+ LR +"deg) rotate3d(1,0,0, "+ (FB*-1)+"deg)";
        logo.style.MozTransform = "rotate("+ LR +"deg)";
        logo.style.transform ="rotate("+ LR +"deg) rotate3d(1,0,0, "+ (FB*-1)+"deg)";
    }
});
