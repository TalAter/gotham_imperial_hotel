if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/serviceworker.js").then(function(registration) {
    console.log("Service Worker registered successfully with scope: ", registration.scope);
  }).catch(function(err) {
    console.log("Service Worker registration failed: ", err);
  });
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", function(event) {
    var data = event.data;
    if (data.action === "navigate") {
      window.location.href = data.url;
    } else if (data.action === "update-reservation") {
      updateReservationDisplay(data.reservation);
    }
  });
}

var bootApp = function() {
  // Fetch and render upcoming events in the hotel
  fetch("/events.json")
    .then(function(response){
      return response.json();
    }).then(renderEvents);

    
  var logoutHandler = function(event) {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      event.preventDefault();
      navigator.serviceWorker.controller.postMessage(
        {action: "logout"}
      );
    }
  };
  
  var logoutButton = document.getElementById("logout-button");
  if(logoutButton){
    logoutButton.addEventListener("click", logoutHandler, false);
  }
};

document.addEventListener("DOMContentLoaded", bootApp, false);



/* ************************************************************ */
/* The code below this point is used to render to the DOM. It   */
/* completely ignores common sense principles as a trade off    */
/* for readability.                                             */
/* You can ignore it, or you can send angry tweets about it to  */
/* @TalAter                                                     */
/* ************************************************************ */

var renderEvents = function(data) {
  data.forEach(function(event) {
    var eventHTML = 
      "<div class=\"event-card\">"+
      "<div class=\"event-date\">"+event.date+"</div>"+
      "<img src=\""+event.img+"\" alt=\""+event.title+"\" class=\"img-responsive\" />"+
      "<h4>"+event.title+"</h4>"+
      "<p>"+event.description+"</p>"+
      "</div>";

    var eventDiv = document.createElement("div");
    eventDiv.className = "col-lg-2 col-md-4 col-sm-6 event-container";
    eventDiv.innerHTML = eventHTML;

    var eventCalendar = document.querySelector("#events-container div.calendar-link-container");
    eventCalendar.parentElement.insertBefore(eventDiv, eventCalendar);
  });
};
