let gameState = {
  id: 0,
  round: 0,
  players: []
};

/**
* createNewGame
* creates a new game in the database 
* @returns {undefined}
*/
function createNewGame(){
  let gameData = {round: 0}
  $.post("/games/new", gameData)
    .then(function(data){
      renderNewGame(data);
      gameState = setGameState(data);
      firebaseBot.createNewGame();
    });
}


/**
* setGameState
* creates a new gameState object 
* @param {object} data - the newGame object just created in the database
* @returns {object}
*/
function setGameState(data) {
  return {
    id: data.id,
    round: 0,
    players: []
  }
}


/**
* updateGameState
* creates a new object from params given
* @param {object} oldState - the current gameState
* @param {object} newProp - the property to update/add
* @returns {object}
*/
function updateGameState(oldState, newProp) {
  return {
    ...oldState,
    ...newProp
  }
}

/**
* createPlayersArray
* creates an array of playerIDs and assign it to the players property of a new object
* @param {array} data - the query result
* @returns {object}
*/
function createPlayersArray(data) {
  let newArray = [];
  data.forEach(dataObj => newArray.push(dataObj.PlayerId));
  return {players: newArray};
}

/**
* incrementRound
* increments the round number by one
* @param {number} currentRound - the current round number
* @returns {number} - the new round number
*/
function incrementRound(currentRound) {
  return ++currentRound;
}

/**
* renderNewGame
* renders game information to page
* @param {object} data - the game object from database
* @returns {undefined}
*/
function renderNewGame(data) {
  $("#right-header").empty();
  $("#game-control__display").show();
  let h2 = $("<h2>").text("SCOREBOARD");
  $("#score-display").append(h2);
  let idSpan = $("<div>");
  idSpan.attr("id", "game-id__display");
  idSpan.addClass("game-info");
  idSpan.text("Game ID: " + data.id);
  $("#right-header").append(idSpan);
}

/**
* getPhotos
* queries database for photos of current game and round
* @returns {undefined}
*/
function getPhotos() {
  gameState = updateGameState(gameState, {round: incrementRound(gameState.round)});
  $(".game-info").text("Game ID: " + gameState.id + " " + "Round: " + gameState.round)
  $("#game-control__display").hide();
  $.get("/photos/" + gameState.id + "/" + gameState.round)
    .then(firebaseBot.startRound);
}

/**
* calculateScores
* tabulates the score based on votes
* @param {array} data - the query results
* @returns {object}
*/
function calculateScores(data) {
  let scores = gameState.scores || {};
  data.forEach(function(element) {
    calculateCaptionScore(element, scores);
    calculatePicScore(element, scores)
  });
  return {scores: scores};
}

/**
* calculatePicScore
* logic for totaling score for picture takers
* @param {object} photoObj - the photo to be scored
* @param {object} scoreObj - the scores object to update
* @returns {undefined}
*/
function calculatePicScore(photoObj, scoreObj) {
  if (!photoObj.votes) return;
  if (scoreObj[photoObj.PlayerId]) {
    scoreObj[photoObj.PlayerId] += photoObj.votes * 100;
  } else {
    scoreObj[photoObj.PlayerId] = photoObj.votes * 100;
  }
}

/**
* calculateCaptionScore
* logic for totaling score for captioners
* @param {object} photoObj - the photo to be scored
* @param {object} scoreObj - the scores object to update
* @returns {undefined}
*/
function calculateCaptionScore(photoObj, scoreObj) {
  if (!photoObj.votes) return;
  if (scoreObj[photoObj.captionerId]) {
    scoreObj[photoObj.captionerId] += photoObj.votes * 150;
  } else {
    scoreObj[photoObj.captionerId] = photoObj.votes * 150;
  }
}