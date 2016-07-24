var DB_VERSION = 1;
var DB_NAME = "gih-reservations";

// Open a request to open a database, and return that request
var openDatabase = function() {
  // Make sure IndexedDB is supported before attempting to use it
  if (!window.indexedDB) {
    return false;
  }

  var request = window.indexedDB.open(DB_NAME, DB_VERSION);

  request.onerror = function(event) {
    console.log("Database error: ", event.target.errorCode);
  };

  request.onupgradeneeded = function(event) {
    var db = event.target.result;
    if (!db.objectStoreNames.contains("reservations")) {
      db.createObjectStore("reservations",
        { keyPath: "id" }
      );
    }
  };

  return request;
};

var openObjectStore = function(storeName, successCallback, transactionMode) {
  var db = openDatabase();
  if (!db) {
    return false;
  }
  db.onsuccess = function(event) {
    var db = event.target.result;
    var objectStore = db
      .transaction(storeName, transactionMode)
      .objectStore(storeName);
    successCallback(objectStore);
  };
  return true;
};

var addToObjectStore = function(storeName, object) {
  openObjectStore(storeName, function(store) {
    store.add(object);
  }, "readwrite");
};

var getReservations = function(successCallback) {
  var reservations = [];
  var objectStore = openObjectStore("reservations", function(objectStore) {
    objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        reservations.push(cursor.value);
        cursor.continue();
      } else {
        if (reservations.length > 0) {
          successCallback(reservations);
        } else {
          $.getJSON('/reservations.json', function(reservations) {
            openObjectStore("reservations", function(reservationsStore) {
              for (var i = 0; i < reservations.length; i++) {
                reservationsStore.add(reservations[i]);
              }
              getReservations(successCallback);
            }, "readwrite");
          });

        }
      }
    };
  });
  if (!objectStore) {
    $.getJSON('/reservations.json', successCallback);
  }
};

$(document).ready(function() {

  // Fetch and render user reservations
  populateReservations();

  // Add booking widget functionality
  $('#booking-widget-container button').click(function() {
    var arrivalDate = $('#form--arrival-date').val();
    var nights = $('#form--nights').val();
    var guests = $('#form--guests').val();
    var id = Date.now().toString().substring(3,11);
    if (!arrivalDate || !nights || !guests) {
      return false;
    }
    addBooking(id, arrivalDate, nights, guests);
    return false;
  });

  // Periodically check for unconfirmed bookings
  setInterval(checkUnconfirmedBookings, 5000);
});

// Fetches reservations from server and renders them to the page
var populateReservations = function() {
  getReservations(function(reservations) {
    renderReservations(reservations);
  });
};

// Go over unconfirmed bookings, and verify their status against the server.
var checkUnconfirmedBookings = function() {
  $('.reservation-card--unconfirmed').each(function() {
    $.getJSON('/reservation-details.json', {id: $(this).data('id')}, function(data) {
      updateReservationDisplay(data);
    });
  });
};

// Adds a booking as pending to IndexedDB, the DOM, and the server.
var addBooking = function(id, arrivalDate, nights, guests) {
  var reservationDetails = {
    id:           id,
    arrivalDate:  arrivalDate,
    nights:       nights,
    guests:       guests,
    status:       'Awaiting confirmation'
  };
  addToObjectStore("reservations", reservationDetails);
  renderReservation(reservationDetails);
  $.getJSON('/make-reservation', reservationDetails, function(data) {
    updateReservationDisplay(data);
  });
};




/* ************************************************************ */
/* The code below this point is used to render to the DOM. It   */
/* completely ignores common sense principles like separation   */
/* of concerns as a trade off for readability.                  */
/* You can ignore it, or you can send angry tweets about it to  */
/* @TalAter                                                     */
/* ************************************************************ */

// Goes over an array of reservations, and renders each of them
var renderReservations = function(data) {
  $('div#reservation-loading').hide();
  data.forEach(function(reservation) {
    renderReservation(reservation);
  });
};

// Renders a reservation card and adds it to the DOM.
var renderReservation = function(reservation) {
  var newReservation = $(
    '<div class="reservation-card" id="reservation-'+reservation['id']+'" data-id="'+reservation['id']+'">'+
      '<img src="/img/reservation-gih.jpg" alt="Gotham Imperial Hotel" class="reserved-hotel-image">'+
      '<div class="reservation-details">'+
        '<div class="reserved-hotel-details">'+
          '<strong>Gotham Imperial Hotel</strong>'+
          '<p>1 Imperial Plaza, Gotham.</p>'+
          '<p class="arrivalDate">Check-in: <span>'+reservation['arrivalDate']+'</span>.</p>'+
          '<p>'+reservation['nights']+' nights. '+reservation['guests']+' guests.</p>'+
        '</div>'+
        '<div class="reservation-price">'+
          '<p>Total price</p>'+
          '<p><strong>'+(reservation['price'] ? '§'+reservation['price']+'.99' : '?')+'</strong></p>'+
        '</div>'+
      '</div>'+
      '<div class="reservation-actions">'+
        '<a href="#">Modify booking details</a>'+
        '<div class="reservation-status">'+reservation['status']+'</div>'+
      '</div>'+
      '<div class="reservation-meta-data">'+
        '<strong>Order number:</strong> <span>'+reservation['id']+'</span>'+
        '<strong>Booked on:</strong> <span class="reservation-bookedOn">'+(reservation['bookedOn'] ? reservation['bookedOn'] : 'n/a')+'</span>'+
      '</div>'+
    '</div>'
  );
  $('#reservations-container').append(newReservation);
  if (reservation['status'] !== 'Confirmed') {
    newReservation.addClass('reservation-card--unconfirmed');
  }

  // Adds an event listener to the modify reservation button.
  $('#reservation-'+reservation['id']+' a').click(function() {
    var possibleResponses = ['Orders are non-negotiable!', 'Not open to discussion!'];
    $(this).text(possibleResponses[Math.floor(Math.random()*possibleResponses.length)]);
    $(this).addClass('reservation-action--error');
    return false;
  });

};

var updateReservationDisplay = function(reservation) {
  var reservationNode = $('#reservation-'+reservation.id);
  $('.reservation-bookedOn', reservationNode).text(reservation.bookedOn);
  $('.reservation-price strong', reservationNode).text('§'+reservation.price+'.99');
  $('.reservation-status', reservationNode).text(reservation.status);
  $('.arrivalDate span', reservationNode).text(reservation.arrivalDate);
  if (reservation['status'] !== 'Confirmed') {
    reservationNode.addClass('reservation-card--unconfirmed');
  } else {
    reservationNode.removeClass('reservation-card--unconfirmed');
  }

};
