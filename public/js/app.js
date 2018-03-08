$(document).ready(function() {
  $("#game-info__display").hide();
  $("#start-game").on("click", createNewGame);
  $("#start-round").on("click", getPhotos);
});