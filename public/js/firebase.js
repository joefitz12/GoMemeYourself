const firebaseBot = (function () {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAOj3OME-VBQwfzp1VvOYu3XprFQvpvhHk",
    authDomain: "go-meme-yourself.firebaseapp.com",
    databaseURL: "https://go-meme-yourself.firebaseio.com",
    projectId: "go-meme-yourself",
    storageBucket: "go-meme-yourself.appspot.com",
    messagingSenderId: "732189360517"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  function assignPhotos(data) {
    console.log(data);
    gameState = updateGameState(gameState, createPlayersArray(data));
    console.log(gameState);
    let roundObj = {};
    for (let i = 0; i < gameState.players.length; i++) {
      let j = 0;
      if (i !== gameState.players.length - 1) {
        j = i + 1;
      }
      roundObj[gameState.players[i]] = data[j];
    }
    return roundObj;
  }

  // function to set start round to false on fb
  function resetStartRound() {
    database.ref('games/' + gameState.id).update({
      startRound: false
    });
  }

  function renderPhotoCaptions(response) {
    console.log("renderPhotoCaptions response", response);
    response.forEach(function (element) {
      let memeDiv = $("<div>");
      // let photoEl = $("<div>")
      memeDiv.css("background-image", "url('../../../../" + element.location + "')");
      memeDiv.css("background-size", "cover");
      // $.ajax({
      //   url: '/angle/get/' + element.id,
      //   type: 'GET',
      //   success: function (data) {
      //     console.log('rotation data!\n' + data.rotationAngle);
      //     rotateDiv.css("transform","rotate(" + parseInt(data.rotationAngle) + "deg)");
      //   }
      // });
      // rotateDiv.addClass("rotate-div");
      let caption = $("<p>").text(element.caption);
      caption.addClass("meme-caption");
      memeDiv.addClass("meme-container col-md-4");
      // memeDiv.attr("data-photoID", element.id);
      memeDiv.append(caption);
      // memeDiv.append(photoEl);
      // $("#vote-display").append(memeDiv);
      // let photoDiv = $("<div class='photo-display__card col-md-4'>");
      // photoDiv.css("background-image", "url('../../../../" + element.location + "')")
      // let photoEl = $("<img>").attr("src", element.location);
      // let captionEl = $("<p>").text(element.caption);
      // photoDiv.append(photoEl);
      // photoDiv.append(captionEl);
      $("#photo-display").append(memeDiv);
    });
  }

  // function to add listener on caption count
  function addCaptionListener() {
    database.ref("games/" + gameState.id + "/captionCount").on("value", function (snap) {
      console.log("captions: ", snap.val());
      console.log("players: ", gameState.players.length);
      if (snap.val() !== 0 && snap.val() === gameState.players.length) {
        $.get("/photos/" + gameState.id + "/" + gameState.round)
          .then(renderPhotoCaptions)
          .then(resetStartRound);
      }
    });
  }

  // function displays memes on phones
  function renderPhonePhotoCaptions(response) {
    console.log(response);
    response.forEach(function (element) {
      let memeDiv = $("<div>");
      let rotateDiv = $("<div>")
      rotateDiv.css("background-image", "url('../../../../" + element.location + "')");
      rotateDiv.css("background-size", "cover");
      $.ajax({
        url: '/angle/get/' + element.id,
        type: 'GET',
        success: function (data) {
          console.log('rotation data!\n' + data.rotationAngle);
          rotateDiv.css("transform","rotate(" + parseInt(data.rotationAngle) + "deg)");
        }
      });
      rotateDiv.addClass("rotate-div");
      let caption = $("<p>").text(element.caption);
      caption.addClass("phone-caption");
      memeDiv.addClass("meme-submission photo-placeholder");
      memeDiv.attr("data-photoID", element.id);
      memeDiv.append(caption);
      memeDiv.append(rotateDiv);
      $("#vote-display").append(memeDiv);
    });
  }

  // function add listener on caption count for phones
  function phoneAddCaptionListener() {
    let gameID = parseInt(window.location.pathname.substring((window.location.pathname.indexOf("gameID=") + "gameID=".length), (window.location.pathname.indexOf("/", (window.location.pathname.indexOf("gameID=") + "gameID=".length)))));
    let roundNumber = parseInt(window.location.pathname.substring((window.location.pathname.indexOf("roundNumber=") + "roundNumber=".length), (window.location.pathname.indexOf("/", (window.location.pathname.indexOf("roundNumber=") + "roundNumber=".length)))));
    console.log("roundNumber", roundNumber);
    database.ref("games/" + gameID + "/captionCount").on("value", function (snap) {
      let captionCount = snap.val();
      console.log("captions: ", snap.val());
      playerCount = 0;
      database.ref("games/" + gameID).once("value", function (snap2) {
        let photos = snap2.val().photos;
        for (key in photos) {
          playerCount++;
        }
        console.log("playerCount", playerCount);
        if (captionCount !== 0 && captionCount === playerCount) {
          $.get("/photos/" + gameID + "/" + roundNumber)
            .then(renderPhonePhotoCaptions);
        }
      });
    });
  }

  // function to create new game
  function createNewGame() {
    database.ref('games/' + gameState.id).set({
      photos: [],
      startRound: false,
      captionCount: 0,
      votes: 0
    })
      .then(function () {
        addCaptionListener();
        addVotesListener();
      });
  }

  function startRound(data) {
    let firebaseData = assignPhotos(data);
    // update firebase with assignPhotos(data) 
    database.ref('games/' + gameState.id).update({
      photos: firebaseData,
      startRound: true,
      captionCount: 0,
      votes: 0
    });
  }

  function addStartRoundListener() {
    let gameID = parseInt(window.location.pathname.substring((window.location.pathname.indexOf("gameID=") + "gameID=".length), (window.location.pathname.indexOf("/", (window.location.pathname.indexOf("gameID=") + "gameID=".length)))));
    let playerID = parseInt(window.location.pathname.substring((window.location.pathname.indexOf("playerID=") + "playerID=".length), (window.location.pathname.indexOf("/", (window.location.pathname.indexOf("playerID=") + "playerID=".length)))));
    database.ref("games/" + gameID + "/startRound").on("value", function (snap) {
      if (snap.val() === true) {
        database.ref("games/" + gameID + "/photos").once("value")
          .then(function (snapshot) {
            console.log("snapshot", snapshot.val());
            $(".fa-camera-retro").hide();
            $("#rotate-div").css("background-image", "url('../../../../" + snapshot.val()[playerID].location + "')");
            $("#rotate-div").css("background-size", "cover");
            let photoID = snapshot.val()[playerID].id;
            console.log("photoID", photoID);
            $.ajax({
              url: '/angle/get/' + photoID,
              type: 'GET',
              success: function (data) {
                console.log('rotation data!\n' + data.rotationAngle);
                $("#rotate-div").css("transform","rotate(" + parseInt(data.rotationAngle) + "deg)");
              }
            });
            $("#rotate-div").attr("data-photoID", snapshot.val()[playerID].id);
          })
          .then(function () {
            playerData = {
              playerID: playerID
            };
            $.ajax({
              url: '/voted/update',
              type: 'PUT',
              data: playerData,
              success: function (data) {
                console.log('updated voted field!\n' + data);
              }
            });
          });
      }
    });
  }

  function addVotesListener() {
    database.ref("games/" + gameState.id + "/votes").on("value", function (snap) {
      console.log("captions: ", snap.val());
      console.log("players: ", gameState.players.length);
      if (snap.val() !== 0 && snap.val() === gameState.players.length) {
        $.get("/photos/" + gameState.id + "/" + gameState.round)
          .then(function (data) {
            gameState = updateGameState(gameState, calculateScores(data));
            //update db
            $.ajax({
              url: "/players/scores",
              type: "PUT",
              data: gameState.scores,
            });
          });
      }
    });
  }

  function incrementCaptionCount() {
    let gameID = parseInt(window.location.pathname.substring((window.location.pathname.indexOf("gameID=") + "gameID=".length), (window.location.pathname.indexOf("/", (window.location.pathname.indexOf("gameID=") + "gameID=".length)))));
    let captionerID = parseInt(window.location.pathname.substring((window.location.pathname.indexOf("playerID=") + "playerID=".length), (window.location.pathname.indexOf("/", (window.location.pathname.indexOf("playerID=") + "playerID=".length)))));
    let roundNumber = parseInt(window.location.pathname.substring((window.location.pathname.indexOf("roundNumber=") + "roundNumber=".length), (window.location.pathname.indexOf("/", (window.location.pathname.indexOf("roundNumber=") + "roundNumber=".length)))));
    database.ref('games/' + gameID + '/captionCount').once("value").then(function (snapshot) {
      let newCaptionCount = snapshot.val() + 1;
      database.ref('games/' + gameID).update({
        captionCount: newCaptionCount
      })
        .then(location.replace("/phone-vote/gameID=" + gameID + "/playerID=" + captionerID + "/roundNumber=" + roundNumber + "/"));
    });
  }

  function incrementVoteCount(gameID, playerID, roundNumber) {
    database.ref('games/' + gameID + '/votes').once("value").then(function (snapshot) {
      let newVoteCount = snapshot.val() + 1;
      database.ref('games/' + gameID).update({
        votes: newVoteCount
      })
        .then(function () {
          roundNumber++;
          location.replace("/phone-camera/gameID=" + gameID + "/playerID=" + playerID + "/roundNumber=" + roundNumber + "/");
        });
    });
  }

  return {
    startRound,
    addStartRoundListener,
    createNewGame,
    incrementCaptionCount,
    incrementVoteCount,
    phoneAddCaptionListener
  };
})();
