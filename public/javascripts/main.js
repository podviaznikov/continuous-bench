
// better names :)

request = superagent
o = $

o(function(){
  var data = [[{}]];
  renderChart(data);
});

o(function(){
  request
    .get(express.project + '/benchmarks')
    .end(function(res){
      console.log(res.body);
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