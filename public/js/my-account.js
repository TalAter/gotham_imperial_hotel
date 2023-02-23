$(document).ready(function () {
	// Fetch and render user reservations
	populateReservations();

	// Add booking widget functionality
	$("#reservation-form").submit(function (event) {
		event.preventDefault();
		var arrivalDate = $("#form--arrival-date").val();
		var nights = $("#form--nights").val();
		var guests = $("#form--guests").val();
		var id = Date.now().toString().substring(3, 11);
		if (!arrivalDate || !nights || !guests) {
			return false;
		}
		addReservation(id, arrivalDate, nights, guests);
		return false;
	});

	// Periodically check for unconfirmed bookings
	setInterval(checkUnconfirmedReservations, 5000);
});

// Fetches reservations from server and renders them to the page
var populateReservations = function () {
	$.getJSON("/reservations.json", renderReservations);
};

// Go over unconfirmed reservations, and verify their status against the server.
var checkUnconfirmedReservations = function () {
	$(".reservation-card--unconfirmed").each(function () {
		$.getJSON(
			"/reservation-details.json",
			{ id: $(this).data("id") },
			function (data) {
				updateInObjectStore("reservations", data.id, data);
				updateReservationDisplay(data);
			}
		);
	});
};

// Adds a reservation as pending to the DOM, and try to contact server to book it.
var addReservation = function (id, arrivalDate, nights, guests) {
	var reservationDetails = {
		id: id,
		arrivalDate: arrivalDate,
		nights: nights,
		guests: guests,
		status: "Awaiting confirmation",
	};
	addToObjectStore("reservations", reservationDetails);
	renderReservation(reservationDetails);
	$.getJSON("/make-reservation", reservationDetails, function (data) {
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
var renderReservations = function (reservations) {
	$("div#reservation-loading").hide();
	reservations.forEach(function (reservation) {
		renderReservation(reservation);
	});
};

// Renders a reservation card and adds it to the DOM.
var renderReservation = function (reservation) {
	var newReservation = $(
		'<div class="reservation-card" id="reservation-' +
			reservation["id"] +
			'" data-id="' +
			reservation["id"] +
			'">' +
			'<img src="/img/reservation-gih.jpg" alt="Gotham Imperial Hotel" class="reserved-hotel-image">' +
			'<div class="reservation-details">' +
			'<div class="reserved-hotel-details">' +
			"<strong>Gotham Imperial Hotel</strong>" +
			"<p>1 Imperial Plaza, Gotham.</p>" +
			'<p class="arrivalDate">Check-in: <span>' +
			reservation["arrivalDate"] +
			"</span>.</p>" +
			"<p>" +
			reservation["nights"] +
			" nights. " +
			reservation["guests"] +
			" guests.</p>" +
			"</div>" +
			'<div class="reservation-price">' +
			"<p>Total price</p>" +
			"<p><strong>" +
			(reservation["price"] ? "§" + reservation["price"] + ".99" : "?") +
			"</strong></p>" +
			"</div>" +
			"</div>" +
			'<div class="reservation-actions">' +
			'<a href="#">Modify booking details</a>' +
			'<div class="reservation-status">' +
			reservation["status"] +
			"</div>" +
			"</div>" +
			'<div class="reservation-meta-data">' +
			"<strong>Order number:</strong> <span>" +
			reservation["id"] +
			"</span>" +
			'<strong>Booked on:</strong> <span class="reservation-bookedOn">' +
			(reservation["bookedOn"] ? reservation["bookedOn"] : "n/a") +
			"</span>" +
			"</div>" +
			"</div>"
	);
	$("#reservation-cards").prepend(newReservation);
	if (reservation["status"] !== "Confirmed") {
		newReservation.addClass("reservation-card--unconfirmed");
	}

	// Adds an event listener to the modify reservation button.
	$("#reservation-" + reservation["id"] + " a").click(function () {
		var possibleResponses = [
			"Orders are non-negotiable!",
			"Not open to discussion!",
		];
		$(this).text(
			possibleResponses[
				Math.floor(Math.random() * possibleResponses.length)
			]
		);
		$(this).addClass("reservation-action--error");
		return false;
	});
};

var updateReservationDisplay = function (reservation) {
	var reservationNode = $("#reservation-" + reservation.id);
	$(".reservation-bookedOn", reservationNode).text(reservation.bookedOn);
	$(".reservation-price strong", reservationNode).text(
		"§" + reservation.price + ".99"
	);
	$(".reservation-status", reservationNode).text(reservation.status);
	$(".arrivalDate span", reservationNode).text(reservation.arrivalDate);
	if (reservation["status"] !== "Confirmed") {
		reservationNode.addClass("reservation-card--unconfirmed");
	} else {
		reservationNode.removeClass("reservation-card--unconfirmed");
	}
};

var showNotificationOffer = function () {
	$("#offer-notification").removeClass("modal--hide");
};

var hideNotificationOffer = function () {
	$("#offer-notification").addClass("modal--hide");
};

$(document).ready(function () {
	// Prepopulate reservation form from querystring and create reservation
	var url = new URL(window.location);
	var params = url.searchParams;
	if (
		params.has("form--arrival-date") &&
		params.has("form--nights") &&
		params.has("form--guests")
	) {
		$("#form--arrival-date").val(params.get("form--arrival-date"));
		$("#form--nights").val(params.get("form--nights"));
		$("#form--guests").val(params.get("form--guests"));
		$("form#reservation-form").submit();
		window.history.replaceState(null, "", url.origin + url.pathname);
	}
});
