/**
 * Created with JetBrains WebStorm.
 * User: yh
 * Date: 04/09/13
 * Time: 15:04
 * To change this template use File | Settings | File Templates.
 */


// Whenever comming those pagesgo to login if not logged in
$( '#home, #groupsearch, #newgroup, #approve, #groupsin, #usersrank, #sys_msgs' ).live( 'pagebeforeshow',function(event){

        if((localStorage.getItem('userid') == null) || (localStorage.getItem('userid') == undefined))
        {
            $.mobile.changePage($("#login"));
        }
    }
);

