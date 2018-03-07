var db = require("../models");

module.exports = function (app) {
  // app.get("/reservations", function (req, res) {
  //   res.json(reservations);
  // });

  // app.get("/waitinglist", function (req, res) {
  //   res.json(waitinglist);
  // });

  app.post("/games/new", function (req, res) {
    db.Game.create(req.body).then(function(response) {
      res.json(response);
    });
  });
}