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
        let dbLocation = "";
        let gameID = 0;
        let playerID = 0;
        let roundNumber = 0;
        let rotationAngle = 0;

        // store all uploads in the /uploads directory
        form.uploadDir = path.join(__dirname, '../public/photos');
        console.log("outside form.uploadDir", form.uploadDir);


        // every time a file has been uploaded successfully,
        // rename it to it's orignal name
        form.on('file', function (field, file) {
            fileName = file.name;
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
            else if (name === "rotationAngle") {
                rotationAngle = parseInt(value);
            }
        });

        form.on('end', function () {
            db.Photo.create({
                GameId: gameID,
                PlayerId: playerID,
                round: roundNumber,
                location: dbLocation,
                rotationAngle: rotationAngle
            }).then(() => console.log("end callback"));
            res.end('success');
        });


        // log any errors that occur
        form.on('error', function (err) {
            console.log('An error has occured: \n' + err);
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
        db.Game.findOne({
            where: {
                id: parseInt(req.body.GameId)
            }
        }).then(function (gameInfo) {
            db.Player.create(req.body).then(function (response) {
                let joinGameInfo = {
                    round: gameInfo.round,
                    playerID: response.id
                };
                res.json(joinGameInfo);
            });
        });
    });


    //PUT Routes

    //Add a caption to the captions table
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
                res.json(response);
            });
    });

    //Add a vote to the photos table
    app.put("/vote/add", function (req, res) {

        db.Player.findOne({
            where: {
                id: req.body.playerID
            }
        }).then(function (player) {
            if (!player.voted) {
                db.Player.update({
                    voted: true
                },
                    {
                        where: {
                            id: player.id
                        }
                    }).then(function (response) {
                        console.log(response);
                    });

                db.Photo.findOne({
                    where: {
                        id: req.body.photoID
                    }
                }).then(function (photo) {
                    let updatedVotes = photo.votes + 1;
                    db.Photo.update({
                        votes: updatedVotes
                    },
                        {
                            where: {
                                id: photo.id
                            }
                        }).then(function (response) {
                            res.json(response);
                        });
                });
            }
            else {
                res.send("You already voted");
            }
        });
    });

    //Add a score to the players table
    app.put("/players/scores", function (req, res) {
        for (let player in req.body) {
            db.Player.update(
                { score: parseInt(req.body[player]) },
                { where: { id: player } }
            )
        }
        res.end();
    });

    //Update the voted boolean on the players table
    app.put("/voted/update", function (req, res) {
        db.Player.update(
            { voted: false },
            { where: { id: req.body.playerID } }
        );
        res.end();
    });

    //GET Routes
    app.get("/photos/:game/:round", function (req, res) {
        db.Game.update(
            { round: req.params.round },
            { where: { id: req.params.game } }
        )
            .then(function () {
                db.Photo.findAll({
                    attributes: ["id", "PlayerId", "location", "caption", "votes", "captionerId", "rotationAngle"],
                    where: {
                        GameId: req.params.game,
                        round: req.params.round
                    }
                })
                    .then(function (data) {
                        res.json(data);
                    });
            });
    });

    app.get("/angle/get/:photoID", function (req, res) {
        db.Photo.findOne({
            attributes: ["rotationAngle"],
            where: {
                id: req.params.photoID
            }
        })
            .then(function (data) {
                res.json(data);
            });
    });

    app.get("/players/:playerID", function (req, res) {
        db.Player.findOne({
            attributes: ["nickname"],
            where: { id: req.params.playerID }
        })
            .then(function (data) {
                res.json(data);
            });
    });

    app.get("/photos/:gameID/:playerID/:roundNumber", function (req, res) {
        db.Photo.findOne({
            attributes: ["location"],
            where: { 
                GameId: req.params.gameID,
                PlayerId: req.params.playerID,
                round: req.params.roundNumber
            }
        })
            .then(function (data) {
                res.json(data);
            })
            .catch(function(err){
                res.json(err);
            });
    });
};