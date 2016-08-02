'use strict';
window.io = window.io || {};

angular.module('findMeApp').controller('MainCtrl', [ '$scope', '$location' , function ($scope, $location) {



    angular.extend($scope, {
        center: {
            lat: 53.89,
            lng: 27.54,
            zoom: 6
        },
        markers: {
            Minsk: {
                lat: 53.8965271,
                lng: 27.5475589,
                message: "<h4>Костёл Святого Симеона<br/> и Святой Елены</h4><a href='#/minsk'><img src='images/Minsk.jpg' style='width: 70px; height: 70px'></a>",
                focus: false,
                draggable: false
            },
            Pusha:{
                lat: 52.7488109,
                lng: 23.9906645,
                message: "<h4>Поместье белорусского<br/> Деда Мороза</h4><a href='#/belweshz'><img src='images/belweshz.jpg' style='width: 70px; height: 70px'></a>",
                focus: false,
                draggable: false

            },
            Nesvish:{
                lat: 53.2220111,
                lng: 26.6573487,
                message: "<h4>Несвижский замок</h4><a href='#/nesvish'><img src='images/Nesvish.jpg' style='width: 70px; height: 70px'></a>",
                focus: false,
                draggable: false

            },
            Polock:{
                lat: 55.4861744,
                lng: 28.7564731,
                message: "<h4>Софийский собор в Полоцке</h4><a href='#/polock'><img src='images/Polock.jpg' style='width: 70px; height: 70px'></a>",
                focus: false,
                draggable: false

            }
        },
        defaults: {
            scrollWheelZoom: false
        }



    });

    $scope.$on("centerUrlHash", function(event, centerHash) {
            $location.search({ c: centerHash });
        });



    $scope.colors = window.colors;
    $scope.avatars = window.avatars;

    // if( typeof _.contains === 'undefined' ) {
    //     _.contains = _.includes;
    //     _.prototype.contains = _.includes;
    // }
    // if( typeof _.object === 'undefined' ) {
    //     _.object = _.zipObject;
    // }

    $scope.user = {
        color: window.colors.random(window.colors.length),
        avatar: window.avatars.random(window.avatars.length)
    };

    $scope.moveToUser = function(i){
        $scope.map.center = i.coords;
    };

    $scope.$watch('user', function() {
        sendUserData();
    }, true);

    $scope.markers2 = [];
    $scope.messages = [];
    $scope.map = { center: { latitude: 20, longitude: 20 }, zoom: 2 };
    // Создаем соединение с сервером; websockets почему-то в Хроме не работают, используем xhr
    var socket = window.io(':3000');
    var setMarker = function(item, marker){

        var marker2 = marker || {};

        var data = JSON.parse(item.user);
        data.location = data.location ||   {coords: {latitude: 20, longitude: 20}};





        // marker.coords = data.location.coords;

        marker2.circle = {
            accuracy: (data.location.coords) ? data.location.coords.accuracy : 0,
            fill: {
                opacity:.3,
                color: data.color
            },
            stroke: {
                opacity:.5,
                weight: 2,
                color: data.color
            }
        };
//        var speed = (data.location.coords.speed != undefined ) ? (data.location.coords.speed / 1000 * 3600) : 0;
//marker2.options = {
//            animation: data.location.new ? 1 : 0,
//            labelContent: (data.name || item.id) + ' | ' + speed +' кm/ч',
//            labelAnchor: '22 0',
//            labelClass: 'marker-labels'
//        };

        marker2.id = item.id;
        marker2.icon = data.avatar;
        $scope.applyChanges();

        return marker2;
    };

    $scope.changeAvatar =function (i) {
        console.log(i)
        // markers2.marker2.icon =
    }

    $scope.applyChanges = function(fn) {
        var phase;
        phase = $scope.$root.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn) {
                return $scope.$eval(fn);
            }
        } else {
            if (fn) {
                return $scope.$apply(fn);
            } else {
                return $scope.$apply();
            }
        }
    };

    var setMessages = function(item){
        var messages = {
          'userSplit': 'Юзер ' + item.name + ' вышел',
          'userJoined': 'Юзер ' + item.name + ' присоединился к нам',
          'connected': 'Юзер ' + item.name + ' загружается к нам'
        };

        if (messages[item.event])
            $scope.messages.push(messages[item.event]);
    };

    $scope.removeMessage = function(i){
        $scope.messages.splice($scope.messages.indexOf(i), 1);
    };
    var updateMarker = function(item){
        var items = $scope.markers2.filter(function(i){
            if (i.id === item.id){
                return item.event !== 'userSplit' ? setMarker(item, i): true;
            }
        });

        if (items.length === 0 && item.user){
            $scope.markers2.push(setMarker(item));
        }

        if (item.event === 'userSplit' && items.length === 1){
            $scope.markers2.splice($scope.markers2.indexOf(items[0]), 1)
        }

        if (item.event === 'userJoined'){
            sendUserData();
        }

        setMessages(item);
        $scope.applyChanges();
    };

    var updateCoordinates = function(location){
        location.new = $scope.map.center.latitude === 20;
        $scope.user.location = location;
        $scope.map.center = { latitude: location.coords.latitude, longitude: location.coords.longitude };
        $scope.center = { lat: location.coords.latitude, lng: location.coords.longitude, zoom: 6 };
    };
    //
    var sendUserData = function(){
        socket.send(JSON.stringify({color: $scope.user.color, location: $scope.user.location, avatar: $scope.user.avatar, name: $scope.user.name}));
    };
    //
    //
    socket.on('connect', function () {
        socket.on('message', function (msg) {
            updateMarker(msg);
        });


        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(updateCoordinates);
            $scope.map.zoom = 16;
        } else {
            socket.send('Geolocation is not supported by this browser.');
        }
    });

    //uiGmapGoogleMapApi.then(function(maps) {
    //
    //});

}]);
