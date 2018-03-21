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

  /**
   * assignPhotos
   * creates an object with each playerID being assigned a different player's photo
   * @param {array} data - the array of query results from the database
   * @returns {object}
   */
  function assignPhotos(data) {
    gameState = updateGameState(gameState, createPlayersArray(data));
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

  /**
   * resetStartRound
   * resets startRound property in Firebase to false
   * @returns {undefined}
   */  
  function resetStartRound() {
    database.ref('games/' + gameState.id).update({
      startRound: false
    });
  }

  /**
   * createNewGame
   * creates a new game in the database at the gameID provided
   * @param {array} response - the response from the query
   * @returns {undefined}
   */
  function renderPhotoCaptions(response) {
    $("#photo-display").empty();
    response.forEach(function (element) {
      let memeDiv = $("<div>");
      let photoDiv = $("<div>")
      photoDiv.css("background-image", "url('../../../../" + element.location + "')");
      photoDiv.css("background-size", "cover");
      photoDiv.addClass("meme-photo");
      $.ajax({
        url: '/angle/get/' + element.id,
        type: 'GET',
        success: function (data) {
          photoDiv.css("transform", "rotate(" + parseInt(data.rotationAngle) + "deg)");
        }
      });
      let caption = $("<p>").text(element.caption);
      caption.addClass("meme-caption");
      memeDiv.addClass("meme-container col-md-3");
      memeDiv.append(photoDiv);
      memeDiv.append(caption);
      $("#photo-display").append(memeDiv);
    });
  }

  /**
   * addCaptionListener
   * add listener on captionCount in Firebase to render memes on change
   * @returns {undefined}
   */
  function addCaptionListener() {
    database.ref("games/" + gameState.id + "/captionCount").on("value", function (snap) {
      if (snap.val() !== 0 && snap.val() === gameState.players.length) {
        $.get("/photos/" + gameState.id + "/" + gameState.round)
          .then(renderPhotoCaptions)
          .then(resetStartRound);
      }
    });
  }

  /**
   * renderPhonePhotoCaptions
   * iterates through the response and renders each meme on the phone
   * @param {array} response - the result of the query
   * @returns {undefined}
   */
  function renderPhonePhotoCaptions(response) {
    response.forEach(function (element) {
      let memeDiv = $("<div>");
      let rotateDiv = $("<div>")
      rotateDiv.css("background-image", "url('../../../../" + element.location + "')");
      rotateDiv.css("background-size", "cover");
      rotateDiv.css("background-position", "center center");
      rotateDiv.css("transform", "rotate(" + parseInt(element.rotationAngle) + "deg)");
      rotateDiv.addClass("rotate-div");
      let caption = $("<p>").text(element.caption);
      caption.addClass("phone-caption");
      memeDiv.addClass("meme-submission photo-placeholder");
      memeDiv.attr("data-photoID", element.id);
      memeDiv.append(caption);
      memeDiv.append(rotateDiv);
      $("#vote-display").append(memeDiv);
    });
    $(".meme-submission").on("click", function () {
      if (!$(".selected")) {
        $(this).addClass("selected");
      }
      else if ($(this).hasClass("selected")) {
        $(".selected").removeClass("selected");
      }
      else {
        $(".selected").removeClass("selected");
        $(this).addClass("selected");
      }
    });
  }

  /**
   * phoneAddCaptionListener
   * adds listener for captionCount change on phone
   * @returns {undefined}
   */
  function phoneAddCaptionListener() {
    $(".add-vote").hide();
    let gameID = parseInt(window.location.pathname.substring((window.location.pathname.indexOf("gameID=") + "gameID=".length), (window.location.pathname.indexOf("/", (window.location.pathname.indexOf("gameID=") + "gameID=".length)))));
    let roundNumber = parseInt(window.location.pathname.substring((window.location.pathname.indexOf("roundNumber=") + "roundNumber=".length), (window.location.pathname.indexOf("/", (window.location.pathname.indexOf("roundNumber=") + "roundNumber=".length)))));
    database.ref("games/" + gameID + "/captionCount").on("value", function (snap) {
      let captionCount = snap.val();
      playerCount = 0;
      database.ref("games/" + gameID).once("value", function (snap2) {
        let photos = snap2.val().photos;
        for (key in photos) {
          playerCount++;
        }
        if (captionCount !== 0 && captionCount === playerCount) {
          $(".add-vote").show();
          $(".modal-row").hide();
          $.get("/photos/" + gameID + "/" + roundNumber)
            .then(renderPhonePhotoCaptions);
        }
      });
    });
  }

  /**
   * createNewGame
   * creates a new game in the Firebase
   * @returns {undefined}
   */
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

  /**
   * startRound
   * click callback to update Firebase with round information
   * @param {array} data - the ID of the new game being created
   * @returns {undefined}
   */
  function startRound(data) {
    let firebaseData = assignPhotos(data);
    database.ref('games/' + gameState.id).update({
      photos: firebaseData,
      startRound: true,
      captionCount: 0,
      votes: 0
    });
  }

  /**
   * phoneCaptionPageRender
   * get photo assignment information from Firebase and renders one photo for player to caption
   * @returns {undefined}
   */
  function phoneCaptionPageRender() {
    let gameID = parseInt(window.location.pathname.substring((window.location.pathname.indexOf("gameID=") + "gameID=".length), (window.location.pathname.indexOf("/", (window.location.pathname.indexOf("gameID=") + "gameID=".length)))));
    let playerID = parseInt(window.location.pathname.substring((window.location.pathname.indexOf("playerID=") + "playerID=".length), (window.location.pathname.indexOf("/", (window.location.pathname.indexOf("playerID=") + "playerID=".length)))));
    $(".modal-row").hide();
    database.ref("games/" + gameID + "/photos").once("value")
      .then(function (snapshot) {
        $("#rotate-div").css("background-image", "url('../../../../" + snapshot.val()[playerID].location + "')");
        $("#rotate-div").css("background-size", "cover");
        $("#rotate-div").css("background-position", "center center");
        $("#rotate-div").css("transform", "rotate(" + parseInt(snapshot.val()[playerID].rotationAngle) + "deg)");
        $("#rotate-div").attr("data-photoID", snapshot.val()[playerID].id);
      })
      .then(function () {
        playerData = {
          playerID: playerID
        };
        $.ajax({
          url: '/voted/update',
          type: 'PUT',
          data: playerData
        });
      });
  }

  /**
   * addStartRoundListener
   * adds listener on phones for startRound value change in Firebase
   * @returns {undefined}
   */
  function addStartRoundListener() {
    let gameID = parseInt(window.location.pathname.substring((window.location.pathname.indexOf("gameID=") + "gameID=".length), (window.location.pathname.indexOf("/", (window.location.pathname.indexOf("gameID=") + "gameID=".length)))));
    let playerID = parseInt(window.location.pathname.substring((window.location.pathname.indexOf("playerID=") + "playerID=".length), (window.location.pathname.indexOf("/", (window.location.pathname.indexOf("playerID=") + "playerID=".length)))));
    let roundNumber = parseInt(window.location.pathname.substring((window.location.pathname.indexOf("roundNumber=") + "roundNumber=".length), (window.location.pathname.indexOf("/", (window.location.pathname.indexOf("roundNumber=") + "roundNumber=".length)))));
    database.ref("games/" + gameID + "/startRound").on("value", function (snap) {
      if (snap.val() === true) {
        location.replace("/phone-caption/gameID=" + gameID + "/playerID=" + playerID + "/roundNumber=" + roundNumber + "/");
      }
    });
  }

  /**
   * addVotesListener
   * adds listener for change on the value of votes in Firebase
   * @returns {undefined}
   */
  function addVotesListener() {
    database.ref("games/" + gameState.id + "/votes").on("value", function (snap) {
      if (snap.val() !== 0 && snap.val() === gameState.players.length) {
        $.get("/photos/" + gameState.id + "/" + gameState.round)
          .then(function (data) {
            gameState = updateGameState(gameState, calculateScores(data));
            $.ajax({
              url: "/players/scores",
              type: "PUT",
              data: gameState.scores,
            });
            renderScores();
          });
      }
    });
  }

  /**
   * renderScores
   * renders calculated scores to the scoreboard
   * @returns {undefined}
   */
  function renderScores() {
    $("#score-display").empty();
    let button = $("<button>").text("Next Round");
    button.attr("id", "start-round");
    button.attr("type", "button");
    button.addClass("btn btn-secondary score-button");
    $("#score-display").prepend(button);
    let h2 = $("<h2>").text("SCOREBOARD");
    $("#score-display").append(h2);
    gameState.players.forEach(elem => {
      $.get("/players/" + elem)
        .then(function (data) {
          let scoreDiv;
          if (!gameState.scores[elem]) {
            scoreDiv = $("<div>").text(data.nickname + ": " + 0);
          } else {
            scoreDiv = $("<div>").text(data.nickname + ": " + gameState.scores[elem]);
          }
          $("#score-display").append(scoreDiv);
        });
    });
  };

  /**
   * incrementCaptionCount
   * updates captionCount property in Firebase
   * @returns {undefined}
   */
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

  /**
   * incrementVoteCount
   * updates votes property in Firebase
   * @returns {undefined}
   */
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
    phoneAddCaptionListener,
    phoneCaptionPageRender
  };
})();
