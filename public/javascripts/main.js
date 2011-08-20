
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
    if (200 == res.status) {
      
    } else {
      notify('error', res.responseText);
    }
  });
});

function notify(type, msg) {
  
}

/**
 * Render chart with object of `commits`.
 *
 * @param {Object} commits
 */

function render(commits) {
  var firstKey = Object.keys(commits)[0]
    , keys = commits[firstKey]
    , data = []
    , series
    , sha
    , i = 0;

  for (var key in keys) {
    series = [];
    for (var commit in commits) {
      sha = commit;
      commit = commits[sha][key];
      series.push({ label: sha.slice(0, 4), x: i, y: commit });
      ++i;
    }
    data.push(series);
  }

  renderChart(data);
}