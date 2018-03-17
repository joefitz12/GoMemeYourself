$("#game-control__display").hide();

$(document).ready(function() {
  $("#start-game").on("click", createNewGame);
  $("#start-round").on("click", getPhotos);
});