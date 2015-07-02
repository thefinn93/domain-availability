$(document).ready(function() {
  $('#name').on('blur', function(evt) {
    var name = evt.currentTarget.value;
    console.log('Looking up', name);
    $.get('/check/' + name, function(data) {
      if(data.ApiResponse.CommandResponse[0].DomainCheckResult !== undefined) {
        data.ApiResponse.CommandResponse[0].DomainCheckResult.forEach(function(result) {
          console.log(result.$.Domain, ":", result.$.Available);
        });
      }
    });
  });
});
