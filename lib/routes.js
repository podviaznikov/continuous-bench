
/**
 * Module dependencies.
 */

var expose = require('express-expose')
  , Project = require('./project')
  , kue = require('kue')
  , jobs = kue.createQueue('cb');

/**
 * GET index page.
 */

app.get('/', function(req, res){
  res.render('index');
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
 * POST a commit to create benchmark job.
 */

app.post('/:user/:project/benchmark', function(req, res){
  var commit = req.body.commit
    , user = req.params.user
    , project = req.params.project;

  // queue benchmark job
  req.params.commit = commit;
  req.params.title = user + '/' + project + '/' + commit + ' benchmark';
  jobs.create('benchmark', req.params).save();
  res.send(202);
});