$("#camera-button").on("click", function (event) {
  event.preventDefault();
  $("#photo-to-upload").click();
});

$("#photo-to-upload").on("change", function () {
  if ($("#photo-to-upload").val() !== "") {
    $(".fa-camera-retro").hide();
    let imageFile = $("#photo-to-upload").get(0).files[0];
    let preview = $('<img>');
    preview.src = window.URL.createObjectURL(imageFile);
    $("#rotate-div").css("background-image", "url('" + preview.src + "')");
    $("#rotate-div").css("background-size", "cover");
  }
  else {
    $(".fa-camera-retro").show();
  }
});

$("#photo-submit").on('click touchstart', function () {
  if ($("#photo-to-upload").val() !== "") {
    var files = $("#photo-to-upload").get(0).files;
    let gameID = parseInt(window.location.pathname.substring((window.location.pathname.indexOf("gameID=") + "gameID=".length), (window.location.pathname.indexOf("/", (window.location.pathname.indexOf("gameID=") + "gameID=".length)))));
    let playerID = parseInt(window.location.pathname.substring((window.location.pathname.indexOf("playerID=") + "playerID=".length), (window.location.pathname.indexOf("/", (window.location.pathname.indexOf("playerID=") + "playerID=".length)))));
    let roundNumber = parseInt(window.location.pathname.substring((window.location.pathname.indexOf("roundNumber=") + "roundNumber=".length), (window.location.pathname.indexOf("/", (window.location.pathname.indexOf("roundNumber=") + "roundNumber=".length)))));

    if (files.length > 0) {
      // create a FormData object which will be sent as the data payload in the
      // AJAX request
      var formData = new FormData();

      // loop through all the selected files and add them to the formData object
      for (var i = 0; i < files.length; i++) {
        var file = files[i];

        // add the files to formData object for the data payload
        formData.append('uploads[]', file, file.name);
        formData.append('gameID', gameID);
        formData.append('playerID', playerID);
        formData.append('roundNumber', roundNumber);
      }

      $.ajax({
        url: '/api/photos/new',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false
        // xhr: function () {
        //   // create an XMLHttpRequest
        //   var xhr = new XMLHttpRequest();

        //   // listen to the 'progress' event
        //   xhr.upload.addEventListener('progress', function (evt) {

        //     if (evt.lengthComputable) {
        //       // calculate the percentage of upload completed
        //       var percentComplete = evt.loaded / evt.total;
        //       percentComplete = parseInt(percentComplete * 100);

        //       // update the Bootstrap progress bar with the new percentage
        //       $('.progress-bar').text(percentComplete + '%');
        //       $('.progress-bar').width(percentComplete + '%');

        //       // once the upload reaches 100%, set the progress bar text to done
        //       if (percentComplete === 100) {
        //         $('.progress-bar').html('Done');
        //       }

        //     }

        //   }, false);

        //   return xhr;
        // }
        // }).done(location.replace("/phone-caption/gameID=" + gameID + "/playerID=" + playerID + "/roundNumber=" + roundNumber + "/"));
      });
    }
  }
});

$(".fa-undo-alt").on("click", function () {
  function getRotationDegrees(obj) {
    var matrix = obj.css("-webkit-transform") || obj.css("transform");
    if (matrix !== 'none') {
      var values = matrix.split('(')[1].split(')')[0].split(',');
      var a = values[0];
      var b = values[1];
      var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    } else { var angle = 0; }
    return angle;
  }

  if ($(this).hasClass("rotate-right")) {
    $("#rotate-div").css("transform", "rotate(" + parseInt(getRotationDegrees($("#rotate-div")) + 90) + "deg)");
  }
  else {
    $("#rotate-div").css("transform", "rotate(" + parseInt(getRotationDegrees($("#rotate-div")) - 90) + "deg)");
  }
});

$("#room-id-submit").on("click", function (event) {
  event.preventDefault();

  let gameID = $("#room-id").val();
  $.ajax({
    url: '/players/new',
    type: 'POST',
    data: { GameId: parseInt(gameID) },
    success: function (data) {
      console.log('join successful!\n' + data);
      let playerID = data.playerID;
      console.log("round", data.round);
      let roundNumber = data.round ? data.round : 1;
      console.log("round", roundNumber);
      location.replace("/phone-camera/gameID=" + gameID + "/playerID=" + playerID + "/roundNumber=" + roundNumber + "/");
    }
  });
});

$("#caption-submit").on("click", function (event) {
  let id = parseInt($(".photo-placeholder").attr("data-photoID"));
  if (id) {
    event.preventDefault();

    let gameID = parseInt(window.location.pathname.substring((window.location.pathname.indexOf("gameID=") + "gameID=".length), (window.location.pathname.indexOf("/", (window.location.pathname.indexOf("gameID=") + "gameID=".length)))));
    let id = parseInt($(".photo-placeholder").attr("data-photoID"));
    let caption = $("#caption-value").val();
    let captionerID = parseInt(window.location.pathname.substring((window.location.pathname.indexOf("playerID=") + "playerID=".length), (window.location.pathname.indexOf("/", (window.location.pathname.indexOf("playerID=") + "playerID=".length)))));
    let roundNumber = parseInt(window.location.pathname.substring((window.location.pathname.indexOf("roundNumber=") + "roundNumber=".length), (window.location.pathname.indexOf("/", (window.location.pathname.indexOf("roundNumber=") + "roundNumber=".length)))));

    let captionData = {
      photoID: id,
      captionText: caption,
      captionerID: captionerID
    };

    console.log("captionData", captionData);

    $.ajax({
      url: '/captions/new',
      type: 'PUT',
      data: captionData,
      success: function (data) {
        console.log('caption successful!\n' + data);
      }
    })
      .then(firebaseBot.incrementCaptionCount);
  }
});

$(document).on("click", ".meme-submission", function () {
  if (!$(".selected")) {
    $(this).addClass("selected");
  }
  else {
    $(".selected").removeClass("selected");
    $(this).addClass("selected");
  }
});

$("#vote-submit").on("click", function () {
  if ($(".selected")) {

    let photoID = parseInt($(".selected").attr("data-photoID"));
    let gameID = parseInt(window.location.pathname.substring((window.location.pathname.indexOf("gameID=") + "gameID=".length), (window.location.pathname.indexOf("/", (window.location.pathname.indexOf("gameID=") + "gameID=".length)))));
    let playerID = parseInt(window.location.pathname.substring((window.location.pathname.indexOf("playerID=") + "playerID=".length), (window.location.pathname.indexOf("/", (window.location.pathname.indexOf("playerID=") + "playerID=".length)))));
    let roundNumber = parseInt(window.location.pathname.substring((window.location.pathname.indexOf("roundNumber=") + "roundNumber=".length), (window.location.pathname.indexOf("/", (window.location.pathname.indexOf("roundNumber=") + "roundNumber=".length)))));

    let voteData = {
      photoID: photoID,
      playerID: playerID
    };

    $.ajax({
      url: '/vote/add',
      type: 'PUT',
      data: voteData,
      success: function (data) {
        console.log('vote successful!\n' + data);
      }
    })
      .then(function () {
        firebaseBot.incrementVoteCount(gameID, playerID, roundNumber);
      });
  }
});