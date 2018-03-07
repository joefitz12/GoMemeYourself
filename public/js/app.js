function createNewGame(){
  let gameData = {round: 0}
  $.post("/games/new", gameData)
    .then(renderNewGame);
}

function renderNewGame(data) {
  $("#start-game").hide();
  $("#game-info__display").show();
  $("#game-id__display").text("Game ID: " + data.id);
}

$(document).ready(function() {
  $("#game-info__display").hide();
  $("#start-game").on("click",createNewGame);
})