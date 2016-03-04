var mongoose = require("mongoose");
mongoose.createConnection("mongodb://localhost/tunely");

module.exports.Album = require("./album");
module.exports.Track = require("./track");