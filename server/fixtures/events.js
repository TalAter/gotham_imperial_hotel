var moment = require("moment");
var _ = require("lodash");

const eventFixtures = [
  {
    "title": "New Year's Eve Party",
    "description": "The Gotham Imperial invites you to celebrate our annual New Year's Eve party.",
    "img": "/img/event-new-year.jpg",
    "date": "12/31"
  },
  {
    "title": "Rooftop Party",
    "description": "Come celebrate the re-opening of our rooftop bar, following last year's incident.",
    "img": "/img/event-rooftop.jpg"
  },
  {
    "title": "Horticultural Society Luncheon",
    "description": "Come celebrate another great year with Gotham's horticultural elite.",
    "img": "/img/event-horticultural.jpg"
  },
  {
    "title": "Spring Charity Ball",
    "description": "Gotham Imperial Hotel invites yout to help us fight TBA.",
    "img": "/img/event-gala.jpg"
  },
  {
    "title": "Halloween Party",
    "description": "The scariest night of the year in Gotham&hellip; and that's saying a lot!",
    "img": "/img/event-halloween.jpg",
    "date": "10/31"
  }
];

var events = [];

// Create the events array
for (var event of eventFixtures) {
  // Make up some dates for the events
  var date;
  if (event.date) {
    // If certain events have specific date requirements (e.g. new year's eve, Halloween)
    // use that date and add the year
    date = moment(moment().format("YYYY/") + "/" + event.date, "YYYY/MM/DD");
  } else {
    // Else randomize a date within the next 30 days
    date = moment().add(_.random(0, 30), "days");
  }

  event.date = date.format("MMMM Do YYYY");
  events.push(event);
}

module.exports = events;
