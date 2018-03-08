var db = require("../models");

module.exports = function (app) {
  // app.get("/reservations", function (req, res) {
  //   res.json(reservations);
  // });

  // app.get("/waitinglist", function (req, res) {
  //   res.json(waitinglist);
  // });

  // app.post("/reservations/new", function(req, res){
  //     var newReservation = req.body;
  //     console.log(newReservation);
  //     if (reservations.length > 4){
  //         waitingList.push(newReservation);
  //     }
  //     else {
  //         reservations.push(newReservation);
  //     }
      
  //     res.json(newReservation);
  // });

  //     app.post("/api/newphoto", function(req, res){
  //         var newReservation = req.body;
  //         console.log(newReservation);
  //         if (reservations.length > 4){
  //             waitingList.push(newReservation);
  //         }
  //         else {
  //             reservations.push(newReservation);
  //         }
          
  //         res.json(newReservation);
  //     );
  // };
  app.post("/games/new", function (req, res) {
    db.Game.create(req.body).then(function(response) {
      res.json(response);
    });
  });

  app.get("/photos/:game/:round", function(req, res) {
    db.Game.update(
      {round: req.params.round},
      {where: {id: req.params.game}}
    )
      .then(function() {
        db.Photo.findAll({
          attributes: ["PlayerId", "location"],
          where: {
            GameId: req.params.game,
            round: req.params.round
          }
        })
        .then(function(data) {
          console.log("data");
          res.json(data);
        });
      });
  })
}
