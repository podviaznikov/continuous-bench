
/**
 * Parse the given benchmark `str` formatted as follows:
 *
 *    NAME: VAL LF
 *    NAME: VAL LF
 *    NAME: VAL LF
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.parseBenchmark = function(str){
  return String(str).trim().split(/\n+/).reduce(function(obj, line){
    var parts = line.split(/ *: */);
    obj[parts.shift()] = parseInt(parts.shift(), 10);
    return obj;
  }, {});
};