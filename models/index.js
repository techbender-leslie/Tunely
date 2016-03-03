var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/tunely");
process.on('exit', function() { mongoose.disconnect(); });

module.exports.Album = require("./album");
module.exports.Track = require("./track");