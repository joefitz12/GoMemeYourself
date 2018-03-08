//API Routes//
var db = require("../models");

var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });


var S3FS = require("s3fs");
var bucketPath = "game-photos";
var s30options = {
    region: 'us-east-1'
};
var fsImpl = new S3FS(bucketPath, s30options);

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

    app.post("/api/newphoto", upload.single('fileupload'), function (req, res, next) {
        // req.file is the `fileupload` file 
        // req.body will hold the text fields, if there were any   
        var fileName = "test-file";
        fsImpl.writeFile(fileName, req.file.buffer, "binary", function (err) {
            if (err) throw (err);
            db.Art.create({
                art_file: 'https://s3.amazonaws.com/chickenscratchdb/' + fileName,
                ContributionId: req.body.ContributionId,
                StoryId: req.body.StoryId
            }).then(function (results) {
                res.redirect("/story/" + req.body.StoryId);
            });
        });
    });

    app.post("/games/new", function (req, res) {
        db.Game.create(req.body).then(function (response) {
            res.json(response);
        });
    });
};
