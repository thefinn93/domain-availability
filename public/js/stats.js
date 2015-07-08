$(document).ready(function() {
  var stats = [];
  timings.forEach(function(line) {
    if(line.indexOf(",") != -1) {
      var data = line.split(",");
      var size = parseInt(data[0], 10);
      var time = parseInt(data[1], 10);
      if(size < stats.length) {
        stats.length = size+1;
      }
      if(stats[size] === undefined) {
        stats[size] = 0;
      }
      stats[size]++;
    }
  });
  var keys = [];
  var values = [];
  for(var i = 0; i < stats.length; i++) {
    if(stats[i] !== undefined) {
      keys.push(i);
      values.push(stats[i]);
    }
  }

  var ctx = $(".results")[0].getContext("2d");
  new Chart(ctx).Bar({
    labels: keys,
    datasets: [
      {
        label: "Time",
        fillColor: "rgba(220,220,220,0.5)",
        strokeColor: "rgba(220,220,220,0.8)",
        highlightFill: "rgba(220,220,220,0.75)",
        highlightStroke: "rgba(220,220,220,1)",
        data: values
      }
    ]
  });
});
