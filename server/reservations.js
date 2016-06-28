var db = require('./db.js');

var get = function() {
  return db.get('reservations').value();
};

var make = function(arrivalDate, nights, guests) {
  if (guests > 5 || !arrivalDate || !nights || !guests) {
    return false;
  }
  db.get('reservations')
    .push({
      arrivalDate: arrivalDate,
      nights: nights,
      guests: guests
    })
    .value();
  return true;
};

module.exports = {
  get: get,
  make: make
};
