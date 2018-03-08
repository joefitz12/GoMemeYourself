$("#photo-submit").on("click", function (event) {
  event.preventDefault();
  $("#photo-to-upload").click();
});

$("#photo-to-upload").on('change', function () {

  var files = $(this).get(0).files;
  let gameID = 1;
  let playerID = 2;
  let roundNumber = 3;

  if (files.length > 0) {
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file2 = files[i];

      // add the files to formData object for the data payload
      formData.append('uploads[]', file2, file2.name);
      formData.append('gameID', gameID);
      formData.append('playerID', playerID);
      formData.append('roundNumber', roundNumber);
    }

    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    $.ajax({
      url: '/api/photos/new',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function (data) {
        console.log('upload successful!\n' + data);
      },
      xhr: function () {
        // create an XMLHttpRequest
        var xhr = new XMLHttpRequest();

        // listen to the 'progress' event
        xhr.upload.addEventListener('progress', function (evt) {

          if (evt.lengthComputable) {
            // calculate the percentage of upload completed
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);

            // update the Bootstrap progress bar with the new percentage
            $('.progress-bar').text(percentComplete + '%');
            $('.progress-bar').width(percentComplete + '%');

            // once the upload reaches 100%, set the progress bar text to done
            if (percentComplete === 100) {
              $('.progress-bar').html('Done');
            }

          }

        }, false);

        return xhr;
      }
    });

  }
});