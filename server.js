// SERVER-SIDE JAVASCRIPT


// dependencies
var express = require('express');
var app = express();
var mongoose = require('mongoose');

var bodyParser = require('body-parser');
var logger = require('morgan');
var path = require('path');
// var ejs = require('ejs');

// var albumArt = require(album-art);

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
  var songId = req.params.id;
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
