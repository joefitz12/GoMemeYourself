$("#start-game").on("click", createNewGame);

function createNewGame(){
  console.log("start button clicked");
  let gameData = {round: 0}
  $.post("/games/new", gameData)
    .then(function(data) {
      console.log(data);
    });
}