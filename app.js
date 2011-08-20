
/**
 * Module dependencies.
 */

var express = require('express');

app = module.exports = express.createServer();

require('./lib/config');
require('./lib/routes');

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
