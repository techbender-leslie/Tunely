var mongoose = require("mongoose"); // require mongoose 
var Schema = mongoose.Schema;

//Create tracks Schema
var TrackSchema = new Schema({
  track_name: String,  
  track_num: Number,
  bpm: Number,
  notes: String
});

//declaring variable for exporting
var Track = mongoose.model('Track', TrackSchema);

//Exporting Track to server.js
module.exports = Track; 