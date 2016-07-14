var express = require('express');
var reservations = require('./reservations.js');
var events = require('./events.js');
var app = express();
var port = 8443;


// Define routes
app.use(express.static('public'));

app.get('/my-account', function(req, res) {
  res.sendFile('my-account.html', {root: 'public'});
});

app.get('/reservations.json', function(req, res) {
  res.json(reservations.get());
});

app.get('/events.json', function(req, res) {
  res.json(events.get());
});

app.get('/make-reservation', function(req, res) {
  let id          = req.query['id'];
  let arrivalDate = req.query['arrivalDate'];
  let nights      = req.query['nights'];
  let guests      = req.query['guests'];
  let reservationStatus = reservations.make(id, arrivalDate, nights, guests);
  res.json(reservationStatus);
});


// Start the server
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
