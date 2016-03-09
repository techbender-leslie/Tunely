// SERVER-SIDE JAVASCRIPT


// Middleware
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var path = require('path');
var cookieParser = require('cookie-parser');
var hbs = require('hbs');

// serve static files from public folder
app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', './views');
app.set('view engine', 'hbs');

// Setting up the Passport Strategies
require("./config/passport")(passport);


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

 app.get('/', function(req, res){
  res.render('button', {user: req.user});
});

app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email'} ));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/'
  })
);

// <- GitHub
app.get('/auth/github',
  passport.authenticate('github', { scope: "user" })
);

app.get('/auth/github/callback',
  passport.authenticate('github', { successRedirect: '/', failureRedirect: '/' })
);

// Logout
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});


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


// POST /api/albums
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

// GET /api/albums/:id
app.get('/api/albums/:id', function albumShow(req, res) {
  console.log(req.params.id);
  db.Album.findOne({_id: req.params.id}, function(err, album) {
    res.json(album);
  });
});

// GET api/albums/:id/tracks 
app.get('/api/albums/:id/tracks', function albumShow(req, res) {
  console.log('requested album id=', req.params.id);
  db.Album.findOne({_id: req.params.id}, function(err, album) {
    res.json(album.tracks);
  });
});

// POST /api/albums/:id/tracks
app.post('/api/albums/:albumId/tracks', function tracksCreate(req, res) {
  console.log('body', req.body);
  db.Album.findOne({_id: req.params.albumId}, function(err, album) {
    if (err) { 
      console.log('error', err); 
    }
    var track = new db.Track(req.body);
    album.tracks.push(track);
    album.save(function(err, savedAlbum) {
      if (err) { console.log('error', err); }
      console.log('saved album: ', savedAlbum);
      res.json(track);
    });
  });
});

/// DELETE /api/albums:id ///////////////////
app.delete('/api/albums/:id', function albumDestroy(req,res) {
  console.log(req.params.id);
  // database remove album by ID
  db.Album.remove({_id: req.params.id}, function(err, album){
    if (err) {
      console.log('error', err);
    } 
    console.log(album._id);
    //status 200 and redirect back to root directory
    res.redirect (200, "/");
  });
});


///// UPDATE Album
app.put('/api/albums/:id', function updateAlbum(req, res) {
  console.log('body', req.body);
  db.Album.findOne({_id: req.params.id}, function(error, album) {
    if (error) { console.log('error', error); }
    album.album_name = req.body.album_name; 
    album.artist_name = req.body.artist_name; 
    album.release_year = req.body.release_year;
    album.save(function (error, saved) {
      if (error) { console.log('Could not update album: ' + error); }
      res.json(saved);
          });
    });
});


//UPDATE track in album
app.put('/api/albums/:albumId/tracks/:id', function(req, res) {
  var albumId = req.params.albumId;
  var trackId = req.params.id;
  db.Album.findOne({_id: albumId}, function (err, currentAlbum) {
    var currentTrack = currentAlbum.tracks.id(trackId);
      currentTrack.track_name = req.body.track_name;
      currentTrack.track_num = req.body.track_num;
      currentTrack.bpm = req.body.bpm;

    currentAlbum.save(function(err, saved) {
      if(err) {console.log('error', err); }
      res.json(saved);
    });
  });
});

//DELETE track from album
app.delete('/api/albums/:albumId/tracks/:id', function(req, res) {
  var albumId = req.params.albumId;
  var trackId = req.params.id;
  //console.log(req.params);
  db.Album.findOne({_id: albumId}, function (err, currentAlbum){
    if (err) {console.log(error, err);}
    var currentTrack = currentAlbum.tracks.id(trackId);

    currentTrack.remove();
    currentAlbum.save(function(err, saved) {
      if(err) { console.log('error', err); }
      res.json(saved);
    });
  });
});




/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
