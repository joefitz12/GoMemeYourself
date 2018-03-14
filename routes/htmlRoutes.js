//HTTP Routes//
var path = require("path");

module.exports = function(app){
    app.get("/", function(req, res){
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });

    app.get("/join", function(req, res){
        res.sendFile(path.join(__dirname, "../public/phone-join.html"));
    });
    
    app.get("/phone-camera/*/*/", function(req, res){
        res.sendFile(path.join(__dirname, "../public/phone-camera.html"));
    });

    app.get("/phone-caption/*/*/", function(req, res){
        res.sendFile(path.join(__dirname, "../public/phone-caption.html"));
    });

    app.get("/phone-vote/*/*/", function(req, res){
        res.sendFile(path.join(__dirname, "../public/phone-vote.html"));
    });
};