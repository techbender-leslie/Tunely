var mongoose = require("mongoose"); // require mongoose
var TrackSchema = require('./track'); // require track schema 

//Album Schema created
var AlbumSchema = mongoose.Schema({
  album_name: String,
  artist_name: String,
  release_year: Number,
  track: [TrackSchema]
});

//declaring variable Album exporting
var Album = mongoose.model('Album', AlbumSchema);

//exporting Albums to server.js
module.exports = Album; 