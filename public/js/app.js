//// DOC READY FUNCTIONS ////

$(document).ready(function() {

  // console.log('app.js loaded!');
  // when successful load albums function
  $.get('/api/albums').success(function(albums){
    // console.log(albums);
    albums.forEach(function(album) {  //renders each album in db
      renderAlbum(album);
    });
  });

  // Use jquery to capture the form values
  $('#album-form form').submit(function(event) {
    event.preventDefault();
    var formData = $(this).serialize();
    // console.log(formData);
    $.post('/api/albums', formData, function(album) {
      // console.log('album after POST', album);
      renderAlbum(album);  
    });
    $(this).trigger("reset");
  });

  $('#albums').on('click', '.add-track', function(event) {
    // console.log('testing on click add track');
    var id= $(this).parents('.album').data('album-id');
    // console.log('id',id);
    $('#trackModal').data('album-id', id);
    $('#trackModal').modal();
  });

  // On click events for delete, edit, and put/save
  $('#saveTrack').on('click', handleNewTrackSubmit); 
  $('#albums').on('click', '.delete-album', handleDeleteAlbumClick);
  $('#albums').on('click', '.edit-album', handleEditAlbumClick);
  $('#albums').on('click', '.put-album', handleSaveChangesClick);

}); // end document ready 

//// EDIT AND SAVE ALBUM ////

// accepts an album id (mongo id) and return the row in which that album exists
function getAlbumRowById(id) {
  return $('[data-album-id=' + id + ']'); 
}

function handleEditAlbumClick(event) {
  var albumId = $(this).parents('.album').data('album-id'); 
  var $albumRow = getAlbumRowById(albumId); 
  console.log(albumId); 
  // replace edit button with save button
  $(this).parent().find('.btn').hide();
  $(this).parent().find('.default-hidden').show();

  // replace current spans with inputs
  var albumName = $albumRow.find('span.album-name').text();
  $albumRow.find('span.album-name').html('<input class="edit-album-name" value="' + albumName + '"></input>');

  var artistName = $albumRow.find('span.artist-name').text();
  $albumRow.find('span.artist-name').html('<input class="edit-artist-name" value="' + artistName + '"></input>');

  var releaseYear = $albumRow.find('span.release-year').text();
  $albumRow.find('span.release-year').html('<input class="edit-release-year" value="' + releaseYear + '"></input>');
}

function handleSaveChangesClick(event){
  var albumId = $(this).parents('.album').data('album-id'); 
  var $albumRow = getAlbumRowById(albumId); 

  var data = {
    album_name: $albumRow.find('.edit-album-name').val(),
    artist_name: $albumRow.find('.edit-artist-name').val(),
    release_year: $albumRow.find('.edit-album-release-year').val()
  }; 

  $.ajax({
    method: 'PUT',
    url: '/api/albums/' + albumId,
    data: data,
    success: function(data) {
      console.log(data);
      $albumRow.replaceWith(generateAlbumHtml(data));
    }
  });
}


//// DELETE ALBUM ////

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


//// NEW TRACK SUBMIT ////
function handleNewTrackSubmit(event) {

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

//// RENDER ALBUM // 

function generateAlbumHtml(album) {

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
  "                      </li>" +

  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Artist Name:</h4>" +
  "                        <span class='artist-name'>" + album.artist_name + "</span>" +
  "                      </li>" +

   "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Release Year:</h4>" +
  "                        <span class='release-year'>" + album.release_year + "</span>" +
  "                      </li>" +

  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Album ID:</h4>" +
  "                       <span class='album-id'>" + album._id + "</span>" +
  "                      </li>" +


    buildTracksHtml(album.tracks) +
  "                    </ul>" +
  "                  </div>" +
  "                </div>" +
  "                <!-- end of album internal row -->" +
  "              </div>" + // end of panel-body
  "              <div class='panel-footer'>" +
  "                <button class='btn btn-primary add-track'>Add Track</button>" +
  "                <button class='btn btn-danger delete-album'>Delete Album</button>" +
  "                <button class='btn btn-info edit-album'>Edit Album</button>" +
  "                <button class='btn btn-success put-album default-hidden'>Save Changes</button>" +
  "              </div>" +
  "            </div>" +
  "          </div>" +
  "          <!-- end one album -->";

  return albumHtml;

}

// render album to page 
function renderAlbum(album) {
  var html = generateAlbumHtml(album);
  console.log('rendering album:', album);

  $('#albums').prepend(html);
}

