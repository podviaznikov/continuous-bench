
// better names :)

request = superagent
o = $

o(function(){
  console.log(express.user);
  console.log(express.project);
  var seriesA = []
    , seriesB = []
    , data = [seriesA, seriesB];

  for (var i = 0; i < 50; ++i) {
    seriesA.push({ x: i, y: Math.random() * 50 | 0 });
    seriesB.push({ x: i, y: Math.random() * 50 | 0 });
  }

  renderChart(data);
});
