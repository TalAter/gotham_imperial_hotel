var express = require('express');
var reservations = require('./reservations.js');
var events = require('./events.js');
var app = express();
var port = 8443;


// Define routes
app.use(express.static('public'));

app.get('/get-reservations', function(req, res) {
  res.send(reservations.get());
});

app.get('/get-events', function(req, res) {
  res.send(events.get());
});


// Start the server
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
