// This file allows us to seed our application with data
// simply run: `node seed.js` from the root of this project folder.

// require 
var mongoose = require('mongoose');
var conn = mongoose.connect('mongodb://localhost/tunely-app');
var db = require("./models");

var albumsList =[]; 

albumsList.push({
  album_name: "Sheet One", 
  artist_name: "Richie Hawtin", 
  release_year: 1993 
}); 

albumsList.push({
  album_name: "YosepH", 
  artist_name: "Luke Vibert", 
  release_year: 2003 
}); 

db.Album.remove({}, function(err, albums){

  db.Album.create(albumsList, function(err, albums){
    if (err) { return console.log('ERROR', err); }
    console.log("all albums:", albums);
    console.log("created", albums.length, "albums");
    process.exit();
  });

});