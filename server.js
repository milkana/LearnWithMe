var express = require('express');
var dbconnection = require('./js/dbconnection');
var getqueries = require('./js/queries/get');
var deletequeries = require('./js/queries/delete');
var postqueries = require('./js/queries/post');
var path = require('path')

var staticMiddleware = express.static(__dirname + "/views");


var port = (process.env.VMC_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || 'localhost');

//creating the framework and the configurations
var app = express();
app.configure(function () {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(express.session({ secret: 'keyboard cat' }));
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

// connect to db
dbconnection.connect();

app.get("/:file", function(req, res, next) {
    var authorized = true;
    //Compute authorization appropriately here
    if (authorized) {
        staticMiddleware(req, res, next);
    } else {
        res.send(401);
    }
});

// the specific operations for our server
app.get('/', function(req,res){
    res.redirect('./index.html')
});

app.get('/majors',getqueries.getMajors);
app.get('/groups',getqueries.getGroups);
app.get('/ranks',getqueries.getRanks);
app.get('/users',getqueries.getUsers);
app.get('/users/:id',getqueries.getUserByID);
app.get('/majors/:id',getqueries.getMajorByID);
app.get('/group/:id',getqueries.getGroupByID);
app.get('/groups/course/:id',getqueries.getGroupsByCourseID);
app.get('/courses',getqueries.getCourses);
app.get('/course/:id',getqueries.getCourseByID);
app.get('/courses/major/:id',getqueries.getCoursesByMajorID);
app.get('/email/:email',getqueries.getUserByEmail);
app.get('/averageRank/:id',getqueries.getAverageRankById);
app.get('/users/group/:id',getqueries.getUsersInGroup);
app.get('/groups/organizer/:id',getqueries.getGroupsByOrganizerID);
app.get('/ranks/ranking_user/:id',getqueries.getRanksByRankingUserID);

app.post('/addUser', postqueries.addUser);
app.post('/addGroup', postqueries.addGroup);
app.post('/addUserToGroup',postqueries.addUserToGroup);
app.post('/removeUserFromGroup',postqueries.removeUserFromGroup);
app.post('/addRank',postqueries.addRank);
app.post('/deleteRank',postqueries.deleteRank);
app.post('/updateRank',postqueries.updateRank);
app.post('/auth',postqueries.authenticate);
app.post('/requestJoin',postqueries.requestJoin);
app.delete('/groups/:id',deletequeries.deleteGroupByID);

app.listen(port,host);

console.log("Server is up!");



