var moment = require("moment");
var _ = require("lodash");

var reservations = [];
var date = moment();

for (var i = 0; i < 2; i++) {
  date.add(_.random(5, 30), "days");
  var reservation = {
    "id":           _.random(80000000,81000000).toString(),
    "arrivalDate":  date.format("MMMM Do YYYY"),
    "nights":       _.random(1,4),
    "guests":       _.random(1,3),
    "status":       "Confirmed",
    "bookedOn":     moment().subtract(_.random(1,6), "days").format()
  };
  reservation.price = reservation.nights * _.random(200, 249);

  reservations.push(reservation);
}

module.exports = reservations;
