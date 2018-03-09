let gameState = {
  id: 0,
  round: 0,
  players: []
};

function createNewGame(){
  let gameData = {round: 0}
  $.post("/games/new", gameData)
    .then(function(data){
      renderNewGame(data);
      gameState = setGameState(data);
    });
}

function setGameState(data) {
  return {
    id: data.id,
    round: incrementRound(data.round)
  }
}

function updateGameState(oldState, newProp) {
  return {
    ...oldState,
    players: newProp
  }
}

function incrementRound(currentRound) {
  return ++currentRound;
}

function renderNewGame(data) {
  $("#start-game").hide();
  $("#game-info__display").show();
  $("#game-id__display").text("Game ID: " + data.id);
}

function getPhotos() {
  $.get("/photos/" + gameState.id + "/" + gameState.round)
    .then(firebaseBot.startRound);
}
