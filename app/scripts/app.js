'use strict';

/**
 * @ngdoc overview
 * @name findMeApp
 * @description
 * # findMeApp
 *
 * Main module of the application.
 */
angular
  .module('findMeApp', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'leaflet-directive'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/minsk', {
        templateUrl: 'views/minsk.html',
        controller: 'AboutCtrl'
      })
      .when('/nesvish', {
        templateUrl: 'views/nesvish.html',
        controller: 'AboutCtrl'
      })
      .when('/polock', {
        templateUrl: 'views/polock.html',
        controller: 'AboutCtrl'
      })
      .when('/belweshz', {
        templateUrl: 'views/belweshz.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

  });

Array.prototype.random = function (length) {
    return this[Math.floor((Math.random()*length))];
};

// window.avatars = [
//     {
//         id:'default',
//         name:'default'
//
//     },
//     {
//         id: 'leaf_icon',
//         name:'images/axe.png',
//         iconUrl: 'images/axe.png',
//         iconSize:     [38, 95], // size of the icon
//         iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
//         popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
//
//     },
//
//     {
//         id: 'orange_leaf_icon',
//         name:'images/antimag.png',
//         iconUrl: 'images/antimag.png',
//         iconSize:     [38, 95],
//         iconAnchor:   [22, 94],
//
//     }
// ]

window.colors = ['#2196f3', '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'];
window.avatars = ['images/axe.png', 'images/antimag.png'];

// window.points = [
//    
//     {markers2: {
//             lat: 40.095,
//             lng: -3.823,
//             message: "This is Madrid. But you can drag me to another position",
//             focus: true,
//             draggable: true,
//             icon: window.avatars[1].name
//         }
//     },
//     {Barcelona: {
//             lat: 41.38,
//             lng: 2.18,
//             message: "This is Barcelona. You can't drag me",
//             focus: false,
//             draggable: false
//         }
//     }
// ]
//
//
