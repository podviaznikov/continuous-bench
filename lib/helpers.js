
/**
 * Scripts for the request.
 */

exports.scripts = function(req){
  return req.scripts = [];
};

/**
 * Script helper.
 */

exports.script = function(req){
  return function(path){
    req.scripts.push(path);
  }
};