var mongoose = require("mongoose"); // require mongoose
var Schema = mongoose.Schema;

var Track = require('./track');

//Album Schema created
var AlbumSchema = new Schema({
  album_name: String,
  artist_name: String,
  release_year: Number,
  albumArt: String,
  tracks: [Track.schema]  //how is this different than TrackSchema
});

//declaring variable Album exporting
var Album = mongoose.model('Album', AlbumSchema);

//exporting Albums to server.js
module.exports = Album; 