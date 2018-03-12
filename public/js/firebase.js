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

  function startRound(data) {
    let firebaseData = assignPhotos(data);

    // update firebase with assignPhotos(data) 
    database.ref('games/' + gameState.id).set({
      photos: firebaseData,
      startRound: true,
      captionCount: 0        
    })
      .then(function() {
        database.ref("games/" + gameState.id + "/captionCount").on("value", function(snap) {
          if (snap.val() === gameState.players.length) {
            console.log(snap.val());
          }
        });
      });
  }

  function addStartRoundListener(){
    let gameID = parseInt(window.location.pathname.substring((window.location.pathname.indexOf("gameID=") + "gameID=".length), (window.location.pathname.indexOf("/", (window.location.pathname.indexOf("gameID=") + "gameID=".length)))));
    let playerID = parseInt(window.location.pathname.substring((window.location.pathname.indexOf("playerID=") + "playerID=".length), (window.location.pathname.indexOf("/", (window.location.pathname.indexOf("playerID=") + "playerID=".length)))));
    database.ref("games/" + gameID + "/startRound").on("value", function(snap) {
      if (snap.val() === true) {
        database.ref("games/" + gameID + "/photos").once("value")
          .then(function(snapshot){
            console.log("snapshot", snapshot.val());
            $(".fa-camera-retro").hide();
            $(".photo-placeholder").css("background-image","url('../../../" + snapshot.val()[playerID].location + "')");
            $(".photo-placeholder").css("background-size", "cover");
            $(".photo-placeholder").attr("data-photoID",snapshot.val()[playerID].id);
          });
      }
    });
  }

  return {
    startRound,
    addStartRoundListener
  }
})();
