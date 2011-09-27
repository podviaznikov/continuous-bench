
/**
 * Module dependencies.
 */

var exec = require('child_process').exec
  , EventEmitter = require('events').EventEmitter
  , db = require('redis').createClient()
  , mkdirp = require('mkdirp')
  , utils = require('./utils')
  , path = require('path')
  , noop = function(){}
  , exists = path.exists
  , join = path.join;

/**
 * Expose `Project`.
 */

exports = module.exports = Project;

/**
 * Initialize a `Project` with the given `user` / `project`
 * as they are represented on GitHub.
 *
 * @param {String} user
 * @param {String} project
 * @api public
 */

function Project(user, project){
  this.user = user;
  this.project = project;
  this.results = [];
  this.times = app.settings.average;
  this.dir = join(app.settings.projects, user, project);
  this.repo = 'git://github.com/' + user + '/' + project + '.git';
};

/**
 * Inherit from `EventEmitter.prototype`.
 */

Project.prototype.__proto__ = EventEmitter.prototype;

/**
 * Get benchmarks for `user` / `project` and invoke `fn(err, res)`.
 *
 * @param {String} user
 * @param {String} project
 * @param {Function} fn
 * @return {Type}
 * @api public
 */

exports.get = function(user, project, fn){
  db.hgetall('cb:' + user + '/' + project, function(err, res){
    if (err) return fn(err);
    try {
      for (var key in res) res[key] = JSON.parse(res[key]);
      fn(null, res);
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * Add project `name` to the db and invoke `fn(err)`.
 *
 * @param {String} name
 * @param {Function} fn
 * @api public
 */

exports.add = function(name, fn){
  db.sadd('cb:projects', name, fn || noop);
};

/**
 * Get project names ane invoke `fn(err, names)`.
 *
 * @param {String} name
 * @param {Function} fn
 * @api public
 */

exports.names = function(fn){
  db.smembers('cb:projects', fn);
};

/**
 * Fetch the given `commit` and invoke `fn(err)`.
 *
 * @param {String} commit
 * @param {Function} fn
 * @return {Project} for chaining
 * @api public
 */

Project.prototype.fetch = function(commit, fn){
  var self = this
    , dir = this.dir;

  this.emit('fetch', commit);

  // check if the repo exists
  exists(dir + '/.git', function(exists){
    // exists already, update it
    if (exists) return self.checkout(commit, fn);
    // mkdir -p
    mkdirp(dir, 0755, function(err){
      if (err) return fn(err);
      // clone that shit
      self.clone(commit, fn);
    });
  });

  return this;
};

/**
 * Clone the project's repo and checkout `commit` and invoke `fn(err)`.
 *
 * @param {String} commit
 * @param {Function} fn
 * @return {Project} for chaining
 * @api public
 */

Project.prototype.clone = function(commit, fn){
  var self = this
    , dir = this.dir
    , cmd = 'git clone ' + this.repo + ' ' + dir;

  this.emit('clone', cmd);

  exec(cmd, function(err){
    if (err) return fn(err);
    self.checkout(commit, fn);
  });

  return this;
};

/**
 * Checkout the given `commit` and invoke `fn(err)`.
 *
 * @param {String} commit
 * @param {Function} fn
 * @return {Project} for chaining
 * @api public
 */

Project.prototype.checkout = function(commit, fn){
  var self = this
    , dir = this.dir
    , cmd = 'cd ' + dir + ' && git checkout ' + commit;

  this.emit('checkout', cmd);

  exec(cmd, function(err){
    if (err) return fn(err);
    self.updateDependencies(fn);
  });

  return this;
};

/**
 * Update NPM dependencies.
 *
 * @param {Function} fn
 * @return {Project} for chaining
 * @api public
 */

Project.prototype.updateDependencies = function(fn){
  var self = this
    , dir = this.dir
    , cmd = 'cd ' + dir + ' && npm install';

  this.emit('dependencies', cmd);

  // TODO: how to get npm to ignore dev-deps?...
  exec(cmd, function(err){
    if (err) return fn(err);
    self.runBenchmarks(fn);
  });

  return this;
};

/**
 * Run benchmarks
 *
 * @param {Function} fn
 * @return {Project} for chaining
 * @api public
 */

Project.prototype.runBenchmarks = function(fn){
  var self = this
    , dir = this.dir
    , cmd = 'cd ' + dir + ' && make benchmark'
    , pending = this.times
    , data = [];

  this.emit('benchmark', cmd);

  // handle error
  function error(err) {
    fn(err);
    fn = function(){};
  }

  // TODO: how to get npm to ignore dev-deps?...
  function again() {
    exec(cmd, function(err, stderr, stdout){
      if (err) return error(err)

      // parse data
      try {
        data.push(utils.parseBenchmark(stderr));
      } catch (err) {
        return error(err);
      }

      // pending benchmarks
      if (--pending) return again();

      // compute averages
      try {
        fn(null, utils.avg(data));
      } catch (err) {
        return error(err);
      }
    });
  }

  again();

  return this;
};

/**
 * Benchmark the given `commit` and invoke `fn(err, res)`.
 *
 * @param {String} commit
 * @param {Function} fn
 * @return {Project} for chaining
 * @api public
 */

Project.prototype.benchmark = function(commit, fn){
  this.fetch(commit, fn);
  return this;
};
