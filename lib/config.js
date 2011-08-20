
/**
 * Module dependencies.
 */

var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib');

var root = __dirname + '/../';

/**
 * General settings.
 */

app.configure(function(){
  app.set('views', root + '/views');
  app.set('view engine', 'jade');
  app.set('average', 3);
  app.set('projects', '/tmp/projects');
  app.dynamicHelpers(require('./helpers'));
});

/**
 * General middleware config.
 */

app.configure(function(){
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'keyboard chaton' }));
  app.use(stylus.middleware({ src: root + '/public', compile: compile }));
  app.use(express.static(root + '/public'));
  app.use(app.router);
});

/**
 * Development config.
 */

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

/**
 * Production config.
 */

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('compress', true)
    .import('nib')
    .use(nib());
}