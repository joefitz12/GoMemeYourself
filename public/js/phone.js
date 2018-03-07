$("#photo-submit").on("click", submitPhoto);

var submitPhoto = function(){
    var photo = $("#photo-to-upload").val();
    $.post("/api/newphoto/", photo)
    .then(function(response) {
      console.log(response);
    });
};