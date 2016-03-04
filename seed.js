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


albumList.push({
  album_name: "Chosen Lords", 
  artist_name: "Aphex Twin", 
  release_year: 2006 
});

// var TrackSchema = new Schema({
//   track_name: String,  
//   track_num: Number,
//   bpm: Number,
//   notes: String
// });


var sampleTracks = [];

sampleTracks.push({ track_name: 'Swamped',
                   track_num: 1
});
sampleTracks.push({ track_name: "Heaven's a Lie",
                   track_num: 2
});
sampleTracks.push({ track_name: 'Daylight Dancer',
                   track_num: 3
});
sampleTracks.push({ track_name: 'Humane',
                   track_num: 4
});
sampleTracks.push({ track_name: 'Self Deception',
                   track_num: 5
});
sampleTracks.push({ track_name: 'Aeon',
                   track_num: 6
});
sampleTracks.push({ track_name: 'Tight Rope',
                   track_num: 7
});



albumList.forEach(function(album) {
  album.tracks = sampleTracks;
});



db.Album.remove({}, function(err, albums){

  db.Album.create(albumList, function(err, albums){
    if (err) { return console.log('ERROR', err); }
    console.log("all albums:", albums);
    console.log("created", albums.length, "albums");
    albums.forEach(function(album){
      console.log(album.tracks)
    })
    process.exit();
  });

});



