var db = require('./db.js');

var get = function() {
  return db.get('events').value();
};

module.exports = {
  get: get
};
