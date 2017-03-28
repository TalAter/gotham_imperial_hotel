var boot = function() {
  // Fetch and render user reservations
  populateReservations();

  // Add booking widget functionality
  var processRegistration = function(event) {
    event.preventDefault();
    var arrivalDate = document.getElementById("form--arrival-date").value;
    var nights = document.getElementById("form--nights").value;
    var guests = document.getElementById("form--guests").value;
    var id = Date.now().toString().substring(3, 11);
    if (!arrivalDate || !nights || !guests) {
      return false;
    }
    addReservation(id, arrivalDate, nights, guests);
    return false;
  };
  document.getElementById("reservation-form").addEventListener("submit", processRegistration, false);

  var processNotificationSubscribe = function(event) {
    event.preventDefault();
    hideNotificationOffer();
    subscribeUserToNotifications();
  };
  document.querySelector("#offer-notification a").addEventListener("click", processNotificationSubscribe, false);

  // Periodically check for unconfirmed bookings
  setInterval(checkUnconfirmedReservations, 5000);
};

document.addEventListener("DOMContentLoaded", boot, false);


// Fetches reservations from server and renders them to the page
var populateReservations = function() {
  getReservations().then(renderReservations);
};

// Go over unconfirmed reservations, and verify their status against the server.
var checkUnconfirmedReservations = function() {
  var unconfirmed = document.querySelectorAll(".reservation-card--unconfirmed");
  unconfirmed.forEach(function(reservation) {
    fetch("/reservation-details.json?id=" + reservation.getAttribute("data-id"))
      .then(function(response){
        return response.json();
      })
      .then(function(data){
        updateInObjectStore("reservations", data.id, data);
        updateReservationDisplay(data);
      });
  });
};

var urlBase64ToUint8Array = function(base64String) {
  var padding = "=".repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);
  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

var subscribeUserToNotifications = function() {
  Notification.requestPermission().then(function(permission) {
    if (permission === "granted") {
      var subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          "BKQnRd5V_u942j95_etSdNS6EkYse_HcG-KEbPm_KfvkrGGN_c45G_POcmP8yC_f90SB37ybDoUEcru6Xbr7pTY"
        )
      };
      navigator.serviceWorker.ready.then(function(registration) {
        return registration.pushManager.subscribe(subscribeOptions);
      }).then(function(subscription) {
        var fetchOptions = {
          method: "post",
          headers: new Headers({
            "Content-Type": "application/json"
          }),
          body: JSON.stringify(subscription)
        };
        return fetch("/add-subscription", fetchOptions);
      });
    }
  });
};

var offerNotification = function() {
  if ("Notification" in window &&
      "PushManager" in window &&
      "serviceWorker" in navigator) {
    if (Notification.permission !== "granted") {
      showNotificationOffer();
    } else {
      subscribeUserToNotifications();
    }
  }
};

// Adds a reservation as pending to IndexedDB, the DOM, and the server.
var addReservation = function(id, arrivalDate, nights, guests) {
  var reservationDetails = {
    id:           id,
    arrivalDate:  arrivalDate,
    nights:       nights,
    guests:       guests,
    status:       "Sending"
  };
  addToObjectStore("reservations", reservationDetails);
  renderReservation(reservationDetails);
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    navigator.serviceWorker.ready.then(function(registration) {
      registration.sync.register("sync-reservations");
    });
  } else {
    var params = Object.keys(reservationDetails).map(k => k+"="+reservationDetails[k]).join("&");
    fetch("/make-reservation?" + params)
      .then(function(response){
        return response.json();
      })
      .then(updateReservationDisplay);
  }
  offerNotification();
};




/* ************************************************************ */
/* The code below this point is used to render to the DOM. It   */
/* completely ignores common sense principles like separation   */
/* of concerns as a trade off for readability.                  */
/* You can ignore it, or you can send angry tweets about it to  */
/* @TalAter                                                     */
/* ************************************************************ */

// Goes over an array of reservations, and renders each of them
var renderReservations = function(reservations) {
  document.querySelector("div#reservation-loading").style.display = "none";
  reservations.forEach(function(reservation) {
    renderReservation(reservation);
  });
};

// Renders a reservation card and adds it to the DOM.
var renderReservation = function(reservation) {
  var html =
    "<img src=\"/img/reservation-gih.jpg\" alt=\"Gotham Imperial Hotel\" class=\"reserved-hotel-image\">"+
    "<div class=\"reservation-details\">"+
      "<div class=\"reserved-hotel-details\">"+
        "<strong>Gotham Imperial Hotel</strong>"+
        "<p>1 Imperial Plaza, Gotham.</p>"+
        "<p class=\"arrivalDate\">Check-in: <span>"+reservation["arrivalDate"]+"</span>.</p>"+
        "<p>"+reservation["nights"]+" nights. "+reservation["guests"]+" guests.</p>"+
      "</div>"+
      "<div class=\"reservation-price\">"+
        "<p>Total price</p>"+
        "<p><strong>"+(reservation["price"] ? "§"+reservation["price"]+".99" : "?")+"</strong></p>"+
      "</div>"+
    "</div>"+
    "<div class=\"reservation-actions\">"+
      "<a href=\"#\">Modify booking details</a>"+
      "<div class=\"reservation-status\">"+reservation["status"]+"</div>"+
    "</div>"+
    "<div class=\"reservation-meta-data\">"+
      "<strong>Order number:</strong> <span>"+reservation["id"]+"</span>"+
      "<strong>Booked on:</strong> <span class=\"reservation-bookedOn\">"+(reservation["bookedOn"] ? reservation["bookedOn"] : "n/a")+"</span>"+
    "</div>";

  var reservationDiv = document.createElement("div");
  reservationDiv.className = "reservation-card";
  reservationDiv.id = "reservation-"+reservation["id"];
  reservationDiv.setAttribute("data-id", reservation["id"]);
  reservationDiv.innerHTML = html;

  var reservationCards = document.getElementById("reservation-cards");
  reservationCards.insertBefore(reservationDiv, reservationCards.firstChild);

  if (reservation["status"] !== "Confirmed") {
    document.getElementById("reservation-"+reservation["id"]).classList.add("reservation-card--unconfirmed");
  }

  // Adds an event listener to the modify reservation button.
  var processModifyReservation = function(event) {
    event.preventDefault();
    var possibleResponses = ["Orders are non-negotiable!", "Not open to discussion!"];
    this.innerText = possibleResponses[Math.floor(Math.random()*possibleResponses.length)];
    this.classList.add("reservation-action--error");
    return false;
  };
  document.querySelector("#reservation-"+reservation["id"]+" a").addEventListener("click", processModifyReservation, false);
};

var updateReservationDisplay = function(reservation) {
  var reservationNode = document.getElementById("reservation-" + reservation.id);
  reservationNode.querySelector(".reservation-bookedOn").innerText = reservation.bookedOn;
  reservationNode.querySelector(".reservation-price strong").innerText = "§"+reservation.price+".99";
  reservationNode.querySelector(".reservation-status").innerText = reservation.status;
  reservationNode.querySelector(".arrivalDate span").innerText = reservation.arrivalDate;
  if (reservation["status"] !== "Confirmed") {
    reservationNode.classList.add("reservation-card--unconfirmed");
  } else {
    reservationNode.classList.remove("reservation-card--unconfirmed");
  }
};

var showNotificationOffer = function() {
  document.getElementById("offer-notification").classList.remove("modal--hide");
};

var hideNotificationOffer = function() {
  document.getElementById("offer-notification").classList.add("modal--hide");
};

var processQuerystringReservation = function() {
  // Prepopulate reservation form from querystring and create reservation
  var url = new URL(window.location);
  var params = url.searchParams;
  if (
    params.has("form--arrival-date") &&
    params.has("form--nights") &&
    params.has("form--guests")
  ) {
    document.getElementById("form--arrival-date").value = params.get("form--arrival-date");
    document.getElementById("form--nights").value = params.get("form--nights");
    document.getElementById("form--guests").value = params.get("form--guests");
    document.querySelector("form#reservation-form button").click();
    window.history.replaceState(null, "", url.origin + url.pathname);
  }
};

document.addEventListener("DOMContentLoaded", processQuerystringReservation, false);