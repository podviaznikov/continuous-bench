
/**
 * Module dependencies.
 */

var kue = require('kue')
  , jobs = kue.createQueue('cb');

/**
 * Process benchmark jobs.
 */

jobs.process('benchmark', function(job, done){
  console.log(job.data);
});

// start the app

kue.app.listen(8888);
console.log('Kue listening on port %d', kue.app.address().port);