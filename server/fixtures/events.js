var moment = require('moment');
var _ = require('lodash');

const eventFixtures = [
  {
    "title": "New Year's Eve Party",
    "description": "The Gotham Imperial invites you to celebrate our annual New Year's Eve party.",
    "img": "/img/event-new-year.jpg",
    "date": "12/31"
  },
  {
    "title": "Rooftop Party",
    "description": "Come celebrate the re-opening of our famous rooftop bar.",
    "img": "/img/event-new-year.jpg"
  },
  {
    "title": "Halloween Party",
    "description": "Come celebrate the scariest night of the year with us.",
    "img": "/img/event-new-year.jpg",
    "date": "10/31"
  }
];

var events = [];

// Create the events array
for (let event of eventFixtures) {
  // Make up some dates for the events
  let date;
  if (event.date) {
    // If certain events have specific date requirements (e.g. new year's eve, Halloween)
    // use that date and add the year
    date = moment(moment().format('YYYY/')+'/'+event.date, "YYYY/MM/DD");
  } else {
    // Else randomize a date within the next 30 days
    date = moment().add(_.random(0,30), 'days');
  }

  event.date = date.format('l');
  events.push(event);
}

module.exports = events;
