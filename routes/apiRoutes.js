//API Routes//
var db = require("../models");

var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

module.exports = function (app) {
  app.post('/api/photos/new', function (req, res) {

    console.log("api route hit!");

    // create an incoming form object
    var form = new formidable.IncomingForm();

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '../public/photos');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function (field, file) {
      fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    // log any errors that occur
    form.on('error', function (err) {
      console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function () {
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
