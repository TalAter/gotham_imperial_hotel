var db = require("./db.js");
var subscriptions = require("./subscriptions.js");
var moment = require("moment");
var _ = require("lodash");

/**
 * Formats a given reservation object for display
 *
 * @param {Object} reservation
 * @returns {Object}
 */
var formatResponseObject = function(reservation) {
  if (reservation) {
    reservation = _.clone(reservation);
    reservation.bookedOn = moment(reservation.bookedOn).format("MMMM Do YYYY");
  }
  return reservation;
};

/**
 * Get all reservations from the database
 *
 * @returns {Array}
 */
var get = function() {
  var reservations = db.get("reservations").value();
  return reservations.map(formatResponseObject);
};

/**
 * Returns a single reservation with the given id
 *
 * @param {Integer} id The unique id of a single reservation
 * @returns {Object|undefined}
 */
var getById = function(id) {
  var reservation = db.get("reservations")
    .filter({id: id})
    .value();
  return reservation[0] || undefined;
};

/**
 * Adds a new reservation to the database
 *
 * @param {Integer} id
 * @param {String} arrivalDate
 * @param {Integer} nights
 * @param {Integer} guests
 * @returns {Object}
 */
var make = function(id, arrivalDate, nights, guests) {
  if (guests > 5 || !arrivalDate || !nights || !guests) {
    return false;
  }
  var reservation = {
    "id":           id.toString(),
    "arrivalDate":  moment(new Date(arrivalDate)).format("MMMM Do YYYY"),
    "nights":       nights,
    "guests":       guests,
    "status":       "Awaiting confirmation",
    "bookedOn":     moment().format(),
    "price":        nights * _.random(200, 249)
  };

  db.get("reservations")
    .push(reservation)
    .value();

  return formatResponseObject(reservation);
};

/**
 * Marks a single reservation as Confirmed, and sends a notification to all subscriptions
 *
 * @param {Integer} id The unique id of a single reservation
 */
var confirm = function(id) {
  var reservation = getById(id);
  reservation.status = "Confirmed";

  subscriptions.notify({
    type: "reservation-confirmation",
    reservation: reservation
  });
};

module.exports = {
  get: get,
  getById: getById,
  make: make,
  formatResponseObject: formatResponseObject,
  confirm: confirm
};
