'use strict';

var controller = require('./scraperController');

module.exports = function(router) {
  router.route('/1/scrape/*')
    .get(controller.scrapeEvents);
};
