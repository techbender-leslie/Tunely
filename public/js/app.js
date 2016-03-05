
// render the albums index on the page
$(document).ready(function() {
  console.log('app.js loaded!');

  // when successful load albums function
  $.get('/api/albums').success(function(albums){
    // for each render album
    console.log(albums);

    albums.forEach(function(album) {  //renders each album in db
      renderAlbum(album);
    });
  });

// Use jquery to capture the form values
  $('#album-form form').submit(function(event) {
    event.preventDefault();
    // serialize form data 
    var formData = $(this).serialize();
    console.log(formData);
    $.post('/api/albums', formData, function(album) {
      // console log the output
      console.log('album after POST', album);
      //render the server's album data
      renderAlbum(album);  
    });
    $(this).trigger("reset");
  });
  // form needs to be inside ready function to workk

$('#albums').on('click', '.add-track', function(e) {
    console.log('asdfasdfasdf');
    var id= $(this).parents('.album').data('album-id'); // "5665ff1678209c64e51b4e7b"
    console.log('id',id);
    $('#trackModal').data('album-id', id);
    $('#trackModal').modal();
});
    $('#saveTrack').on('click', handleNewTrackSubmit); 
    $('#albums').on('click', '.delete-album', handleDeleteAlbumClick); 
    $('#albums').on('click', '.update-album', handleEditalbumclick);
});

/////////////* End document ready *///////////////////

// function getAlbumRowById(id) {
//   return $('[data-album-id=' + id + ']');
// }

function handleEditAlbumClick(e) {
  var albumId = $(this).parents('.album').data('album-id');
  var $gomez = $('[data-album-id=' + albumId + ']');

  // var $albumRow = getAlbumRowById(albumId);

  console.log('attempt to edit id', albumId);

  // replace edit button with save button
  $(this).parent().find('.btn').hide();
  $(this).parent().find('.default-hidden').show();

  // replace current spans with inputs
  var albumName = $gomez.find('span.album-name').text();
  $gomez.find('span.album-name').html('<input class="edit-album-name" value="' + albumName + '"></input>');

  var artistName = $gomez.find('span.artist-name').text();
  $gomez.find('span.artist-name').html('<input class="edit-artist-name" value="' + artistName + '"></input>');

  var releaseDate = $gomez.find('span.album-release-date').text();
  $gomez.find('span.album-release-date').html('<input class="edit-album-release-date" value="' + releaseDate + '"></input>');
}


//////////// DELETE ///////////////

function handleDeleteAlbumClick(event){
  var albumId = $(this).parents('.album').data('album-id'); 
  console.log("delete" + albumId);
  $.ajax({
    method: 'DELETE', 
    url: ('/api/albums/' + albumId), 
    success: function(){
      console.log("Album deleted"); 
      $('[data-album-id=' + albumId + ']').remove();
    }
  });
}

//////////// END DELETE ///////////////

// handles the modal fields and POSTing the form to the server
function handleNewTrackSubmit(e) {
  var albumId = $('#trackModal').data('album-id');
  var trackName = $('#trackName').val();
  var trackNumber = $('#trackNumber').val();
  var trackBpm = $('#trackBpm').val();


  var formData = {
    track_name: trackName,
    track_num: trackNumber, 
    bpm: trackBpm
  };

  var postUrl = '/api/albums/' + albumId + '/tracks';
  console.log('posting to ', postUrl, ' with data ', formData);

  $.post(postUrl, formData)
    .success(function(track) {
      console.log('track', track);

      // re-get full album and render on page
      $.get('/api/albums/' + albumId).success(function(album) {
        //remove old entry
        $('[data-album-id='+ albumId + ']').remove();
        // render a replacement
        renderAlbum(album);
      });

      //clear form
      $('#trackName').val('');
      $('#trackNumber').val('');
      $('#trackBpm').val('');
      $('#trackModal').modal('hide');

    });
}

function buildTracksHtml(tracks) {
  var trackText = " ";
  tracks.forEach(function(track) {
     trackText = trackText + "#" + track.track_num + " " + track.track_name + "  &ndash; BPM: " + track.bpm + " <br>";
  });

  var tracksHtml  =
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Tracks: </h4> <br>" +
  "                         <span>" + trackText + "</span>" +
  "                      </li>";
  return tracksHtml;
}

// var TrackSchema = new Schema({
//   track_name: String,  
//   track_num: Number,
//   bpm: Number,
//   notes: String
// });

// this function takes a single album and renders it to the page
function renderAlbum(album){
  console.log('rendering album:', album);
  var albumHtml =
  "        <!-- one album -->" +
  "        <div class='row album' data-album-id='" + album._id + "'>" +
  "          <div class='col-md-10 col-md-offset-1'>" +
  "            <div class='panel panel-default'>" +
  "              <div class='panel-body'>" +
  "              <!-- begin album internal row -->" +
  "                <div class='row'>" +
  "                  <div class='col-md-3 col-xs-12 thumbnail album-art'>" +
  "                     <img src='" + "http://placehold.it/400x400'" +  " alt='album image'>" +
  "                  </div>" +
  "                  <div class='col-md-9 col-xs-12'>" +
  "                    <ul class='list-group'>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Album Name:</h4>" +
  "                        <span class='album-name'>" + album.album_name + "</span>" +
  "                       </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Album Id:</h4>" +
  "                       <span class='album-name'>" + album._id + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Artist Name:</h4>" +
  "                        <span class='artist-name'>" + album.artist_name + "</span>" +
  "                      </li>" +
  // "                      <li class='list-group-item'>" +
  // "                        <h4 class='inline-header'>Released Year:</h4>" +
  // "                        <span class='album-releaseDate'>" + album.release_year + "</span>" +
  // "                      </li>" +
    buildTracksHtml(album.tracks) +

  "                    </ul>" +
  "                  </div>" +
  "                </div>" +
  "                <!-- end of album internal row -->" +

  "              </div>" + // end of panel-body

  "              <div class='panel-footer'>" +
  "                <button class='btn btn-primary add-track'>Add Track</button>" +
  "                <button class='btn btn-info update-album'>Edit Album</button>" +
  "                <button class='btn btn-danger delete-album'>Delete Album</button>" +
  "              </div>" +

  "            </div>" +
  "          </div>" +
  "          <!-- end one album -->";

  // render to the page with jQuery
  $('#albums').prepend(albumHtml);
}

