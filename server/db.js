const low = require("lowdb");
const db = low("server/db.json");

// Populate database with data from fixtures
db
  .defaults({
    reservations: require("./fixtures/reservations.js"),
    events: require("./fixtures/events.js"),
    subscriptions: []
  })
  .value();

module.exports = db;
