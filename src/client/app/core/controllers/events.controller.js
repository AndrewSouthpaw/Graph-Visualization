;(function() {

  'use strict';

  angular.module('app.core')
    .controller('EventsController', EventsController);

  /* @ngInject */
  function EventsController($scope, events) {
    var vm = this;

    // Data
    vm.events = events.events;
    vm.viewMode = 'list';

    // Methods
    vm.displayEvents = displayEvents;
    vm.changeViewMode = changeViewMode;

    /////////////

    /**
     * Updates events with new list of events passed as param
     * @param  {Array} events List of new events to display
     * @return {undefined}
     */
    function displayEvents(events) {
      vm.events = events;
    }

    /**
     * Changes the view mode for events
     * @param  {String} mode New mode to be used, 'list' or 'grid'
     * @return {undefined}
     */
    function changeViewMode(mode) {
      vm.viewMode = mode;
    }

    /**
     * Listen for changes to events listing
     */
    $scope.$watch(function() {
      return events.events;
    }, function(newValue) {
      vm.events = events.events;
    });
  }

}).call(this);
