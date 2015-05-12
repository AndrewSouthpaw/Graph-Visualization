;(function() {

  'use strict';

  angular.module('app.core')
    .controller('FindEventsController', FindEventsController);

  /* @ngInject */
  function FindEventsController(events) {
    var vm = this;
    // Data
    vm.url = '';

    // Methods
    vm.scrapeEventsPage = scrapeEventsPage;

    //////////

    function scrapeEventsPage() {
      console.log('Scraping event', vm.url);
      events.scrapeEventsPage('/1/scrape/' + vm.url);
      vm.url = '';
    }

  }

}).call(this);
