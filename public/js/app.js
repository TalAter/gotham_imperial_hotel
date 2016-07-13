if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceworker.js').then(function(registration) {
    console.log('Service Worker registered successfully with scope: ', registration.scope);
  }).catch(function(err) {
    console.log('Service Worker registration failed: ', err);
  });
}


$(document).ready(function() {
  // Fetch and render upcoming events in the hotel
  $.getJSON('/events.json', function(data) {
    data.forEach(function(event) {
      $(
        '<div class="col-lg-2 col-md-4 col-sm-6 event-container"><div class="event-card">'+
        '<div class="event-date">'+event.date+'</div>'+
        '<img src="'+event.img+'" alt="'+event.title+'" class="img-responsive" />'+
        '<h4>'+event.title+'</h4>'+
        '<p>'+event.description+'</p>'+
        '</div></div>'
      ).insertBefore('#events-container div.calendar-link-container');
    });
  });
});
