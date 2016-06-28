var express = require('express');
var reservations = require('./reservations.js');
var events = require('./events.js');
var app = express();
var port = 8443;


// Define routes
app.use(express.static('public'));

app.get('/get-reservations', function(req, res) {
  res.json(reservations.get());
});

app.get('/get-events', function(req, res) {
  res.json(events.get());
});

app.get('/make-reservation', function(req, res) {
  let arrivalDate = req.query['form--arrival-date'];
  let nights      = req.query['form--nights'];
  let guests      = req.query['form--guests'];
  let reservationStatus = reservations.make(arrivalDate, nights, guests);
  res.json({
    arrivalDate: arrivalDate,
    nights: nights,
    guests: guests,
    reservationStatus: reservationStatus
  });
});


// Start the server
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
