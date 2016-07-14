var db = require('./db.js');
var moment = require('moment');
var _ = require('lodash');

var get = function() {
  return db.get('reservations').value();
};

var make = function(id, arrivalDate, nights, guests) {
  if (guests > 5 || !arrivalDate || !nights || !guests) {
    return false;
  }
  let reservationDetails = {
    "id":           id,
    "arrivalDate":  arrivalDate,
    "nights":       nights,
    "guests":       guests,
    "status":       'Confirmed',
    "bookedOn":      moment().format('MMMM Do YYYY'),
    "price":        nights*_.random(200,249)
  };

  db.get('reservations')
    .push(reservationDetails)
    .value();

  return reservationDetails;
};

module.exports = {
  get: get,
  make: make
};
