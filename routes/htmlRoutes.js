//HTTP Routes//
module.exports = function(app){
    app.get("/", function(req, res){
        res.sendFile(path.join(__dirname, "index.html"));
    });

    app.get("/phone-join", function(req, res){
        res.sendFile(path.join(__dirname, "phone-join.html"));
    });
    
    app.get("/phone-camera", function(req, res){
        res.sendFile(path.join(__dirname, "phone-camera.html"));
    });
};
