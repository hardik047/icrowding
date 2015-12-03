// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.directives', 'google.places'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)

      checkconnectivity();

    function checkconnectivity() {
        if (window.Connection) {
            if (navigator.connection.type == Connection.NONE) {
                navigator.notification.alert("This app requires internet connection. Please turn on data or connect to wifi and press okay.", function () {
                    checkconnectivity();
                }, 'No Internet connection!');
            }
        }
    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    $ionicPlatform.registerBackButtonAction(function () {
        return false;
    }, 100);

  });
})




.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.views.swipeBackEnabled(false);
    $ionicConfigProvider.tabs.position("bottom");
    $ionicConfigProvider.tabs.style("standard");

    $stateProvider

  .state('app', {
      url: "/app",
      cache: false,
    abstract: true,
    templateUrl: "templates/home.html",
    controller: 'AppCtrl'
  })

  .state('notloggedin', {
      url: "/notloggedin",
      abstract: true,
      templateUrl: "templates/notloggedin.html",
      controller: 'notloggedinCtrl'
  })

  .state('app.create-event', {
      url: "/create-event",
      cache: false,
    views: {
      'menuContent': {
          templateUrl: "templates/create-event.html",
          controller: 'EventCtrl'
      }
    }
  })
  
   .state('app.notifications', {
       url: "/notifications",
       cache: false,
    views: {
      'menuContent': {
          templateUrl: "templates/notifications.html",
          controller: "notificationsCtrl"
      }
    }
  })
  
   .state('app.logout', {
    url: "/logout",
    views: {
      'logout': {
          templateUrl: "templates/logout.html",
          controller: "LogoutCtrl"
      }
    }
  })
  
   .state('app.search', {
       url: "/search",
       cache: false,
    views: {
      'menuContent': {
          templateUrl: "templates/search.html",
          controller: "SearchCtrl"
      }
    }
  })
  
  		

  .state('app.location', {
      url: "/location",
      cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/location.html",
        controller: "MapCtrl"
      }
    }
  })
  
   .state('app.edit-profile', {
       url: "/edit-profile",
       cache: false,
    views: {
      'menuContent': {
          templateUrl: "templates/edit-profile.html",
          controller: "editprofileCtrl"
      }
    }
  })
  
  .state('app.profile', {
      url: "/profile",
      cache: false,
    views: {
      'menuContent': {
          templateUrl: "templates/profile.html",
          controller: "profileCtrl"
      }
    }
  })
  
  .state('app.just-now', {
    url: "/just-now",
    views: {
      'menuContent': {
        templateUrl: "templates/just-now.html",
        controller: "justnowCtrl"
      }
    }
  })
    .state('notloggedin.login', {
        url: "/login",
        cache: false,
      views: {
        'menuContent': {
          templateUrl: "templates/login.html",
          controller: 'loginCtrl'
        }
      }
    })
	
	 .state('notloggedin.forgot', {
	     url: "/forgot",
         cache: false,
      views: {
        'menuContent': {
          templateUrl: "templates/forgot.html",
         controller: "forgotCtrl"
        }
      }
    })
	
	.state('notloggedin.create', {
	    url: "/create",
        cache: false,
      views: {
        'menuContent': {
          templateUrl: "templates/create.html",
          controller: "CreateCtrl"
        }
      }
    })



	
	.state('app.event', {
	    url: "/event",
        cache: false,
      views: {
        'menuContent': {
          templateUrl: "templates/event.html",
          controller: "EventsCtrl"
        }
      }
    })
	
	.state('app.event-info', {
	    url: "/event-info",
        cache: false,
      views: {
        'menuContent': {
          templateUrl: "templates/event-info.html",
          controller: "EventinfoCtrl"
        }
      }
    })
	
    .state('app.friends-invite', {
        url: "/friends-invite",
        cache: false,
        views: {
            'menuContent': {
                templateUrl: "templates/friends-invite.html",
                controller: "InviteCtrl"
            }
        }
    })

    .state('app.uploadpic', {
        url: "/uploadpic",
        views: {
            'menuContent': {
                templateUrl: "templates/uploadPic.html",
                controller: "picuploadCtrl"
            }
        }
    })

    .state('app/participants', {
        url: '/participants',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: "templates/participants.html",
                controller: "participantsCtrl"
            }
        }
    })

    .state('notloggedin.validatephone', {
        url: '/validatephone',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: "templates/validatephone.html",
                controller: "validatephoneCtrl"
            }
        }
    })
	.state('app.friends', {
	    url: "/friends",
        cache: false,
      views: {
        'menuContent': {
            templateUrl: "templates/friends.html",
            controller: "friendsCtrl"
        }
      }
	})
    .state('app.change-password', {
        url: "/change-password",
        views: {
            'menuContent': {
                templateUrl: "templates/change-password.html",
                controller: "changepasswordCtrl"
            }
        }
    })
    .state('app.chats', {
        url: "/chats",
        cache: false,
        views: {
            'menuContent': {
                templateUrl: "templates/chats.html",
                controller: "chatsCtrl"
            }
        }
    })
    .state('app.friendrequests', {
        url: "/friendrequests",
        cache: false,
        views: {
            'menuContent': {
                templateUrl: "templates/friendrequests.html",
                controller: "friendrequestsCtrl"
            }
        }
    })
    .state('app.eventrequests', {
        url: "/eventrequests",
        cache: false,
        views: {
            'menuContent': {
                templateUrl: "templates/eventrequests.html",
                controller: "eventrequestsCtrl"
            }
        }
    });
  
  // if none of the above states are matched, use this as the fallback
    
  if (localStorage.getItem('username') == null && localStorage.getItem('password') == null)
  {
      $urlRouterProvider.otherwise('/notloggedin/login');
  }
  else if (localStorage.getItem('stayloggedin') == 'true')
  {
      $urlRouterProvider.otherwise('/app/location');
  }
  else
  {
      $urlRouterProvider.otherwise('/notloggedin/login');
  }

})
.factory('Datasharing', function () {
    datasharing = {};
    datasharing.passid = '';
    datasharing.passparam = '';
    datasharing.passparam2 = '';
    datasharing.profileid = '';
    datasharing.profileextra = '';
    return datasharing;
})
.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.views.swipeBackEnabled(false);
    $ionicConfigProvider.views.transition('none');
})













