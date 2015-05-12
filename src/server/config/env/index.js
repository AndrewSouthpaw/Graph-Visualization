var join = require('path').join;
var _ = require('lodash');
var nconf = require('nconf');

nconf
  // grab flags, e.g. --foo bar --> nconf.get('foo') === 'bar'
  .argv()
  // grab process.env
  .env()
   // load local.env if exists
  .file({ file: __dirname + '/../local.env.json' });

module.exports = {

  env: nconf.get('NODE_ENV') || 'development',

  // Server port
  port: nconf.get('PORT') || 3000,

};
