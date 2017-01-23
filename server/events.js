var db = require("./db.js");

/**
 * Get all events from the database
 *
 * @returns {Array}
 */
var get = function() {
  return db.get("events").value();
};

module.exports = {
  get: get
};
