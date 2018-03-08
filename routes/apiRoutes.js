//API Routes//
var db = require("../models");

var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

module.exports = function (app) {
    // app.get("/reservations", function(req, res){
    //     res.json(reservations);
    // });

    // app.get("/waitinglist", function(req,res){
    //     res.json(waitinglist);
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

    // app.post("/api/photos/new", upload.single('photo-to-upload'), function (req, res) {
    //     console.log("req.body.file", req.body.file);
    //     // req.file is the `fileupload` file 
    //     // req.body will hold the text fields, if there were any   
    //     var fileName = "test-file";
    //     fsImpl.writeFile(fileName, req.body.file, "binary", function (err) {
    //         if (err) throw (err);
    //         db.Photo.create({
    //             location: 'https://s3.us-east-2.amazonaws.com/game-photos/' + fileName
    //         }).then(function (results) {
    //             res.end();
    //         });
    //     });
    // });

    app.post('/api/photos/new', function(req, res){

        console.log("api route hit!");

        // create an incoming form object
        var form = new formidable.IncomingForm();
      
        // store all uploads in the /uploads directory
        form.uploadDir = path.join(__dirname, '../public/photos');
      
        // every time a file has been uploaded successfully,
        // rename it to it's orignal name
        form.on('file', function(field, file) {
          fs.rename(file.path, path.join(form.uploadDir, file.name));
        });
      
        // log any errors that occur
        form.on('error', function(err) {
          console.log('An error has occured: \n' + err);
        });
      
        // once all the files have been uploaded, send a response to the client
        form.on('end', function() {
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
};
