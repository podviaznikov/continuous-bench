
/**
 * Module dependencies.
 */

var exec = require('child_process').exec
  , db = require('redis').createClient();

/**
 * Expose `Project`.
 */

module.exports = Project;

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
};