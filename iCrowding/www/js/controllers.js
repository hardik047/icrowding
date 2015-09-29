

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
 //change-password Pop-Up

  $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  }); 
  $ionicModal.fromTemplateUrl('templates/change-password.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.change = modal;
  });
  

})


//Google Map
.controller('MapCtrl', function ($scope, $ionicLoading) {

  $scope.mapCreated = function(map) {
    $scope.map = map;
  };

  $scope.centerOnMe = function () {
    console.log("Centering");
    if (!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });
	
    navigator.geolocation.getCurrentPosition(function (pos) {
      console.log('Got pos', pos);
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $scope.loading.hide();
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };
})

.controller('loginCtrl', function($scope, $http) {
    
	$(".left-buttons #menu-button, a.notifications-bell, #footer-tab").fadeOut(); 
	$scope.class="hide";
    $scope.data = {};

    $scope.login = function () {

        $http.post('http://www.icreax.in/icrowding_server/logger.php', { username: $scope.data.username, password: $scope.data.password })
        .success(function (response) {

            if (response == "failure")
            {
                alert('Could not login! Check your credentials !');
            }
            else if(response == "nodata")
            {
                alert('Please fill all the required fields!');
            }
            else if(response.email.toLowerCase() == $scope.data.username.toLowerCase() && response.password == $scope.data.password)
            {
                localStorage.setItem('userid', response.id);
                localStorage.setItem('username', response.email);
                localStorage.setItem('stayloggedin', $scope.data.loggedinflag);
                if($scope.data.loggedinflag == 1)
                    localStorage.setItem('password', response.password);
                window.location.href = '#/app/location';
                $(".left-buttons #menu-button, a.notifications-bell, #footer-tab").fadeIn();
            }
            else
            {
                alert('Wrong username/password combination!');
            }

        });

    }
})

.controller('notloggedinCtrl', function ($scope) {

})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('EventsCtrl', function ($scope, $http, Datasharing) {

    $http.post('http://www.icreax.in/icrowding_server/listevents.php', {userid: localStorage.getItem('username')})
    .success(function (response) {
        $scope.events = response;
    });

    $scope.data = {}
    $scope.passingparams = Datasharing;

    $scope.gotoEvent = function (eventid) {
        $scope.passingparams.passid = eventid;
        window.location.href = "#/app/event-info";
    }

})

.controller('EventinfoCtrl', function ($scope, $http, Datasharing) {

    $scope.passingparams = Datasharing;

    $http.post('http://www.icreax.in/icrowding_server/geteventinfo.php', { eventid: $scope.passingparams.passid })
    .success(function (response) {
        $scope.eventinfo = response;
        if (response[0].host == localStorage.getItem('userid')) {
            $('#delbutton').css('display', 'block');
        }
    });

    $scope.joinevent = function (eventid) {

    }

    $scope.invitefriends = function (eventid) {

        $scope.passingparams.passid = eventid;
        window.location.href = '#/app/friends-invite';

    }

})

.controller('EventCtrl', function ($scope, $http) {

    var d = new Date();
    var todate = new Date(d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate());
    var totime = new Date(d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds());

    $scope.model = {
    };

    $scope.createEvent = function () {

        var lat = 0.000000;
        var lng = 0.000000;
        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({ 'address': 'thaltej, ahmedabad' }, function (result, status) {
            if(status == google.maps.GeocoderStatus.OK)
            {
                lat = result[0].geometry.location.lat;
                lng = result[0].geometry.location.lng;

                $http.post('http://icreax.in/icrowding_server/createevent.php',
                    { eventname: $scope.model.eventname, eventdate: new Date($scope.model.eventdate), eventtime: new Date($scope.model.time2), eventlocation: $scope.model.location, keywords: $scope.model.keywords, lat: lat, lng: lng })
                .success(function (response) {
                    if (response == 'success') {
                        //navigator.notification.alert('Your event is Created!', function () {

                        //}, 'Thanks!');
                        alert('Party is On !');
                    }
                    else {
                        //navigator.notification.alert(response, function () {

                        //}, 'Sorry!');
                        alert('Sorry, Try again!');
                    }
                })
            }
            else
            {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });

    }

})

.controller('CreateCtrl', function ($scope, $http) {
	$(".left-buttons #menu-button, a.notifications-bell, #footer-tab").fadeOut(); 

    $scope.data = {};

    $scope.signup = function () {

        if ($scope.data.password != $scope.data.confirmpassword)
        {
            navigator.notification.alert("Your passwords don't match! Please enter and confirm again!", function () { }, 'Attention!');
            $("pswd").attr('value', '');
            $("cpswd").attr('value', '');
            return false;
        }

        if ($scope.data.password == '') {
            navigator.notification.alert('Please enter a password!', function () { }, 'Attention!');
            return false;
        }

        if ($scope.data.email == '') {
            navigator.notification.alert('Please enter your correct email!', function () { }, 'Attention!');
            return false;
        }

        if ($scope.data.fname == '') {
            navigator.notification.alert('Please enter your first name!', function () { }, 'Attention!');
            return false;
        }

        if ($scope.data.age == '') {
            navigator.notification.alert('Please enter your age!', function () { }, 'Attention!');
            return false;
        }

        if ($scope.data.age < 16) {
            navigator.notification.alert('We are sorry but you are not eligible to use this app!', function () { }, 'Sorry!');
            return false;
        }

        $http.post('http://www.icreax.in/icrowding_server/register.php', { fname: $scope.data.fname, lname: $scope.data.lname, email: $scope.data.email, password: $scope.data.password, gender: $scope.data.gender, height: $scope.data.height, weight: $scope.data.weight, age: $scope.data.age, sexuality: $scope.data.sexuality, occupation: $scope.data.occupation, seeking: $scope.data.seeking })
        .success(function (response) {

            if(response == 'success')
            {
                navigator.notification.alert('You have successfully signed up! Login to continue..', function () {
                    window.location.href = "#/notloggedin/login";
                }, 'Welcome!');
            }
            else
            {
                navigator.notification.alert(response, function () {
                }, 'Sorry!');
            }

        });

    }

})
.controller('InviteCtrl', function ($scope, $http, Datasharing) {

    $scope.passingparams = Datasharing;

    $http.post("http://www.icreax.in/icrowding_server/getfriends.php", { userid: localStorage.getItem('username'), eventid: $scope.passingparams.passid })
    .success(function (response) {
        $scope.friends = response;
    });

    $scope.invite = function () {
        
        $http.post('http://www.icreax.in/icrowding_server/invitefriends.php', { eventid: $scope.passingparams.passid, friendslist: $scope.data.invited })
        .success(function (response) {
            if(response == 'success')
            {
                navigator.notification.alert('Your friends have been invited!', function () {
                    window.location.href = "#/app/event";
                }, 'Done!');
            }
        });

    }
})
.controller('LogoutCtrl', function ($scope) {
    $scope.confirmlogout = function () {
        localStorage.removeItem('username');
        localStorage.removeItem('password');

        window.location.href = "#/notloggedin/login";
    }
})
.controller('SearchCtrl', function ($scope, $http, Datasharing) {

    $scope.data = {}
    $scope.passingparams = Datasharing;
    $scope.searchnow = function () {

        if ($scope.data.targettype == undefined)
        {
            navigator.notification.alert('Please select either Event or People to search!', function () {

            }, 'Attention!');
        }
        else
        {
            $http.post('http://www.icreax.in/icrowding_server/getresults.php', {keyword: $scope.data.keyword, targettype: $scope.data.targettype, username: localStorage.getItem('username')})
        .success(function (response) {

            if (response == 'notfound')
            {
                if ($scope.data.targettype == 'E')
                {
                    navigator.notification.alert('No matching Event found!', function () { }, 'Oops!');
                }
                else if($scope.data.targettype == 'P')
                {
                    navigator.notification.alert('No matching User found!', function () { }, 'Oops!');
                }
            }
            else
            {
                $scope.results = response;
            }
     
        })
        }
        
    }

    $scope.gotoEvent = function (eventid) {
        $scope.passingparams.passid = eventid;
        window.location.href = "#/app/event-info";
    }

    $scope.viewProfile = function (userid) {
        $scope.passingparams.passid = userid;
        window.location.href = "#/app/profile";
    }
 
    $scope.joinevent = function (eventid) {
        $http.post('http://www.icreax.in/icrowding_server/addtoEvent.php', { eventid: eventid, userid: localStorage.getItem('username') })
        .success(function (response) {
            if(response == 'success')
            {
                navigator.notification.alert('Event is in your List!', function () {

                }, 'Done');
            }
            else
            {
                navigator.notification.alert('Something went wrong! Try again!', function () {

                }, 'Sorry');
            }
        })
    }

    $scope.addfriend = function (userid) {
        $http.post('http://www.icreax.in/icrowding_server/addfriend.php', { friendid: userid,senderid: localStorage.getItem('username') })
        .success(function (response) {
            if(response == 'success')
            {
                navigator.notification.alert('Friend request has been sent!', function () {

                }, 'Done');
            }
            else
            {
                navigator.notification.alert('Something Went wrong! Please try again.', function () {

                }, 'Sorry');
            }
        })
    }

})
.controller('forgotCtrl', function ($scope, $http) {

    $scope.data = {}

    $scope.sendpassword = function () {
        $http.post('http://www.icreax.in/icrowding_server/sendpassword.php', { uemail: $scope.data.uemail })
        .success(function (response) {
            if(response == 'success')
            {
                alert('Your password has been mailed to you. Please check your mailbox!');
            }
            else if(response == 'unknown')
            {
                alert('This email address is not known to iCrowding!');
            }
            else
            {
                alert('Something went wrong! Please try again in few minutes!');
            }
        })
    }

})

.controller('friendsCtrl', function ($scope, $http) {

    $http.post('http://www.icreax.in/icrowding_server/listfriends..php', { userid: localStorage.getItem('username') })
    .success(function (response) {
        $scope.friends = response;
    })

})







