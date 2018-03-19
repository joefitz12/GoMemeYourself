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
      firebaseBot.createNewGame();
    });
}

function setGameState(data) {
  return {
    id: data.id,
    round: 0,
    players: []
  }
}

function updateGameState(oldState, newProp) {
  return {
    ...oldState,
    ...newProp
  }
}

function createPlayersArray(data) {
  let newArray = [];
  data.forEach(dataObj => newArray.push(dataObj.PlayerId));
  return {players: newArray};
}

function incrementRound(currentRound) {
  return ++currentRound;
}

function renderNewGame(data) {
  $("#right-header").empty();
  $("#game-control__display").show();
  let idSpan = $("<div>");
  // let roundSpan = $("<div>");
  idSpan.attr("id", "game-id__display");
  // roundSpan.attr("id", "game-round__display");
  idSpan.addClass("game-info");
  // roundSpan.addClass("game-info");
  idSpan.text("Game ID: " + data.id);
  // roundSpan.text();
  $("#right-header").append(idSpan);
  // $("#right-header").append(roundSpan);
}

function getPhotos() {
  gameState = updateGameState(gameState, {round: incrementRound(gameState.round)});
  $(".game-info").text("Game ID: " + gameState.id + " " + "Round: " + gameState.round)
  $("#game-control__display").hide();
  $.get("/photos/" + gameState.id + "/" + gameState.round)
    .then(firebaseBot.startRound);
}

function calculateScores(data) {
  let scores = gameState.scores || {};
  data.forEach(function(element) {
    calculateCaptionScore(element, scores);
    calculatePicScore(element, scores)
  });
  return {scores: scores};
}

function calculatePicScore(photoObj, scoreObj) {
  if (!photoObj.votes) return;
  if (scoreObj[photoObj.PlayerId]) {
    scoreObj[photoObj.PlayerId] += photoObj.votes * 100;
  } else {
    scoreObj[photoObj.PlayerId] = photoObj.votes * 100;
  }
}

function calculateCaptionScore(photoObj, scoreObj) {
  if (!photoObj.votes) return;
  if (scoreObj[photoObj.captionerId]) {
    scoreObj[photoObj.captionerId] += photoObj.votes * 150;
  } else {
    scoreObj[photoObj.captionerId] = photoObj.votes * 150;
  }
}