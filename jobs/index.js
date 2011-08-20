
/**
 * Module dependencies.
 */

var kue = require('kue')
  , jobs = kue.createQueue('cb')
  , Project = require('../lib/project')
  , db = require('redis').createClient();

// load config

require('../app');

// TODO: concurrency

/**
 * Process benchmark jobs.
 */

jobs.process('benchmark', function(job, done){
  var user = job.data.user
    , project = job.data.project
    , commit = job.data.commit
    , key = 'cb:' + user + '/' + project
    , project = new Project(user, project)
    , steps = 6
    , complete = 0;

  function log(event) {
    project.on(event, function(){
      job.log(event);
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
      job.log('saving %s results to the %s hash', commit, key);
      job.progress(++complete, steps);
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
