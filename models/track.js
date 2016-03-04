var mongoose = require("mongoose"); // require mongoose 

//Create tracks Schema
var TrackSchema = mongoose.Schema({
  track_name: String,  
  track_num: Number,
  bpm: Number,
  notes: String
});

//declaring variable for exporting
var Track = mongoose.model('Track', TrackSchema);

//Exporting Track to server.js
module.exports = Track;