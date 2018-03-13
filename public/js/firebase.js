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
    console.log(response);
    response.forEach(function (element) {
      let photoEl = $("<img>").attr("src", element.location);
      let captionEl = $("<p>").text(element.caption);
      $("#photo-display").append(photoEl);
      $("#photo-display").append(captionEl);
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
      let photoEl = $("<img>").attr("src", "../../../../" + element.location);
      let captionEl = $("<p>").text(element.caption);
      memeDiv.addClass("meme-submission");
      memeDiv.attr("data-photoID", element.id);
      memeDiv.append(photoEl);
      memeDiv.append(captionEl);
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
      captionCount: 0
    })
      .then(addCaptionListener);
  }

  function startRound(data) {
    let firebaseData = assignPhotos(data);
    // update firebase with assignPhotos(data) 
    database.ref('games/' + gameState.id).update({
      photos: firebaseData,
      startRound: true,
      captionCount: 0
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
            $(".photo-placeholder").css("background-image", "url('../../../../" + snapshot.val()[playerID].location + "')");
            $(".photo-placeholder").css("background-size", "cover");
            $(".photo-placeholder").attr("data-photoID", snapshot.val()[playerID].id);
          });
      }
    });
  }

  function incrementCaptionCount() {
    let gameID = parseInt(window.location.pathname.substring((window.location.pathname.indexOf("gameID=") + "gameID=".length), (window.location.pathname.indexOf("/", (window.location.pathname.indexOf("gameID=") + "gameID=".length)))));
    let captionerID = parseInt(window.location.pathname.substring((window.location.pathname.indexOf("playerID=") + "playerID=".length), (window.location.pathname.indexOf("/", (window.location.pathname.indexOf("playerID=") + "playerID=".length)))));
    let roundNumber = parseInt(window.location.pathname.substring((window.location.pathname.indexOf("roundNumber=") + "roundNumber=".length), (window.location.pathname.indexOf("/", (window.location.pathname.indexOf("roundNumber=") + "roundNumber=".length)))));
    database.ref('games/' + gameID + '/captionCount').once("value").then(function (snapshot) {
      console.log("snapshot value", snapshot.val());
      let newCaptionCount = snapshot.val() + 1;
      console.log("newCaptionCount", newCaptionCount);
      database.ref('games/' + gameID).update({
        captionCount: newCaptionCount
      });
      location.replace("/phone-vote/gameID=" + gameID + "/playerID=" + captionerID + "/roundNumber=" + roundNumber + "/");
    });
  }

  return {
    startRound,
    addStartRoundListener,
    createNewGame,
    incrementCaptionCount,
    phoneAddCaptionListener
  };
})();
