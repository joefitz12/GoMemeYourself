//HTTP Routes//

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "index.html"));
});