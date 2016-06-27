const eventFixtures = [
  {
    "title": "New Year's Eve Party",
    "description": "The Gotham Imperial invites you to celebrate our annual New Year's Eve party.",
    "img": "/img/event-new-year.jpg",
    "date": "2019-12-31"
  },
  {
    "title": "Rooftop Party",
    "description": "Come celebrate the re-opening of our famous rooftop bar.",
    "img": "/img/event-new-year.jpg",
    "date": "2019-11-15"
  },
  {
    "title": "Halloween Party",
    "description": "Come celebrate the scariest night of the year with us.",
    "img": "/img/event-new-year.jpg",
    "date": "2019-10-31"
  }
];

var events = [];

for (let event of eventFixtures) {
  events.push(event);
}

module.exports = events;
