
// Constants used during the AJAX request.
//var ERROR = {
  //"message": "The request failed!"
//};

// Wait for the document to load before binding event handlers further.
$(function() {

  // Obtain programmatic reference to the important elements of the page.
  var cityForm = $('#cityForm'),
      city = $('#city'),
      output = $('#wrapper');

  // Listen for submission events on the example form.
  cityForm.on('submit', function(e) {

    // Programmatically prevent the form from submitting.
    e.preventDefault();

    // Resolve the target URI.
    var target = '/weather';
    var param = {city : city.val()}

    // Perform an AJAX request using the get() method.
    // If the request was successful, append the response.
    // If not, append a JSON error object.
    $.post(target, param, function(response) {

      // The most notable difference here is that jQuery attempts to parse JSON
      // responses into a JSON object, whereas vanilla JavaScript returns the
      // result of an AJAX request as a string.
      output.append('<div>' + /*JSON.stringify(response)*/response + '</div>');
    }).fail(function() {
      output.append('<div> The request failed! </div>');
    });
  });
});