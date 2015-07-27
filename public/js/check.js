function checkNames(names) {
  var deferred = Q.defer();
  $.get('/check/' + names.join(","), function(data) {
    if(data.ApiResponse.CommandResponse && data.ApiResponse.CommandResponse[0].DomainCheckResult !== undefined) {
      data.ApiResponse.CommandResponse[0].DomainCheckResult.forEach(function(result) {
        var splitbydots = result.$.Domain.split(".");
        var name = splitbydots[0];
        var TLD = splitbydots[1];
        if(splitbydots.length > 2) {
          for(var i = 2; i < splitbydots.length; i++) {
            TLD += "-" + splitbydots[i];
          }
        }

        var box = $("." + TLD);
        if(result.$.Available == "true") {
          box.removeClass("unknown").addClass("available").html(
            $("<a>")
              .attr('href', 'https://www.namecheap.com/domains/registration/results.aspx?domain=' + result.$.Domain + aff)
              .attr('target', '_blank')
              .text(result.$.Domain)
          );
        } else if(result.$.Available == "false") {
          box.removeClass("unknown").addClass("unavailable").html(
            $("<a>")
              .attr('href', 'http://' + result.$.Domain)
              .attr('target', '_blank')
              .text(result.$.Domain)
          );
        } else {
          console.log("whut", result);

        }
        completed++;
        updateStatus();
      });
    } else {
      console.error("data.ApiResponse.CommandResponse[0].DomainCheckResult is undefined", data);
      Raven.captureMessage("data.ApiResponse.CommandResponse[0].DomainCheckResult", {extra: data});
    }
    deferred.resolve();
  });
  return deferred.promise;
}

function updateStatus() {
  $(".status").text(completed + "/" + tlds.length + " (" + currentbatchsize + ")");
}

function runBatches() {
  var batchsize = window.batchsize || (Math.round(Math.random() * 49) + 1);
  window.currentbatchsize = batchsize;
  console.debug('batch size is', batchsize);
  var name = $("#name").val();
  window.location.hash = name;

  if(window._paq) {
    _paq.push(["trackSiteSearch", name]);
  }
  var batchesToCheck = [];
  for(var i = 0; i < tlds.length; i += batchsize) {
    var names = [];
    for(var j = 0; j + i < tlds.length && j < batchsize; j++) {
      var domain = name + "." + tlds[i + j];
      names.push(domain);
    }
    batchesToCheck.push(names);
  }

  reset();

  $(".throbber").addClass("three-quarters-loader");
  var next = Q();
  window.completed = 0;
  updateStatus();
  batchesToCheck.forEach(function(batch) {
    next = next.then(function() {
      return checkNames(batch);
    });
  });
  next.then(function() {
    $(".throbber").removeClass("three-quarters-loader");
  });
  return false;
}

function reset() {
  for(var tld in tlds) {
    if(tlds.hasOwnProperty(tld)) {
      $("." + tlds[tld].replace(/\./g, '-'))
        .removeClass("unavailable")
        .removeClass("available")
        .addClass("unknown")
        .text("." + tlds[tld]);
    }
  }
}

$(document).ready(function() {
  $("#name").focus();
  window.tlds = [];
  $.get('/tlds', function(tldlist) {
    window.tldData = tldlist;
    for(var tld in tldlist) {
      if(tldlist.hasOwnProperty(tld)) {
        var box = $("<span>")
          .addClass('tld')
          .addClass('unknown')
          .addClass(tld.replace(/\./g, '-'))
          .html('.' + tld);
        if(window.prioritize && prioritize.indexOf(tld) > -1) {
          $(".results").prepend(box).prepend(" ");
          tlds.unshift(tld);
        } else {
          $(".results").append(" ").append(box);
          tlds.push(tld);
        }
      }
    }
    if(window.location.hash) {
      $("#name").val(window.location.hash.split("#")[1]);
      runBatches();
    }
  });
  $('#checkerform').on('submit', runBatches);
});
