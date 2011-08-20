
/**
 * Module dependencies.
 */

var expose = require('express-expose');

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