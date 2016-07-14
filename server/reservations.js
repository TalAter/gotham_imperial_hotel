var db = require('./db.js');
var moment = require('moment');
var _ = require('lodash');

var formatResponseObject = function(reservation) {
  reservation = _.clone(reservation);
  reservation.bookedOn = moment(reservation.bookedOn).format('MMMM Do YYYY');
  return reservation;
};

var get = function() {
  let reservations = db.get('reservations').value();
  return reservations.map(formatResponseObject);
};

var make = function(id, arrivalDate, nights, guests) {
  if (guests > 5 || !arrivalDate || !nights || !guests) {
    return false;
  }
  let reservation = {
    "id":           id,
    "arrivalDate":  moment(arrivalDate).format('MMMM Do YYYY'),
    "nights":       nights,
    "guests":       guests,
    "status":       'Confirmed',
    "bookedOn":     moment().format(),
    "price":        nights*_.random(200,249)
  };

  db.get('reservations')
    .push(reservation)
    .value();

  return formatResponseObject(reservation);
};

module.exports = {
  get: get,
  make: make
};
