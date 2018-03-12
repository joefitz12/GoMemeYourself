const firebaseBot = (function() {
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
    response.forEach(function(element) {
      let photoEl = $("<img>").attr("src", element.location);
      let captionEl = $("<p>").text(element.caption);
      $("#photo-display").append(photoEl);
      $("#photo-display").append(captionEl);
    });
  }

  // function to add listener on caption count
  function addCaptionListener() {
    database.ref("games/" + gameState.id + "/captionCount").on("value", function(snap) {
      console.log("captions: ", snap.val())
      console.log("players: ", gameState.players.length)
      if (snap.val() !== 0 && snap.val() === gameState.players.length) {
        $.get("/photos/" + gameState.id + "/" + gameState.round)
          .then(renderPhotoCaptions)
          .then(resetStartRound);
      }
    });
  }

  // function to create new game
  function createNewGame() {
    database.ref('games/' + gameState.id).set({
      photos: [],
      startRound: true,
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

  return {
    startRound,
    createNewGame
  }
})();
