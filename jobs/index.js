
/**
 * Module dependencies.
 */

var kue = require('kue')
  , jobs = kue.createQueue('cb')
  , Project = require('../lib/project')
  , db = require('redis').createClient();

// load config

require('../app');

/**
 * Process benchmark jobs.
 */

jobs.process('benchmark', function(job, done){
  var user = job.data.user
    , project = job.data.project
    , commit = job.data.project
    , project = new Project(user, project)
    , key = user + '/' + project
    , steps = 0
    , complete = 0;

  function log(step) {
    ++steps;
    project.on(step, function(){
      job.log(step);
      job.progress(++complete, steps);
    });
  }

  log('fetch');
  log('clone');
  log('checkout');
  log('dependencies');
  log('benchmark');

  project.benchmark(commit, function(err, res){
    if (err) return done(err);
    try {
      res = JSON.stringify(res);
      db.hset(key, commit, res, done);
    } catch (err) {
      done(err);
    }
  });
});

// start the app

kue.app.listen(8888);
console.log('Kue listening on port %d', kue.app.address().port);