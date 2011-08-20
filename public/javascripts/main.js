
// better names :)

request = superagent
o = $

/**
 * Render the benchmark data.
 */

o(function(){
  request
    .get(express.project + '/benchmarks')
    .end(function(res){
      render(res.body);
    });
});

/**
 * Manual commit benchmark.
 */

o(function(){
  var commit = View(o('#commit'));
  commit.submit.json(function(res){
    // TODO: handle (global errors + preventDefault())
    console.log(res);
  });
});

function render(commits) {
  var firstKey = Object.keys(commits)[0]
    , keys = commits[firstKey]
    , data = []
    , series
    , i = 0;

  for (var key in keys) {
    series = [];
    for (var commit in commits) {
      commit = commits[commit][key];
      series.push({ x: i, y: commit });
      ++i;
    }
    data.push(series);
  }

  renderChart(data);
}