
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

/**
 * Compute averages for the objects in the `data` array.
 *
 * For example `[{ foo: 5 }, { foo: 10 }]` will
 * return the object `{ foo: 7.5 }`.
 *
 * @param {Array} data
 * @return {Object}
 * @api private
 */

exports.avg = function(data){
  var keys = Object.keys(data[0])
    , obj;

  return keys.reduce(function(avg, key){
    for (var i = 0, len = data.length; i < len; ++i) {
      obj = data[i];
      avg[key] = avg[key] || 0;
      avg[key] += obj[key];
    }

    avg[key] /= data.length;
    avg[key] |= 0;
    return avg;
  }, {});
};