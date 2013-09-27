/**
 * Created with JetBrains WebStorm.
 * User: yh
 * Date: 05/09/13
 * Time: 17:34
 * To change this template use File | Settings | File Templates.
 */

 // Load same footer on pages
$(document).on('pageinit', function(event){
    $(".footerDiv").load('footer.html', function(){$(this).trigger("create")});
});