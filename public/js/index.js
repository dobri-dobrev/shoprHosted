// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array or 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngTouch', 'ionic.contrib.ui.cards'])

.config(function($stateProvider, $urlRouterProvider) {

  // Set up the initial routes that our app will respond to.
  // These are then tied up to our nav router which animates and
  // updates a navigation bar
  $stateProvider
  .state('intro', {
    url: '/',
    templateUrl: 'templates/intro.html',
    controller: 'IntroCtrl'
  })
  .state('main', {
    url: '/main',
    templateUrl: 'templates/main.html',
    controller: 'MainCtrl'
  })
  ;

  // if none of the above routes are met, use this fallback
  // which executes the 'AppCtrl' controller (controllers.js)
  $urlRouterProvider.otherwise("/");

})

.directive('noScroll', function($document) {

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

      $document.on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  }
})

.service('sharedProperties', function () {
        var property = 'First';

        return {
            getProperty: function () {
                return property;
            },
            setProperty: function(value) {
                property = value;
            }
        };
    })

.controller('IntroCtrl', function($scope, $state, sharedProperties) {

    // Called to navigate to the main app
  $scope.startApp = function() {

        var firebaseRef = new Firebase("https://sizzling-fire-8834.firebaseio.com");
    var auth = new FirebaseSimpleLogin(firebaseRef, function(error, user) {
      if (error) {
        // an error occurred while attempting login
        alert(error);
      } else if (user) {
        // user authenticated with Firebase
       // alert('User ID: ' + user.id + ', Provider: ' + user.provider);
        console.log(user);
        sharedProperties.setProperty(user);
         $state.go('main');
        //window.location.href = '/#/main';
        // Log out so we can log in again with a different provider.
        auth.logout();
      } else {
        // user is logged out
      }
    });
   
      auth.login('facebook');
    

   


    // Set a flag that we finished the tutorial
    window.localStorage['didTutorial'] = true;
  };

  // Check if the user already did the tutorial and skip it if so
  if(window.localStorage['didTutorial'] === "true") {
    console.log('Skip intro');
    //startApp();
  }

  // Move to the next slide
  $scope.next = function() {
    $scope.$broadcast('slideBox.nextSlide');
  };

  // Our initial right buttons
  var rightButtons = [
    {
      type: 'button icon-right ion-chevron-right button-clear button-stable',
      tap: function(e) {
        // Go to the next slide on tap
        $scope.next();
      }
    }
  ];
  
  // Our initial left buttons
  var leftButtons = [
    {
      type: 'button icon-left ion-chevron-left button-clear button-stable',
      tap: function(e) {
        // Start the app on tap
        startApp();
      }
    }
  ];

  // Bind the left and right buttons to the scope
  $scope.leftButtons = leftButtons;
  $scope.rightButtons = rightButtons;


  // Called each time the slide changes
  $scope.slideChanged = function(index) {

    // Check if we should update the left buttons
    if(index > 0) {
      // If this is not the first slide, give it a back button
      $scope.leftButtons = [
        {
          type: 'button icon-left ion-chevron-left button-clear button-stable',
          tap: function(e) {
            // Move to the previous slide
            $scope.$broadcast('slideBox.prevSlide');
          }
        }
      ];
    } else {
      // This is the first slide, use the default left buttons
      $scope.leftButtons = leftButtons;
    }
    
    // If this is the last slide, set the right button to
    // move to the app
    if(index == 2) {
      $scope.rightButtons = [
        {
          type: 'button icon-right ion-chevron-right button-clear button-stable',
          tap: function(e) {
            $scope.startApp();
          }
        }
      ];
    } else {
      // Otherwise, use the default buttons
      $scope.rightButtons = rightButtons;
    }
  };
})

.controller('MainCtrl', function($scope) {
  console.log('MainCtrl');
})

.controller('CardsCtrl', function($scope, $ionicSwipeCardDelegate, sharedProperties) {

  $scope.username = sharedProperties.getProperty();

  Parse.initialize("hsF1YqRFuQ0rTousJrmzKLLcvEQNTfwXPwdvd7Kr", "4YkXyjLFJaY0bCGD6NlCKS8ObAe8YXmL1jdVtJyX");

  $scope.cardTypes = [];
  $scope.cardViewed = [];

  $scope.getLad = function(){

    Parse.Cloud.run('ladGiver', {user: $scope.username.id}, {
    success: function(result) {
      $scope.cardTypes = result;
    },
    error: function(error) {
    }
    });
  };

  $scope.getLad();

  // var cardTypes = [
  //   { title: 'Swipe down to clear the card', image: 'img/pic.png' },
  //   { title: 'Where is this?', image: 'img/pic.png' },
  //   { title: 'What kind of grass is this?', image: 'img/pic2.png' },
  //   { title: 'What beach is this?', image: 'img/pic3.png' },
  //   { title: 'What kind of clouds are these?', image: 'img/pic4.png' }
  // ];
  $scope.cards = Array.prototype.slice.call($scope.cardTypes, 0, 0);

  $scope.cardSwiped = function(index) {
    $scope.addCard();
  };

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
  };

  $scope.uniqueLad = function(a) {
    var temp = {};
    for (var i = 0; i < a.length; i++)
        temp[a[i]] = true;
    var r = [];
    for (var k in temp)
        r.push(k);
    return r;
  };

  $scope.addCard = function() {

    console.log($scope.cardViewed);
    if ($scope.cardTypes.length != 0)
    {
    var newCard = $scope.cardTypes.pop();
    $scope.cardViewed.push(newCard.objId);
    }
    else
    {
      console.log("im here");
      Parse.Cloud.run('ladUpdater', {user: $scope.username.id, viewed: $scope.uniqueLad($scope.cardViewed) }, {
      success: function(result) {
        $scope.cardViewed = [];
        $scope.getLad();
      },
      error: function(error) {
      }
      });
    }
   //  $scope.cardViewed = [];
    // var newCard = cardTypes[$scope.counter];
    // console.log(cardTypes.length);
    // $scope.cardViewed.push(newCard.objId);
    // //console.log($scope.uniqueLad($scope.cardViewed));
    // $scope.counter++;
    // $scope.viewed++;
    // if ($scope.counter == cardTypes.length)
    // {
    //   $scope.counter = 0;
    // }

    // if ($scope.viewed == 5)
    // {
    // Parse.Cloud.run('ladUpdater', {user: $scope.username.id, viewed: $scope.uniqueLad($scope.cardViewed) }, {
    // success: function(result) {
    // },
    // error: function(error) {
    // }
    // });
    // $scope.viewed = 0;
    // }
   // var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
   // newCard.id = Math.random();
    $scope.cards.push(angular.extend({}, newCard));
  }
})

.controller('CardCtrl', function($scope, $ionicSwipeCardDelegate) {
  $scope.goAway = function() {
    var card = $ionicSwipeCardDelegate.getSwipebleCard($scope);
    card.swipe();
  };
});


