var mongoose = require("mongoose"); // require mongoose

//Album Schema created
var AlbumSchema = mongoose.Schema({
  album_name: String,
  artist_name: String,
  release_year: Number,
  track: [TrackSchema]
});

//declaring variable Album exporting
var Album = moogose.model('Album', AlbumSchema);

//exporting Albums to server.js
module.exports = Album; 