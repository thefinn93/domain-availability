function checkNames(names) {
  var deferred = Q.defer();
  $.get('/check/' + names.join(","), function(data) {
    if(data.ApiResponse.CommandResponse[0].DomainCheckResult !== undefined) {
      data.ApiResponse.CommandResponse[0].DomainCheckResult.forEach(function(result) {
        var splitbydots = result.$.Domain.split(".");
        var name = splitbydots[0];
        var TLD = splitbydots[1];
        if(splitbydots.length > 2) {
          for(var i = 2; i < splitbydots.length; i++) {
            TLD += "-" + splitbydots[i];
          }
        }

        console.log(result.$.Domain, "TLD:", TLD);

        var box = $("." + TLD).text(result.$.Domain);
        if(result.$.Available == "true") {
          box.removeClass("unknown").addClass("available");
        } else if(result.$.Available == "false") {
          box.removeClass("unknown").addClass("unavailable");
        } else {
          console.log("whut", result);
        }
      });
    } else {
      console.error("data.ApiResponse.CommandResponse[0].DomainCheckResult is undefined", data);
    }
    deferred.resolve();
  });
  return deferred.promise;
}
$(document).ready(function() {
  var tlds = [];
  $.get('/tlds', function(tldlist) {
    for(var tld in tldlist) {
      if(tldlist.hasOwnProperty(tld)) {
        var box = $("<span>")
          .addClass('tld')
          .addClass('unknown')
          .addClass(tld.replace(/\./g, '-'))
          .html('<b>.' + tld + '</b>');
        $(".results").append(" ").append(box);
        tlds.push(tld);
      }
    }
  });
  $('#name').on('blur', function(evt) {
    var name = evt.currentTarget.value;
    var batchesToCheck = [];
    for(var i = 0; i < tlds.length; i++) {
      var names = [];
      for(var j = 0; j + i < tlds.length && j < 10; j++) {
        var domain = name + "." + tlds[i + j];
        names.push(domain);
      }
      batchesToCheck.push(names);
    }
    var next = Q();
    batchesToCheck.forEach(function(batch) {
      next = next.then(function() {
        console.log(batch);
        return checkNames(batch);
      });
    });
  });
});
