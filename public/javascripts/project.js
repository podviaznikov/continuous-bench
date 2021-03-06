
/**
 * Fetch initial benchmark data.
 */

o(refresh);

/**
 * Re-render on resize.
 */

o(window).resize(function(){
  o('#chart').empty();
  render(render.previousCommits);
});

/**
 * Manual commit benchmark.
 */

o(function(){
  var commit = View(o('#commit'));
  // TODO: there's not really any point
  // to showing a success dialog here.
  // When we have call-outs use those
  commit.submit.json(function(res){
    commit.commit.clear();
    if (202 == res.status) {
      dialog
        .title('Job queued')
        .message('I\'ll begin benchmarking ' + commit.commit() + ' right away!')
        .show();
    } else {
      dialog
        .title('Error')
        .message(res.responseText)
        .show();
    }
  });
});

/**
 * Render the benchmark data.
 */

function refresh() {
  request
    .get(express.project + '/benchmarks')
    .end(function(res){
      var commits = res.body;
      if (!isEmpty(commits)) {
        render.previousCommits = commits;
        render(commits);
      }
    });
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

/**
 * Check if `obj` is empty.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api public
 */

function isEmpty(obj) {
  return 0 == Object.keys(obj).length;
}