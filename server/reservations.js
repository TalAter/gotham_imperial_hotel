var db = require('./db.js');
var subscriptions = require('./subscriptions.js');
var moment = require('moment');
var _ = require('lodash');

var formatResponseObject = function(reservation) {
  if (reservation) {
    reservation = _.clone(reservation);
    reservation.bookedOn = moment(reservation.bookedOn).format('MMMM Do YYYY');
  }
  return reservation;
};

var get = function() {
  let reservations = db.get('reservations').value();
  return reservations.map(formatResponseObject);
};

var getById = function(id) {
  var reservation = db.get('reservations')
  .filter({id: id})
  .value();
  return reservation[0] || undefined;
};

var make = function(id, arrivalDate, nights, guests) {
  if (guests > 5 || !arrivalDate || !nights || !guests) {
    return false;
  }
  let reservation = {
    "id":           id.toString(),
    "arrivalDate":  moment(arrivalDate).format('MMMM Do YYYY'),
    "nights":       nights,
    "guests":       guests,
    "status":       'Awaiting confirmation',
    "bookedOn":     moment().format(),
    "price":        nights*_.random(200,249)
  };

  db.get('reservations')
    .push(reservation)
    .value();

  return formatResponseObject(reservation);
};

var confirm = function(id) {
  var reservation = getById(id);
  reservation.status = 'Confirmed';

  subscriptions.notify({
    title: 'Reservation Confirmed',
    body: 'Your Gotham Imperial Hotel reservation for '+reservation.arrivalDate+
      ', has been confirmed',
    icon: '/img/reservation-gih.jpg',
    id: id
  });
};

module.exports = {
  get: get,
  getById: getById,
  make: make,
  formatResponseObject: formatResponseObject,
  confirm: confirm
};
