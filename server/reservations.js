var db = require('./db.js');

var get = function() {
  return db.get('reservations').value();
};

module.exports = {
  get: get
};
