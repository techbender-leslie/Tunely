// This file allows us to seed our application with data
// simply run: `node seed.js` from the root of this project folder.

// require 

var db = require("./models");

var albumList =[]; 

albumList.push({
  album_name: "Sheet One", 
  artist_name: "Richie Hawtin", 
  release_year: 1993 
}); 

albumList.push({
  album_name: "YosepH", 
  artist_name: "Luke Vibert", 
  release_year: 2003 
}); 

// var TrackSchema = new Schema({
//   track_name: String,  
//   track_num: Number,
//   bpm: Number,
//   notes: String
// });


var sampleTracks = [];

sampleTracks.push({ name: 'Swamped',
                   trackNumber: 1
});
sampleTracks.push({ name: "Heaven's a Lie",
                   trackNumber: 2
});
sampleTracks.push({ name: 'Daylight Dancer',
                   trackNumber: 3
});
sampleTracks.push({ name: 'Humane',
                   trackNumber: 4
});
sampleTracks.push({ name: 'Self Deception',
                   trackNumber: 5
});
sampleTracks.push({ name: 'Aeon',
                   trackNumber: 6
});
sampleTracks.push({ name: 'Tight Rope',
                   trackNumber: 7
});



albumList.forEach(function(album) {
  album.tracks = sampleTracks;
});


db.Album.remove({}, function(err, albums){

  db.Album.create(albumList, function(err, albums){
    if (err) { return console.log('ERROR', err); }
    console.log("all albums:", albums);
    console.log("created", albums.length, "albums");
    process.exit();
  });

});



