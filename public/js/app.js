$("#start-game").on("click", createNewGame);

function createNewGame(){
  console.log("start button clicked");
  let gameData = {round: 0}
  $.post("/games/new", gameData)
    .then(function(data) {
      console.log(data);
      // data is game object from db
      // jQuery render gameID and start round button to page
    });
}

function renderNewGame(data) {
  $("#start-game").hide();
  $("#game-id__display").show();
  
}