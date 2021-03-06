
/**
 * Module dependencies.
 */

var expose = require('express-expose')
  , Project = require('./project')
  , kue = require('kue')
  , jobs = kue.createQueue('cb');

// load app config

require('../app');

/**
 * GET index page.
 */

app.get('/', function(req, res, next){
  Project.names(function(err, names){
    if (err) return next(err);
    res.render('index', { projects: names });
  });
});

/**
 * GET project page.
 */

app.get('/:user/:project', function(req, res){
  res.expose(req.params);
  res.render('project', {
      user: req.params.user
    , project: req.params.project
  });
});

/**
 * GET project benchmark results.
 */

app.get('/:user/:project/benchmarks', function(req, res, next){
  var user = req.params.user
    , project = req.params.project;

  Project.get(user, project, function(err, data){
    if (err) return next(err);
    res.send(data);
  });
});

/**
 * POST a commit to create benchmark job.
 * 
 * Examples:
 * 
 *   curl -d 'commit=HEAD' http://local/visionmedia/express/benchmark
 * 
 */

app.post('/:user/:project/benchmark', function(req, res, next){
  var commit = req.body.commit.trim()
    , user = req.params.user
    , project = req.params.project;

  if (!commit) return res.send(400);

  jobs.create('benchmark', {
      user: user
    , project: project
    , commit: commit
    , title: user + '/' + project + '/' + commit + ' benchmark'
  }).save(function(err){
    if (err) return next(err);
    Project.add(user + '/' + project);
    res.send(202);
  });
});