
/**
 * Module dependencies.
 */

var kue = require('kue')
  , jobs = kue.createQueue('cb')
  , Project = require('../project');

/**
 * Process benchmark jobs.
 */

jobs.process('benchmark', function(job, done){
  var user = job.data.user
    , project = job.data.project
    , commit = job.data.project
    , project = new Project(user, project);

  project.benchmark(commit, function(err, obj){
    if (err) return done(err);
  });
});

// start the app

kue.app.listen(8888);
console.log('Kue listening on port %d', kue.app.address().port);