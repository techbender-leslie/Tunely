
// render the albums index on the page
$(document).ready(function() {
  console.log('app.js loaded!');
  // when successful load albums function
  $.get('api/albums').success(function(albums){
    // for each render album
    console.log(albums);
    albums.forEach(function(album){
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
  // form needs to be inside ready function to work
}); 

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
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Artist Name:</h4>" +
  "                        <span class='artist-name'>" + album.artist_name + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Released Year:</h4>" +
  "                        <span class='album-releaseDate'>" + album.release_year + "</span>" +
  "                      </li>" +
  "                    </ul>" +
  "                  </div>" +
  "                </div>" +
  "                <!-- end of album internal row -->" +

  "              </div>" + // end of panel-body

  "              <div class='panel-footer'>" +
  "              </div>" +

  "            </div>" +
  "          </div>" +
  "          <!-- end one album -->";

  // render to the page with jQuery
  $('#albums').prepend(albumHtml);
}

