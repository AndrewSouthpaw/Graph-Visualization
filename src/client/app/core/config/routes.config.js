;(function() {

  angular.module('app.core')
    .config(config);

  /* @ngInject */
  function config($stateProvider, $locationProvider, $urlRouterProvider) {

    $stateProvider
      /**
       * @name landing
       * @type {route}
       * @description First page for incoming users, and for default routing
       *              for all failed routes.
       */
      .state('landing', {
        url: '/',
        views: {
          '': {
            templateUrl: '/html/core/views/landing.html'
          },

          'events@landing': {
            templateUrl: '/html/core/views/events.html',
            controller: 'EventsController',
            controllerAs: 'vm'
          },

          'find-events@landing': {
            templateUrl: '/html/core/views/find-events.html',
            controller: 'FindEventsController',
            controllerAs: 'vm'
          }
        }
        // templateUrl: '/html/core/views/landing.html',
        // controller: 'LandingController',
        // controllerAs: 'vm'
      });

    // default uncaught routes to landing page
    $urlRouterProvider.otherwise('/');

    // enable HTML5 mode
    $locationProvider.html5Mode(true);
  }

}).call(this);
