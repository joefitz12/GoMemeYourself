//API Routes//
var db = require("../models");

var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

module.exports = function (app) {

  //POST Routes
  app.post('/api/photos/new', function (req, res) {

    // create an incoming form object
    var form = new formidable.IncomingForm();
    let fileName = "";
    let dbLocation = "photos/" + fileName;
    let gameID = 0;
    let playerID = 0;
    let roundNumber = 0;

    // for (var pair of form.entries()) {
    //     console.log(pair[0] + ', ' + pair[1]);
    // }

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '../public/photos');


    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function (field, file) {
      console.log("field:", field);
      console.log("file.name:", file.name);
      fileName = file.name;
      console.log("fileName", fileName);
      dbLocation = "photos/" + fileName;
      fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    form.on('field', function (name, value) {
      if (name === "gameID") {
        gameID = parseInt(value);
      }
      else if (name === "playerID") {
        playerID = parseInt(value);
      }
      else if (name === "roundNumber") {
        roundNumber = parseInt(value);
      }



      console.log("roundNumber", roundNumber);
      console.log("dbLocation", dbLocation);

    });

    console.log("fileName", fileName);


    // log any errors that occur
    form.on('error', function (err) {
      console.log('An error has occured: \n' + err);
    });



    // once all the files have been uploaded, send a response to the client
    form.on('end', function () {
      console.log("end roundNumber", roundNumber);
      console.log("end dbLocatoion", dbLocation);
      db.Photo.create({
        GameId: gameID,
        PlayerId: playerID,
        round: roundNumber,
        location: dbLocation,
      }).then(() => console.log("end callback"));
      res.end('success');
    });

    // parse the incoming request containing the form data
    form.parse(req);
  });

  app.post("/games/new", function (req, res) {
      db.Game.create(req.body).then(function (response) {
          res.json(response);
      });
  });

    app.post("/players/new", function (req, res) {
      db.Player.create(req.body).then(function (response) {
        res.json(response);
      });
    });

  //PUT Routes
  app.put("/captions/new", function (req, res) {

    db.Photo.update({
      caption: req.body.captionText,
      captionerId: req.body.captionerID
    },
      {
        where: {
          id: req.body.photoID
        }
      }).then(function (response) {
        console.log(response);
        res.json(response);
      });
  });

  //GET Routes
  app.get("/photos/:game/:round", function (req, res) {
    db.Game.update(
      { round: req.params.round },
      { where: { id: req.params.game } }
    )
      .then(function () {
        db.Photo.findAll({
          attributes: ["PlayerId", "location"],
          where: {
            GameId: req.params.game,
            round: req.params.round
          }
        })
          .then(function (data) {
            console.log("data");
            res.json(data);
          });
      });
  });
};