$("#game-control__display").hide();

$(document).ready(function() {
  $("#start-game").on("click", createNewGame);
  $(document).on("click", "#start-round", getPhotos);
});