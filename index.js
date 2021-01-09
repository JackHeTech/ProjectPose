var express = require("express");
var app = express();
var path = require("path");

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/sketch.js", function (req, res) {
  res.sendFile(path.join(__dirname + "/sketch.js"));
});

app.listen(3000);
