var router = require('express').Router();
var path = require('path');
var errorHandler = require('./utils/errorHandler');

module.exports = function applicationRouter(app) {

  /**
   * catchall router if the request hasn't been handled by the other routes.
   * Passes off responsibility to ui-router by serving up base index.html
   * and leaves it to ui-router to handle the specific route (either with
   * a state already created or with the otherwise clause)
   */
  router.get('/*', function(req, res, next) {
    res.sendFile(path.resolve(__dirname + '/../../build/index.html'));
  });

  // Place router on app
  app.use(router);

  // Set error handling
  app.use(errorHandler);

};
