var moment = require('moment');
var _ = require('lodash');

var reservations = [];
var date = moment();

for (let i = 0; i < 2; i++) {
  date.add(_.random(5,30), 'days');
  let reservation = {
    "check_in":   date.format('MMMM Do YYYY'),
    "nights":     _.random(1,4),
    "guests":     _.random(1,3),
    "status":     "confirmed",
    "id":         _.random(8020000,8060000),
    "booked_on":  moment().subtract(_.random(1,6), 'days').format('MMMM Do YYYY')
  };
  reservation.price = reservation.nights*_.random(200,249);

  reservations.push(reservation);
}

module.exports = reservations;
