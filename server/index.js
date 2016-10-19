var express = require('express');
var reservations = require('./reservations.js');
var subscriptions = require('./subscriptions.js');
var events = require('./events.js');
var app = express();
var port = 8443;
var moment = require('moment');
var bodyParser = require('body-parser');

app.use(bodyParser.json());


// Define routes
app.use(express.static('public'));

app.get('/my-account', function(req, res) {
  res.sendFile('my-account.html', {root: 'public'});
});

app.get('/reservations.json', function(req, res) {
  res.json(reservations.get());
});

app.get('/reservation-details.json', function(req, res) {
  let reservation = reservations.getById(req.query['id']);
  if (reservation && reservation.bookedOn) {
    // reservations are automatically confirmed 3 seconds after booking time
    if (moment().diff(moment(reservation.bookedOn), 'seconds') >= 3) {
      reservation.status = 'Confirmed';
    }
  }
  res.json(reservations.formatResponseObject(reservation));
});

app.get('/events.json', function(req, res) {
  res.json(events.get());
});

app.get('/make-reservation', function(req, res) {
  let id          = req.query['id'] || Date.now().toString().substring(3,11);
  let arrivalDate = req.query['arrivalDate'] || req.query['form--arrival-date'];
  let nights      = req.query['nights'] || req.query['form--nights'];
  let guests      = req.query['guests'] || req.query['form--guests'];
  let reservationStatus = reservations.make(id, arrivalDate, nights, guests);
  console.log('Making a reservation!!!');
  res.json(reservationStatus);
});

app.post('/add-subscription', function(req, res) {
  subscriptions.add(req.body);
  subscriptions.notify({
    title: 'Title!',
    body: 'This is the body',
    icon: '/img/reservation-gih.jpg',
    id: 1
  });
  res.json();
});


// Start the server
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
