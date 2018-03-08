let gameState = {
  gameId: 0,
  round: 0,
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
    gameId: data.id,
    round: incrementRound(data.round)
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
  $.get("/photos/:game/:round")
    .then(startRound);
}
