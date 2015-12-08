function avg(input) {
  var output = 0;
  input.forEach(function(i) {
    output += i;
  });
  return Math.round(output/input.length)/1000;
}
$(document).ready(function() {
  var stats = [];
  timings.forEach(function(line) {
    if(line.indexOf(",") != -1) {
      var data = line.split(",");
      var size = parseInt(data[0], 10);
      var time = parseInt(data[1], 10);
      if(stats[size] === undefined) {
        stats[size] = [];
      }
      stats[size].push(time);
    }
  });
  var keys = [];
  var values = [];
  for(var i = 0; i < stats.length; i++) {
    if(stats[i] !== undefined) {
      keys.push(i);
      values.push(avg(stats[i])/i);
      console.log(i, stats[i]);
    }
  }

  var ctx = $(".results")[0].getContext("2d");
  var data = {
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
  };
  console.log(data);
  new Chart(ctx).Bar(data);
});
