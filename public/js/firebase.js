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
  // function to add listener on caption count
  function addCaptionListener() {
    database.ref("games/" + gameState.id + "/captionCount").on("value", function(snap) {
      if (snap.val() === gameState.players.length) {
        console.log(snap.val());
      }
    });
  }

  // function to create new game
  function createNewGame() {
    database.ref('games/' + gameState.id).set({
      photos: [],
      startRound: true,
      captionCount: 0        
    });
  }

  function startRound(data) {
    let firebaseData = assignPhotos(data);
    // update firebase with assignPhotos(data) 
    database.ref('games/' + gameState.id).set({
      photos: firebaseData,
      startRound: true,
      captionCount: 0        
    })
      .then(addCaptionListener);
  }

  return {
    startRound,
    createNewGame
  }
})();
