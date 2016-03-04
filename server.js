// SERVER-SIDE JAVASCRIPT


// dependencies
var express = require('express');
var app = express();
var mongoose = require('mongoose');

var bodyParser = require('body-parser');
var logger = require('morgan');
var path = require('path');
// var ejs = require('ejs');

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

app.use(logger('dev'));
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', './views');
// app.set('view engine', 'ejs');

/************
 * DATABASE *
 ************/
var db = require('./models');

/*
 * HTML Endpoints
 */

app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api', function api_index (req, res){
  res.json({
    message: "Welcome to tunely!",
    documentation_url: "https://github.com/tgaff/tunely/api.md",
    base_url: "http://tunely.herokuapp.com",
    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints"}
    ]
  });
});

// GET /api/albums
app.get('/api/albums', function albumsIndex(req, res) {
  db.Album.find({}, function(err, albums) {
    res.json(albums);
  });
});


// POST  /api/albums
app.post('/api/albums', function albumCreate(req, res){
  console.log('body', req.body);

  // Connect the POST route to the database
  db.Album.create(req.body, function(err, album){
    if (err) {
      console.log('error', err);
    } 
    console.log(album);
    res.json(album); 
  });
});

//Delete 
app.get('/api/albums/:id', function albumDestroy(req,res) {
  // database remove album by ID
  db.Album.removeById(req.params.id, function(err, album){
    if (err) {
      console.log('error', err);
    } 
    // remove if not needed for console logging
    console.log(album._id);
    //status 200 and redirect back to root directory
    res.redirect (200, "/");
  });
});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
