'use strict';

angular.module('venmurasuwebApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/latest', {
        templateUrl: 'views/main.html',
        controller: 'LatestCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
