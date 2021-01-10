var express = require("express");
var app = express();
var path = require("path");

app.use(express.static("models"));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/exercise.js", function (req, res) {
  res.sendFile(path.join(__dirname + "/exercise.js"));
});

app.listen(3000);
