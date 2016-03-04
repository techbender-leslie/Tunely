var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/tunely");

var Album = require('./album');
var Track = require('./track');

module.exports.Album = Album;
module.exports.Track = Track;

