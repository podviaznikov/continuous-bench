
/**
 * Module dependencies.
 */

var express = require('express');

var root = __dirname + '/../';

app.configure(function(){
  app.set('views', root + '/views');
  app.set('view engine', 'jade');
  app.set('average', 3);
  app.set('projects', '/tmp/projects');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'keyboard chaton' }));
  app.use(require('stylus').middleware({ src: root + '/public' }));
  app.use(express.static(root + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});