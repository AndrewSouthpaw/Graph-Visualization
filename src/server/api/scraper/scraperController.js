'use strict';

var request = require('request');
var reportError = require('../../utils/errorReporter');
var utils = require('../../utils/scraper');
var VError = require('verror');

module.exports = {
  scrapeEvents: scrapeEvents
};

/////////////////

/**
 * Scrapes HTML from a queried website, runs it through a scraping utility
 * and returns the collected events in JSON format stringified, e.g.:
 * [
 *   {
 *     "name": "Big awesome party",
 *     "date": ISO format
 *   },
 *   {
 *     ...
 *   }
 * ]
 *
 * Currently only works for http://events.stanford.edu
 *
 * @param  {object}   req  Request
 * @param  {object}   res  Response
 * @param  {Function} next Next middleware
 * @return {string}        JSON stringified
 */
function scrapeEvents(req, res, next) {

  /**
   * Extract url from request. Sometimes the requested url will have its own
   * search parameters, which will throw off parsing by Express. So, use the
   * originalUrl property and remove the API prefix to get the intended
   * url for scraping.
   */
  var url = req.originalUrl.replace('/1/scrape/', '');

  // TODO: refactor to not create redundant request + phantom action on eventbrite
  request(url, function(err, resp, body) {
    if (err) return reportError(new VError(err, 'Error requesting url'), next);

    // Delegate to utility module for scraping logic
    var results;
    try {
      utils.scrapeEvents(url, body, function(results) {
        return res.json(results);
      });
    } catch (e) {
      return reportError(e, next, 'Error scraping event');
    }
  });

}
