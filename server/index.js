var express = require("express");
var reservations = require("./reservations.js");
var subscriptions = require("./subscriptions.js");
var events = require("./events.js");
var app = express();
var port = 8443;
var bodyParser = require("body-parser");

app.use(bodyParser.json());

// Define routes
app.use(express.static("public"));

app.get("/my-account", function(req, res) {
  res.sendFile("my-account.html", {root: "public"});
});

app.get("/reservations.json", function(req, res) {
  res.json(reservations.get());
});

app.get("/reservation-details.json", function(req, res) {
  var reservation = reservations.getById(req.query["id"]);
  res.json(reservations.formatResponseObject(reservation));
});

app.get("/events.json", function(req, res) {
  res.json(events.get());
});

app.get("/make-reservation", function(req, res) {
  var id =          req.query["id"] || Date.now().toString().substring(3, 11);
  var arrivalDate = req.query["arrivalDate"] || req.query["form--arrival-date"];
  var nights =      req.query["nights"] || req.query["form--nights"];
  var guests =      req.query["guests"] || req.query["form--guests"];
  var reservationStatus = reservations.make(id, arrivalDate, nights, guests);
  console.log("Making a reservation!!!");

  // reservations are automatically confirmed 5 seconds after booking time
  setTimeout(function() {
    reservations.confirm(id);
  }, 5000);

  res.json(reservationStatus);
});

app.post("/add-subscription", function(req, res) {
  subscriptions.add(req.body);
  res.json();
});

// Start the server
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
