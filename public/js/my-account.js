$(document).ready(function() {

  // Fetch and render user reservations
  $.getJSON('/reservations.json', function(data) {
    $('div#reservation-loading').hide();
    data.forEach(function(reservation) {
      renderReservation(reservation);
    });
  });

});






/* ************************************************************ */
/* The code below this point is used to render to the DOM. It   */
/* completely ignores common sense principles like separation   */
/* of concerns as a trade off for readability.                  */
/* You can ignore it, or you can send angry tweets about it to  */
/* @TalAter                                                     */
/* ************************************************************ */

// Renders a reservation card and adds it to the DOM.
var renderReservation = function(reservation) {
  var newReservation = $(
    '<div class="reservation-card" id="reservation-'+reservation['id']+'">'+
      '<img src="/img/reservation-gih.jpg" alt="Gotham Imperial Hotel" class="reserved-hotel-image">'+
      '<div class="reservation-details">'+
        '<div class="reserved-hotel-details">'+
          '<strong>Gotham Imperial Hotel</strong>'+
          '<p>1 Imperial Plaza, Gotham.</p>'+
          '<p>Check-in: '+reservation['check_in']+'.</p>'+
          '<p>'+reservation['nights']+' nights. '+reservation['guests']+' guests.</p>'+
        '</div>'+
        '<div class="reservation-price">'+
          '<p>Total price</p>'+
          '<p><strong>§'+reservation['price']+'.99</strong></p>'+
        '</div>'+
      '</div>'+
      '<div class="reservation-actions">'+
        '<a href="#">Modify booking details</a>'+
        '<div class="reservation-status">Awaiting confirmation</div>'+
      '</div>'+
      '<div class="reservation-meta-data">'+
        '<span><strong>Order number:</strong> '+reservation['id']+'</span>'+
        '<span><strong>Booked on:</strong> '+reservation['booked_on']+'</span>'+
      '</div>'+
    '</div>'
  );
  $('#reservations-container').append(newReservation);

  // Adds an event listener to the modify reservation button.
  $('#reservation-'+reservation['id']+' a').click(function() {
    var possibleResponses = ['Orders are non-negotiable!', 'Not open to discussion!'];
    $(this).text(possibleResponses[Math.floor(Math.random()*possibleResponses.length)]);
    $(this).addClass('reservation-action--error');
    return false;
  });

};
