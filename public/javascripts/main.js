
// better names :)

request = superagent
o = $

o(function(){
  var data = [[{}]];
  renderChart(data);
});

/**
 * Manual commit benchmark.
 */

o(function(){
  var commit = View(o('#commit'));
  commit.submit.json(function(res){
    console.log(res);
  });
});