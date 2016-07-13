$(document).ready(function() {

  // Handle clicks on modify booking button
  $('.reservation-actions a').click(function() {
    var possibleResponses = ['Orders are non-negotiable!', 'Not open to discussion!'];
    $(this).text(possibleResponses[Math.floor(Math.random()*possibleResponses.length)]);
    $(this).addClass('reservation-action--error');
    return false;
  });

});
