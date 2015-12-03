angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, $ionicActionSheet, Datasharing) {
  
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
  
    //change-password Pop-Up
    $scope.hidestatus = 'display: flex;';
    $scope.notificationstatus = '';

    $scope.notifications = function() {
        window.location.href = "#/app/notifications";
    }

    $http.post('http://www.icreax.in/icrowding_server/getnotifications.php', { userid: localStorage.getItem('username') })
    .success(function (response) {

        if (response == 'nodata') {
            $scope.notificationstatus = "display: none";
        }
        else
        {
            $scope.notificationstatus = "display: block";
            $scope.data.notificationcount = response.length;
        }
        
    });

    $scope.showActionsheet = function() {
    
        $ionicActionSheet.show({
        titleText: 'Options',
        buttons: [
            { text: '<i class="icon ion-ios-compose-outline"></i> Create new event' },
            { text: '<i class="icon ion-ios-search-strong"></i> Search' },
            { text: '<i class="icon ion-edit"></i> Edit profile' },
            { text: '<i class="icon ion-ios-star"></i> Featured events' }
        ],
        destructiveText: '<i class="icon ion-log-out"></i> Logout',
        cancelText: 'Cancel',
        cancel: function() {
            console.log('CANCELLED');
        },
        buttonClicked: function(index) {
            
            if(index == 0)
            {
                window.location.href = "#/app/create-event";
            }
            if(index == 1)
            {
                window.location.href = "#/app/search";
            }
            if(index == 2)
            {
                window.location.href = "#/app/edit-profile";
            }
            if(index == 3)
            {
                window.location.href = "#/app/just-now";
            }
            
            return true;
        },
        destructiveButtonClicked: function() {
            logout();
            return true;
        }
        });
    };

    $scope.data = {}
    $scope.data.myname = localStorage.getItem('name');
    $('#mypic').attr('src', '#');
    $('#mypic').attr('src', 'http://www.icreax.in/icrowding_server/images/users/' + localStorage.getItem('username') + '.jpg');
    $scope.passingparams = Datasharing;

    function logout () {
        navigator.notification.confirm('Are you sure you want to logout?', function (index) {
            
            if(index === 1)
            {
                localStorage.removeItem('username');
                localStorage.removeItem('password');
                window.location.href = "#/notloggedin/login";
            }
            
        }, 'Logout', 'Yes, No');
    }

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
  
    $scope.changepic = function () {
        $scope.passingparams.passparam2 = "#/app/location";
        window.location.href = "#/app/uploadpic"
    }

})


//Google Map
.controller('MapCtrl', function ($scope, $ionicLoading, $ionicNavBarDelegate, $http, Datasharing) {

    $ionicNavBarDelegate.title("Home");
    $ionicNavBarDelegate.showBackButton(false);
    
    $scope.passingparams = Datasharing;

    $scope.mapCreated = function(map) {
        $scope.map = map;
        $scope.centerOnMe();
    };

     $scope.gotoEvent = function(eventid) {
                    
        $scope.passingparams.passid = eventid;
        window.location.href = "#/app/event-info";
        
    }

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

            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            $ionicLoading.hide();
            var latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            var markerinfowindowself = new google.maps.InfoWindow();
            var marker = new google.maps.Marker({
                position: latLng,
                title: 'Your Location',
                visible: true,
                icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            });

            marker.setMap($scope.map);
            markerinfowindowself.setContent('You are here.');
            markerinfowindowself.open($scope.map, marker);
            
            setTimeout(function() {
                markerinfowindowself.close();
            }, 10000);
            
            $http.post('http://www.icreax.in/icrowding_server/getlocations.php?'+ new Date().getTime(), { position: pos, userid: localStorage.getItem('userid') })
          .success(function (response) {
              
              var markerlocations = response[0];

              var markerinfowindow = new google.maps.InfoWindow();
              var directionsService = new google.maps.DirectionsService();
              var directionsDisplay = new google.maps.DirectionsRenderer();

              for (var i = 0; i < markerlocations.length; i++) {

                  var currloc = new google.maps.LatLng((markerlocations[i]).lat, (markerlocations[i]).lng);

                  if(markerlocations[i].shared == 1)
                  {
                      marker = new google.maps.Marker({
                      position: currloc,
                      icon: 'img/star-3.png',
                      eventid: (markerlocations[i]).id,
                      title: (markerlocations[i]).fname,
                      eventplace: (markerlocations[i]).location,
                      eventtime: (markerlocations[i]).time.toString(),
                      eventdate: (markerlocations[i]).date.toString(),
                      participants: (markerlocations[i]).participants,
                      host: (markerlocations[i].host),
                      visible: true
                    });
                  }
                  else
                  {
                      marker = new google.maps.Marker({
                      position: currloc,
                      eventid: (markerlocations[i]).id,
                      title: (markerlocations[i]).fname,
                      eventplace: (markerlocations[i]).location,
                      eventtime: (markerlocations[i]).time.toString(),
                      eventdate: (markerlocations[i]).date.toString(),
                      participants: (markerlocations[i]).participants,
                      host: (markerlocations[i].host),
                      visible: true
                    });
                  }
                  
                  marker.setMap($scope.map);

                  marker.addListener('mousedown', function () {
                      
                      var content = '<div id="iw-container" style="font-size: medium;">' + 
                      
                    '<div class="iw-title" ng-click="gotoEvent(' + this.eventid + ')">' + this.title + '</div>' +
                    '<div class="iw-content">' +
                    '<img src="http://www.icreax.in/icrowding_server/images/events/' + this.title + '_' + this.host + '.jpg" alt="" style="margin-left: auto; margin-right: auto; width: 100%; max-height: 100px; max-width: 100px;">' +
                    '<h5><i class="ion-ios-calendar-outline" style="border-right: 1px solid #000; margin-right: 5px; padding-right: 5px;"></i>' + this.eventdate + '</h5>' +
                    '<h5><i class="ion-ios-clock-outline" style="border-right: 1px solid #000; margin-right: 5px; padding-right: 5px;"></i>' + this.eventtime + '</h5>' +
                    '<span style="font-size: 1em;">' + this.eventplace + '</span>' +
                    '<h5><i class="ion-ios-people-outline" style="border-right: 1px solid #000; margin-right: 5px; padding-right: 5px;"></i>' + this.participants + ' are going.</h5>' +
                    '<button class="button button-small button-cyan" ng-click="gotoEvent(' + this.eventid + ')">More</button>' +
                    '</div>' +
                    '</div>';
                      
                      markerinfowindow.setContent(content);
                      markerinfowindow.open($scope.map, this);

                      var request = {
                          origin: latLng,
                          destination: this.getPosition(),
                          travelMode: google.maps.DirectionsTravelMode.DRIVING
                      };

                      directionsDisplay.setMap($scope.map);
                      directionsService.route(request, function (response, status) {
                          if (status === google.maps.DirectionsStatus.OK) {
                              directionsDisplay.setDirections(response);
                          }
                      });

                  });

              }
              
          });

        }, function (error) {
            $ionicLoading.hide();
            navigator.notification.alert('Unable to fetch location! Turn location service on!', function () {

            }, 'Location services disabled');
        }, { timeout: 5000 });
    }
})
.controller('conversationCtrl', function ($scope, $http, $ionicLoading, $ionicNavBarDelegate) {
    
    $ionicNavBarDelegate.showBackButton(true);
    
    $scope.loading = $ionicLoading.show({
            content: 'Loading conversations...',
            showBackdrop: false
        });
    
    $http.post('http://www.icreax.in/icrowding_server/getconversations.php', {userid: localStorage.getItem('userid')})
    .success(function(response) {
        
        $ionicLoading.hide();
        $scope.conversations = response;
        
    })
    .error(function() {
        $ionicLoading.hide();
    });
    
    $scope.gotoChat = function(id) {
        localStorage.setItem('receiverid',id);
        window.location.href = "#/app/chats";
    }
    
})
.controller('resendcodeCtrl', function($scope, $http, $ionicLoading, $ionicNavBarDelegate, Datasharing) {
    
    $ionicNavBarDelegate.showBackButton(false);
    $scope.data = {}
    $scope.passingparams = Datasharing;
    
    $http.post('http://www.icreax.in/icrowding_server/getnumber.php', {userid: $scope.passingparams.passemail})
    .success(function(response) {
        $scope.data.number = response;
    })
    
    $scope.resendcode = function() {
        $http.post('http://www.icreax.in/icrowding_server/resendcode.php', {uemail: $scope.passingparams.passemail, uphone: $scope.data.number})
        .success(function(response) {
            
            if(response == 'success')
            {
                window.location.href = '#/notloggedin/validatephone';
            }
            else
            {
                navigator.notification.alert('We could not send verification code on this number. Please try again or enter a different number.', function() {
                    
                }, 'Sorry');
            }
            
        })
    }
    
})
.controller('validatephoneCtrl', function ($scope, $http, $ionicLoading, $ionicNavBarDelegate, Datasharing) {

    $ionicNavBarDelegate.showBackButton(false);
    $scope.data = {}
    $scope.passingparams = Datasharing;

    $scope.loading = $ionicLoading.show({
        content: 'Validating...',
        showBackdrop: false
    });

    $http.post('http://www.icreax.in/icrowding_server/validatephone.php', { userid: $scope.passingparams.passemail })
    .success(function (response) {

        $ionicLoading.hide();

        if (response == 'success') {
            navigator.notification.alert('A text message has been sent to your number. Please enter the code you received.', function () {

            }, 'Verify your identity!');
        }
        else {
            navigator.notification.alert('Something went wrong! Getting you out of here.', function () {

                window.location.href = "#/notloggedin/login";

            }, 'Woah!');
        }
    })
    .error(function (error) {

        $ionicLoading.hide();
        navigator.notification.alert('We could not send sms to your number. Please mail us with your username to manually activate your account. support@icrowding.com', function () {

            window.location.href = "#/notloggedin/login";

        }, 'Woah!');

    });

    $scope.validatephone = function () {
        $http.post('http://icreax.in/icrowding_server/validate.php', { userid: $scope.passingparams.passid, ucode: $scope.data.vcode })
        .success(function (response) {
            if(response == 'success')
            {
                navigator.notification.alert('Your phone number has been successfully verified! Login to get started', function () {
                    window.location.href = $scope.passingparams.passparam;
                }, 'Great!');
            }
            else
            {
                navigator.notification.alert('Could not verify number. Please enter the code again!', function () {
                    $scope.data.vcode = '';
                }, 'Sorry!');
            }
        });
    }

})

.controller('loginCtrl', function($scope, $http, $ionicLoading, ionicMaterialInk, Datasharing) {
     
    $scope.class="hide";
    $scope.data = {};
    $scope.passingparams = Datasharing;

    ionicMaterialInk.displayEffect();

    $scope.login = function () {

        $scope.loading = $ionicLoading.show({
            content: 'Logging in...',
            showBackdrop: false
        });

        $http.post('http://www.icreax.in/icrowding_server/logger.php', { username: $scope.data.username, password: $scope.data.password })
        .success(function (response) {
            $ionicLoading.hide();
            if (response == "failure")
            {
                navigator.notification.alert('Could not login! Check your credentials !', function () {

                },'Sorry');
            }
            else if(response == "nodata")
            {
                navigator.notification.alert('Please fill all the required fields!', function () {

                },'Watch it');
            }
            else if(response.email.toLowerCase() == $scope.data.username.toLowerCase() && response.password == $scope.data.password)
            {
                localStorage.setItem('userid', response.id);
                localStorage.setItem('username', response.email);
                localStorage.setItem('name', response.fname);
                localStorage.setItem('stayloggedin', $scope.data.loggedinflag);
                if($scope.data.loggedinflag == 1)
                    localStorage.setItem('password', response.password);

                if (response.status == 0) {
                    $scope.passingparams.passid = localStorage.getItem('username');
                    $scope.passingparams.passparam = "#/app/location";
                    window.location.href = "#/notloggedin/validatephone";
                }
                else
                    window.location.href = '#/app/location';
            }
            else
            {
                alert('Wrong username/password combination!');
            }

        })
        .error(function() {
            $ionicLoading.hide();
        });

    }
})

.controller('notloggedinCtrl', function ($scope) {

})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('EventsCtrl', function ($scope, $http, $ionicLoading, $ionicNavBarDelegate, Datasharing) {

    $ionicNavBarDelegate.title("Events");
    $ionicNavBarDelegate.showBackButton(true);

    $scope.loading = $ionicLoading.show({
        content: 'Getting events...',
        showBackdrop: false
    });

    $http.post('http://www.icreax.in/icrowding_server/listevents.php', {userid: localStorage.getItem('username')})
    .success(function (response) {
        $ionicLoading.hide();
        $scope.events = response;
    })
    .error(function() {
        $ionicLoading.hide();
    });

    $scope.data = {}
    $scope.passingparams = Datasharing;

    $scope.gotoEvent = function (eventid) {
        $scope.passingparams.passid = eventid;
        window.location.href = "#/app/event-info";
    }

})

.controller('EventinfoCtrl', function ($scope, $http, $ionicLoading, $ionicNavBarDelegate, Datasharing) {

    $ionicNavBarDelegate.showBackButton(true);

    $scope.passingparams = Datasharing;
    $scope.adminbuttonshowstatus = "";
    $scope.visitorbuttonshowstatus = "";
    $scope.requeststatus = "display: none;";
    $scope.data = {}

    $scope.loading = $ionicLoading.show({
        content: 'Getting event info...',
        showBackdrop: false
    });

    $http.post('http://www.icreax.in/icrowding_server/geteventinfo.php', { eventid: $scope.passingparams.passid, userid: parseInt(localStorage.getItem('userid')) })
    .success(function (response) {
        $ionicLoading.hide();
        var justeventinfo = Array();
        justeventinfo[0] = response[0];
        
        justeventinfo[0].date = justeventinfo[0].date.toString();
        justeventinfo[0].keywords = (justeventinfo[0].keywords).split(',');
        
        $scope.eventinfo = justeventinfo;
        if (response[0].host == localStorage.getItem('userid')) {
            $scope.visitorbuttonshowstatus = "display: none;";
            $scope.adminbuttonshowstatus = "display: block";
        }
        else
        {
            if (response[1] == "member")
            {
                $scope.visitorbuttonshowstatus = "display: none;";
                $scope.adminbuttonshowstatus = "display: none";
            }
            else if(response[1] == "pending")
            {
                $scope.visitorbuttonshowstatus = "display: none;";
                $scope.requeststatus = "display: block";
                $scope.adminbuttonshowstatus = "display: none";
            }
            else
            {
                $scope.visitorbuttonshowstatus = "display: block;";
                $scope.adminbuttonshowstatus = "display: none";
            }
            
        }
    })
    .error(function() {
        $ionicLoading.hide();
    });

    $http.post('http://www.icreax.in/icrowding_server/getmessage.php', { eventid: $scope.passingparams.passid })
    .success(function (response) {

        if (response == 'nodata') {

        }
        else {
            $scope.chats = response;
        }

    });

    $scope.showparticipants = function (id) {
        
        $scope.passingparams.passid = id;
        window.location.href = "#/app/participants";
    }

    $scope.submitComment = function () {

        $http.post("http://www.icreax.in/icrowding_server/sendmessage.php", { senderid: localStorage.getItem('userid'), eventid: $scope.passingparams.passid, senderemail: localStorage.getItem('username'), content: $scope.data.comment })
        .success(function (response) {
            if (response == 'success') {
                
                $scope.data.comment = '';
                
                $http.post('http://www.icreax.in/icrowding_server/getmessage.php', { eventid: $scope.passingparams.passid })
                .success(function (response) {

                    if (response == 'nodata') {

                    }
                    else {
                        $scope.chats = response;
                    }

                });
            }
        });
    }

    $scope.joinevent = function (eventid) {

        $scope.loading = $ionicLoading.show({
            content: 'Submitting request...',
            showBackdrop: false
        });

        $http.post('http://www.icreax.in/icrowding_server/asktojoin.php', { userid: localStorage.getItem('userid'), eventid: eventid })
        .success(function (response) {

            $ionicLoading.hide();
            if(response == 'success')
            {
                navigator.notification.alert('Your request has been sent to event admin.', function () {

                }, 'Done');
            }
            else
            {
                navigator.notification.alert('Something went wrong. Please try again!', function () {

                }, 'Sorry');
            }
        })
        .error(function() {
            $ionicLoading.hide();
        });

    }

    $scope.deleteevent = function (eventid) {

        $http.post('http://www.icreax.in/icrowding_server/deleteevent.php', { eventid: eventid, userid: localStorage.getItem('userid') })
        .success(function (response) {
            if(response == 'success')
            {
                navigator.notification.alert('Your event has been deleted.', function () {
                    window.location.href = '#/app/location';
                }, 'Done');
            }
            else
            {
                navigator.notification.alert('Something went wrong. Please try again!', function () {

                }, 'Sorry');
            }
        })

    }

    $scope.invitefriends = function (eventid) {

        $scope.passingparams.passid = eventid;
        window.location.href = '#/app/friends-invite';

    }

})

.controller('EventCtrl', function ($scope, $http, $ionicNavBarDelegate, $ionicLoading, Datasharing) {

    $ionicNavBarDelegate.showBackButton(true);

    $scope.passingparams = Datasharing;
    var d = new Date();
    var todate = new Date(d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate());
    var totime = new Date(d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds());

    $scope.model = {
    };

    $scope.createEvent = function () {

        $scope.loading = $ionicLoading.show({
            content: 'Submitting request...',
            showBackdrop: false
        });

        var lat = $scope.model.location.geometry.location.lat();
        var lng = $scope.model.location.geometry.location.lng();

        var finaltime = $scope.model.time2.toLocaleTimeString();
        //var hours = Number(time.match(/^(\d+)/)[1]);
        //var minutes = Number(time.match(/:(\d+)/)[1]);
        //var AMPM = time.match(/\s(.*)$/)[1];
        //if (AMPM == "PM" && hours < 12) hours = hours + 12;
        //if (AMPM == "AM" && hours == 12) hours = hours - 12;
        //var sHours = hours.toString();
        //var sMinutes = minutes.toString();
        //if (hours < 10) sHours = "0" + sHours;
        //if (minutes < 10) sMinutes = "0" + sMinutes;

        //var finaltime = sHours + ":" + sMinutes;

        $http.post('http://www.icreax.in/icrowding_server/createevent.php', { eventhost: localStorage.getItem('userid'), eventname: $scope.model.eventname, eventdate: new Date($scope.model.eventdate), eventtime: finaltime, eventlocation: $scope.model.location.formatted_address,lat: lat, lng: lng })
        .success(function (response) {
            
            $ionicLoading.hide();
            
            if (response == 'success') {
          
                    $scope.passingparams.passparam2 = $scope.model.eventname;
                    window.location.href = '#/notloggedin/create-event2';
               
                
            }
            else {
                navigator.notification.alert('Something went wrong. Try again!', function () {

                }, 'Sorry!');
            }
        })

        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({ 'address': $scope.model.location }, function (result, status) {
            if(status == google.maps.GeocoderStatus.OK)
            {
                lat = result[0].geometry.location.H;
                lng = result[0].geometry.location.L;
            }
            else
            {
                navigator.notification.alert('Geolocation was not successful! Turn on your location and try again!', function () {

                }, 'Sorry');
            }
        });

    }

})

.controller('CreateCtrl', function ($scope, $http, $ionicLoading, $ionicNavBarDelegate, Datasharing) {

    $ionicNavBarDelegate.showBackButton(true);
    $scope.data = {};
    $scope.passingparams = Datasharing;

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

        if ($scope.data.phone == '') {
            navigator.notification.alert('Please enter Contact number!', function () { }, 'Attention!');
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

        if ($scope.data.age == '' || $scope.data.age > 99) {
            navigator.notification.alert('Please enter valid age!', function () { }, 'Attention!');
            return false;
        }

        if ($scope.data.age < 6) {
            navigator.notification.alert('We are sorry but you are not eligible to use this app!', function () { }, 'Sorry!');
            return false;
        }

        $scope.loading = $ionicLoading.show({
            content: 'Signing up...',
            showBackdrop: false
        });

        $http.post('http://www.icreax.in/icrowding_server/register.php', { fname: $scope.data.fname, phone: $scope.data.phone, email: $scope.data.email, password: $scope.data.password, gender: $scope.data.gender, height: $scope.data.height, weight: $scope.data.weight, age: $scope.data.age, sexuality: $scope.data.sexuality, occupation: $scope.data.occupation })
        .success(function (response) {
            $ionicLoading.hide();
            if(response == 'success')
            {
                $scope.passingparams.passemail = $scope.data.email;
                window.location.href = "#/notloggedin/create2";
            }
            else
            {
                navigator.notification.alert(response, function () {
                }, 'Sorry!');
            }

        })
        .error(function() {
            $ionicLoading.hide();
        });

    }

})
.controller('create2Ctrl', function($scope, $http, $ionicLoading, Datasharing) {
    
    $scope.passingparams = Datasharing;
    $scope.data = {};
    $scope.suggestions = [];
    $scope.selectedTags = [];
    $scope.selectedIndex = -1;
    
    $scope.search = function () {
        $http.post('http://www.icreax.in/icrowding_server/bringtags.php', {keyword:$scope.data.searchText }).success(function (data) {
            
            $scope.suggestions = data;
            
            if($scope.suggestions.length < 1 && $('#searchInput').val() == '')
            {
                $('#suggestions').css('display','none');
            }
            else
            {
                $('#suggestions').css('display','block');
            }
            
            $scope.selectedIndex = -1;
        });
    }

    $scope.removeTag = function (index) {
        $scope.selectedTags.splice(index, 1);
        if($scope.selectedTags.length <= 5 && $('#searchInput').attr('disabled'))
        {
            $('#searchInput').removeAttr('disabled');
        }
    }

    $scope.checkKeyDown = function (event) {
        if (event.keyCode === 40) {//down key, increment selectedIndex
            event.preventDefault();
            if ($scope.selectedIndex + 1 !== $scope.suggestions.length) {
                $scope.selectedIndex++;
            }
        }
        else if (event.keyCode === 38) { //up key, decrement selectedIndex
            event.preventDefault();
            if ($scope.selectedIndex - 1 !== -1) {
                $scope.selectedIndex--;
            }
        }
        else if (event.keyCode === 13) { //enter pressed
            $scope.addToSelectedTags($scope.selectedIndex);
        }
    }

    $scope.addToSelectedTags = function (index) {

        if (index == -2)
        {
            $scope.selectedTags.push($scope.data.searchText);
            $scope.data.searchText = '';
            $scope.suggestions = [];
        }
        if ($scope.selectedTags.indexOf($scope.suggestions[index]) === -1) {

            if ($scope.suggestions[index] != undefined)
            {
                $scope.selectedTags.push($scope.suggestions[index]);
                $scope.data.searchText = '';
                $('#searchInput').focus();
                $scope.suggestions = [];
            }
        }
        
        if($scope.selectedTags.length >= 5)
        {
            $('#searchInput').attr('disabled', true);
        }
        
        $('#suggestions').css('display','none');
        $('#searchInput').focus();
    }
    
    $scope.updatetags = function() {
        
        $http.post('http://www.icreax.in/icrowding_server/updatetags.php', {tags: $scope.selectedTags, email: $scope.passingparams.passemail})
        .success(function(response) {
           
           if(response == 'failure')
           {
               navigator.notifications.alert('Please try again.', function() {}, 'Failure!');
           }
           else
           {
                $scope.passingparams.passid = $scope.passingparams.passemail;
                $scope.passingparams.passparam = "#/notloggedin/login";
                window.location.href = "#/notloggedin/validatephone";
           }
            
        });
        
    }
    
})
.controller('create-event2Ctrl', function($scope, $http, $ionicNavBarDelegate, $ionicLoading, Datasharing){
    
    $ionicNavBarDelegate.showBackButton(false);
    $scope.passingparams = Datasharing;
    $scope.data = {};
    $scope.suggestions = [];
    $scope.selectedTags = [];
    $scope.selectedIndex = -1;
    
    navigator.notification.alert('Now enter appropriate keywords. This helps users get quick idea about the event.', function() {}, 'Great!');
    
    $scope.skip = function() {
        
        window.location.href = "#/notloggedin/create-event3";
        
    }
    
    $scope.search = function () {
        $http.post('http://www.icreax.in/icrowding_server/bringtags.php', {keyword:$scope.data.searchText }).success(function (data) {
            
            $scope.suggestions = data;
            
            if($scope.suggestions.length < 1 && $('#searchInput').val() == '')
            {
                $('#suggestions').css('display','none');
            }
            else
            {
                $('#suggestions').css('display','block');
            }
            
            $scope.selectedIndex = -1;
        });
    }

    $scope.removeTag = function (index) {
        $scope.selectedTags.splice(index, 1);
        
        if($scope.selectedTags.length >= 5)
        {
            $('#searchInput').attr('disabled', true);
        }
        
    }

    $scope.checkKeyDown = function (event) {
        if (event.keyCode === 40) {//down key, increment selectedIndex
            event.preventDefault();
            if ($scope.selectedIndex + 1 !== $scope.suggestions.length) {
                $scope.selectedIndex++;
            }
        }
        else if (event.keyCode === 38) { //up key, decrement selectedIndex
            event.preventDefault();
            if ($scope.selectedIndex - 1 !== -1) {
                $scope.selectedIndex--;
            }
        }
        else if (event.keyCode === 13) { //enter pressed
            $scope.addToSelectedTags($scope.selectedIndex);
        }
    }

    $scope.addToSelectedTags = function (index) {

        if (index == -2)
        {
            $scope.selectedTags.push($scope.data.searchText);
            $scope.data.searchText = '';
            $('#searchInput').focus();
            $scope.suggestions = [];
        }
        if ($scope.selectedTags.indexOf($scope.suggestions[index]) === -1) {

            if ($scope.suggestions[index] != undefined)
            {
                $scope.selectedTags.push($scope.suggestions[index]);
                $scope.data.searchText = '';
                $('#searchInput').focus();
                $scope.suggestions = [];
            }
        }
        
        if($scope.selectedTags.length >= 5)
        {
            $('#searchInput').attr('disabled', true);
        }
        
        $('#suggestions').css('display','none');
        $('#searchInput').focus();
    }
    
    $scope.updatetags = function() {
        
        $http.post('http://www.icreax.in/icrowding_server/updateeventtags.php', {tags: $scope.selectedTags, eventname: $scope.passingparams.passparam2, userid: localStorage.getItem('userid')})
        .success(function(response) {
           
           if(response == 'failure')
           {
               navigator.notifications.alert('Please try again.', function() {}, 'Failure!');
           }
           else
           {
                window.location.href = "#/notloggedin/create-event3";
           }
            
        });
        
    }
    
})
.controller('create-event3Ctrl', function($scope, $http, $ionicNavBarDelegate, $ionicActionSheet, $ionicLoading, Datasharing) {
    
    $ionicNavBarDelegate.showBackButton(false);
    $scope.data = {};
    $scope.data.uploadurl = "http://www.icreax.in/icrowding_server/uploadeventpic.php";
    $scope.obj;
    var pictureSource;   // picture source
    var destinationType; // sets the format of returned value
    var url;
    
    destinationType = navigator.camera.DestinationType.FILE_URI;
    pictureSource = navigator.camera.PictureSourceType.PHOTOLIBRARY;
    
    $scope.passingparams = Datasharing;

    navigator.notification.alert('Pictures speak more than words. Add an event picture.', function () {
        }, 'Last step');

    if (!navigator.camera) {
        // error handling
        return;
    }

    $scope.choosepicture = function() {
        
        $ionicActionSheet.show({
        titleText: 'Options',
        buttons: [
            { text: '<i class="icon ion-camera"></i> Take Picture' },
            { text: '<i class="icon ion-images"></i> Choose from library' },
        ],
        cancelText: 'Cancel',
        cancel: function() {
            console.log('CANCELLED');
        },
        buttonClicked: function(index) {
            
            if(index == 0)
            {
                pictureSource = navigator.camera.PictureSourceType.CAMERA;
                takePicture();
            }
            if(index == 1)
            {
                pictureSource = navigator.camera.PictureSourceType.PHOTOLIBRARY;
                takePicture();
            }
            
            return true;
        }
        });
        
    }

    $scope.skip = function() {
        
        navigator.notification.alert('Event has been successfully created!', function () {
            window.location.href = "#/app/location";
        }, 'Thanks!');
        
    }

    function takePicture() {
        //console.log("got camera button click");
        var options = {
            quality: 50,
            destinationType: destinationType,
            sourceType: pictureSource,
            encodingType: 0
        };
        if (!navigator.camera) {
            // error handling
            return;
        }
        navigator.camera.getPicture(
			function (imageURI) {
			    //console.log("got camera success ", imageURI);
			    $scope.mypicture = imageURI;
			    $scope.update();
			},
			function (err) {
			    //console.log("got camera error ", err);
			    // error handling camera plugin
			},
			options);
    };

    $scope.update = function (obj) {
        if (!$scope.mypicture) {
            // error handling no picture given
            return;
        }
        var options = new FileUploadOptions();
        options.fileKey = "ffile";
        options.fileName = $scope.passingparams.passparam2 + '_' + localStorage.getItem('userid');
        options.mimeType = "image/jpeg";
        var params = {};
        options.params = params;

        $scope.loading = $ionicLoading.show({
        content: 'Uploading...',
        showBackdrop: false
        });

        //console.log("new imp: prepare upload now");
        var ft = new FileTransfer();
        ft.upload($scope.mypicture, encodeURI($scope.data.uploadurl), uploadSuccess, uploadError, options);
        function uploadSuccess(r) {
            $ionicLoading.hide();
            if (r.response == "success")
            {
                navigator.notification.alert('Event has been successfully created!', function () {
                        window.location.href = "#/app/location";
                    }, 'Thanks!');
            }

        }
        function uploadError(error) {
            $ionicLoading.hide();
            navigator.notification.alert('Choose proper image file and try Again!', function () {

            }, 'Sorry!');
        }
    };
    
})
.controller('InviteCtrl', function ($scope, $http, $ionicNavBarDelegate, $ionicLoading, Datasharing) {

    $ionicNavBarDelegate.showBackButton(true);

    $scope.data = {};
    $scope.passingparams = Datasharing;

    $http.post("http://www.icreax.in/icrowding_server/getfriends.php", { userid: localStorage.getItem('username'), eventid: $scope.passingparams.passid })
    .success(function (response) {
        if (response.length < 1)
        {
            navigator.notification.alert('You have no friends here. Try finding some friends.', function () {
                window.location.href = "#/app/search";
            }, 'Sorry!');
        }
        $scope.friends = response;
    });

    $scope.invite = function () {
        
        $scope.loading = $ionicLoading.show({
            content: 'Signing up...',
            showBackdrop: false
        });

        var form = document.getElementById('invitationform');
        var chks = form.querySelectorAll('input[type="checkbox"]');
        var checked = [];
        for (var i = 0; i < chks.length; i++) {
            if (chks[i].checked) {
                checked.push(chks[i].value)
            }
        }

        $http.post('http://www.icreax.in/icrowding_server/invitefriends.php', { eventid: $scope.passingparams.passid, friendslist: checked })
        .success(function (response) {

            $ionicLoading.hide();

            if(response == 'success')
            {
                navigator.notification.alert('Your friends have been invited!', function () {
                    window.location.href = "#/app/event";
                }, 'Done!');
            }
        })
        .error(function() {
            $ionicLoading.hide();
        });;

    }
})
.controller('LogoutCtrl', function ($scope) {
    $scope.confirmlogout = function () {
        localStorage.removeItem('username');
        localStorage.removeItem('password');

        window.location.href = "#/notloggedin/login";
    }
})
.controller('SearchCtrl', function ($scope, $http, $ionicLoading,$ionicNavBarDelegate, Datasharing) {

    $ionicNavBarDelegate.showBackButton(true);

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
            
            $scope.loading = $ionicLoading.show({
                content: 'Getting results...',
                showBackdrop: false
            });
            
            $http.post('http://www.icreax.in/icrowding_server/getresults.php', {keyword: $scope.data.keyword, targettype: $scope.data.targettype, username: localStorage.getItem('username')})
        .success(function (response) {

            $ionicLoading.hide();

            if (response == 'notfound')
            {
                if ($scope.data.targettype == 'E')
                {
                    navigator.notification.alert('No matching event found!', function () { }, 'Oops!');
                }
                else if($scope.data.targettype == 'P')
                {
                    navigator.notification.alert('No matching user found!', function () { }, 'Oops!');
                }
            }
            else
            {
                $scope.results = response;
            }
     
        })
        .error(function (error) {
            $ionicLoading.hide();
        })
        }
        
    }

    $scope.gotoEvent = function (eventid) {
        $scope.passingparams.passid = eventid;
        window.location.href = "#/app/event-info";
    }

    $scope.viewProfile = function (userid) {
        localStorage.setItem('profileid',userid);
        window.location.href = "#/app/profile";
    }
 
    $scope.joinevent = function (eventid) {
        
        $scope.loading = $ionicLoading.show({
            content: 'wait...',
            showBackdrop: false
        });
        
        $http.post('http://www.icreax.in/icrowding_server/asktojoin.php', { eventid: eventid, userid: localStorage.getItem('userid') })
        .success(function (response) {
            
            $ionicLoading.hide();
            
            if(response == 'success')
            {
                navigator.notification.alert('Your request has been sent to event admin', function () {

                }, 'Done');
            }
            else
            {
                navigator.notification.alert('Something went wrong! Try again!', function () {

                }, 'Sorry');
            }
        })
        .error(function() {
            $ionicLoading.hide();
        });
    }

    $scope.addfriend = function (userid) {
        
        $scope.loading = $ionicLoading.show({
            content: 'wait...',
            showBackdrop: false
        });
        
        $http.post('http://www.icreax.in/icrowding_server/addfriend.php', { friendid: userid,senderid: localStorage.getItem('username') })
        .success(function (response) {
            
            $ionicLoading.hide();
            
            if(response == 'success')
            {
                navigator.notification.alert('Friend request has been sent!', function () {

                }, 'Done');
            }
            else
            {
                navigator.notification.alert('Something went wrong! Please try again.', function () {

                }, 'Sorry');
            }
        })
        .error(function() {
            $ionicLoading.hide();
        });
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

.controller('friendsCtrl', function ($scope, $http, $ionicLoading, $ionicNavBarDelegate, Datasharing) {

    $ionicNavBarDelegate.showBackButton(true);
    
    $scope.passingparams = Datasharing;

    $scope.loading = $ionicLoading.show({
        content: 'Getting friends list...',
        showBackdrop: false
    });

    $http.post('http://www.icreax.in/icrowding_server/listfriends.php', { userid: localStorage.getItem('username') })
    .success(function (response) {
        $ionicLoading.hide();
        $scope.friends = response;
    })
    .error(function() {
        $ionicLoading.hide();
    });

    $http.post('http://www.icreax.in/icrowding_server/reqtotal.php', {userid: localStorage.getItem('userid')})
    .success(function (response) {
        
        if(response == 'failure')
        {
            $scope.reqtotal = '0';
        }
        else
        {
            $scope.reqtotal = response;
        }
        
    })

    $scope.gotoprofile = function (id) {
        localStorage.setItem('profileid',id);
        window.location.href = "#/app/profile";
    }

    $scope.invitepeople = function () {

        navigator.contacts.pickContact(function (contact) {
            //console.log('The following contact has been selected:' + JSON.stringify(contact));

            var options = {
                replaceLineBreaks: false,
                android: {
                    intent: ''
                }
            };

            var message = 'I want you to join this awesome app called iCrowding. Click the link below to download.';

            sms.send(contact.phoneNumbers[0].value, message, function () {

                navigator.notification.alert('Your contact has been invited.', function () {

                }, 'Great!');

            }, function (e) {

            });

        }, function (err) {
            navigator.notifications.alert('Check your app permissions!', function () {

            }, 'Error!');
        });

    }

})

.controller('notificationsCtrl', function ($scope, $http, $ionicLoading, $ionicNavBarDelegate) {

    $ionicNavBarDelegate.showBackButton(true);

    $scope.loading = $ionicLoading.show({
        content: 'Loading...',
        showBackdrop: false
    });

    $http.post('http://www.icreax.in/icrowding_server/getnotifications.php', { userid: localStorage.getItem('username') })
    .success(function (response) {
        $ionicLoading.hide();
        if(response == "nodata")
        {
            navigator.notification.alert('Nothing new here.', function () {
                window.location.href = "#/app/location";
            }, 'Relax!');
        }
        else
        {
            $scope.notifications = response;
        }
    })
    .error(function() {
        $ionicLoading.hide();
    });;

    $scope.readit = function (id) {
        
        $http.post('http://www.icreax.in/icrowding_server/readnotification.php', {notificationid: id})
        .success(function (response) {
           if(response == "success")
           {
               $http.post('http://www.icreax.in/icrowding_server/getnotifications.php', { userid: localStorage.getItem('username') })
                .success(function (response) {
                    $ionicLoading.hide();
                    if(response == "nodata")
                    {
                        navigator.notification.alert('Nothing new here.', function () {
                            window.location.href = "#/app/location";
                        }, 'Relax!');
                    }
                    else
                    {
                        $scope.notifications = response;
                    }
                })
                .error(function() {
                    $ionicLoading.hide();
                });
           }
           else
           {
               navigator.notification.alert('Something went wrong.', function () {
                   window.location.href = "#/app/location";
               }, 'Woah!');
           } 
        });
        
    }
    
    $scope.confirmevent = function (id, id2) {

        $scope.loading = $ionicLoading.show({
            content: 'Working...',
            showBackdrop: false
        });

        $http.post('http://www.icreax.in/icrowding_server/confirmevent.php', { eventid: id, targetid: id2, userid: localStorage.getItem('userid') })
        .success(function (response) {
            $ionicLoading.hide();
            navigator.notification.alert('You confirmed the request !', function () {
                $http.post('http://www.icreax.in/icrowding_server/getnotifications.php', { userid: localStorage.getItem('username') })
                .success(function (response) {

                    if (response == 'nodata') {
                        $scope.notificationstatus = "display: none";
                        window.location.href = "#/app/location";
                    }
                    else {
                        $scope.notificationstatus = "display: block";
                        $scope.data.notificationcount = response.length;
                    }

                });
            }, 'Done!');
        })
        .error(function() {
            $ionicLoading.hide();
        });
    }

})

.controller('ChangecoverCtrl', function ($scope, $http, $ionicLoading, $ionicNavBarDelegate) {
  
    $ionicNavBarDelegate.showBackButton(true);
    
    $scope.changecover = function(newcover) {
        
        $http.post('http://www.icreax.in/icrowding_server/changecover.php', {cover: newcover, id: localStorage.getItem('userid')})
        .success(function(response) {
            if(response == 'success')
            {
                navigator.notification.alert('Your cover picture has been updated.', function() {
                    window.location.href = "#/app/edit-profile";
                }, 'success');
            }
            else
            {
                navigator.notification.alert('Picture update Failed! Try again.', function() {
                }, 'Sorry');
            }
        })
        
    }
    
})

.controller('picuploadCtrl', function ($scope, $ionicLoading, $ionicNavBarDelegate, Datasharing) {
   
    $ionicNavBarDelegate.showBackButton(true);
    $scope.data = {};
    $scope.data.uploadurl = "http://www.icreax.in/icrowding_server/uploadimage.php";
    $scope.obj;
    var pictureSource;   // picture source
    var destinationType; // sets the format of returned value
    var url;
    $scope.passingparams = Datasharing;

    if (!navigator.camera) {
        // error handling
        return;
    }

    pictureSource = navigator.camera.PictureSourceType.PHOTOLIBRARY;
    destinationType = navigator.camera.DestinationType.FILE_URI;

    $scope.takePicture = function () {
        //console.log("got camera button click");
        var options = {
            quality: 50,
            destinationType: destinationType,
            sourceType: pictureSource,
            encodingType: 0
        };
        if (!navigator.camera) {
            // error handling
            return;
        }
        navigator.camera.getPicture(
			function (imageURI) {
			    //console.log("got camera success ", imageURI);
			    $scope.mypicture = imageURI;
			    $scope.update();
			},
			function (err) {
			    //console.log("got camera error ", err);
			    // error handling camera plugin
			},
			options);
    };

    $scope.update = function (obj) {
        if (!$scope.mypicture) {
            // error handling no picture given
            return;
        }
        var options = new FileUploadOptions();
        options.fileKey = "ffile";
        options.fileName = localStorage.getItem('username');
        options.mimeType = "image/jpeg";
        var params = {};
        options.params = params;

        $scope.loading = $ionicLoading.show({
        content: 'Uploading...',
        showBackdrop: false
        });

        //console.log("new imp: prepare upload now");
        var ft = new FileTransfer();
        ft.upload($scope.mypicture, encodeURI($scope.data.uploadurl), uploadSuccess, uploadError, options);
        function uploadSuccess(r) {
            $ionicLoading.hide();
            if (r.response == "success")
            {
                $('#mypic').attr('src', '#');
                $('#mypic').attr('src', 'http://www.icreax.in/icrowding_server/images/users/' + localStorage.getItem('username') + '.jpg');
                navigator.notification.alert('Pic uploaded! Continue..', function () {
                    window.location.href = $scope.passingparams.passparam2;
                }, 'Great!');
            }

        }
        function uploadError(error) {
            $ionicLoading.hide();
            navigator.notification.alert('Choose proper image file and try Again!', function () {

            }, 'Sorry!');
        }
    };

})

.controller('profileCtrl', function ($scope, $http, $ionicLoading, $ionicNavBarDelegate, Datasharing) {

    $ionicNavBarDelegate.showBackButton(true);

    $scope.data = {}
    
    $scope.adminbuttonshowstatus = "";
    $scope.friendbuttondisplaystatus = "";
    $scope.visitorbuttondisplaystatus = "";

    $scope.passingparams = Datasharing;
    $scope.profileid = "";

    $scope.loading = $ionicLoading.show({
        content: 'Getting profile...',
        showBackdrop: false
    });

    $('#mypic').attr('src', 'img/profile.jpg');

    if (localStorage.getItem('profileid') != '')
    {
        
        $http.post('http://www.icreax.in/icrowding_server/getprofile.php', { userid: localStorage.getItem('profileid'), curruserid: localStorage.getItem('username') })
        .success(function (response) {

            $('#mypic').attr('src', 'http://www.icreax.in/icrowding_server/images/users/' + $scope.passingparams.profileid + '.jpg?' + new Date().getTime());

            if(response[1] == 'friend')
            {
                $scope.visitorbuttondisplaystatus = "display: none;";
                $scope.friendbuttondisplaystatus = "margin: 2% 5%;";
            }
            else
            {
                $scope.friendbuttondisplaystatus = "margin: 2% 0%;";
            }

            $scope.profileid = response[0].id;
            response[0].interest = response[0].interest.split(',');
            $scope.data = response[0];
            $scope.adminbuttondisplaystatus = "display: none;";
            $scope.passingparams.profileid = '';
            $ionicLoading.hide();
        });
    }
    else
    {
        $scope.friendbuttondisplaystatus = "display: none;";
        $scope.visitorbuttondisplaystatus = "display: none;";
        $('#mypic').attr('src', 'http://www.icreax.in/icrowding_server/images/users/' + localStorage.getItem('username') + '.jpg?' + new Date().getTime());
        $http.post('http://www.icreax.in/icrowding_server/getprofile.php', { userid: localStorage.getItem('username') })
        .success(function (response) {

            $ionicLoading.hide();
            $scope.data = response[0];
        })
        .error(function() {
            $ionicLoading.hide();
        });
    }

    $scope.changepic = function () {
        $scope.passingparams.passparam2 = "#/app/profile";
        window.location.href = "#/app/uploadpic";
    }

    $scope.gotochats = function (id) {
        localStorage.setItem('receiverid',$scope.profileid);
        window.location.href = "#/app/chats";
    }
    
    $scope.addfriend = function (userid) {
        
        $scope.loading = $ionicLoading.show({
            content: 'wait...',
            showBackdrop: false
        });
        
        $http.post('http://www.icreax.in/icrowding_server/addfriend.php', { friendid: userid,senderid: localStorage.getItem('username') })
        .success(function (response) {
            
            $ionicLoading.hide();
            
            if(response == 'success')
            {
                navigator.notification.alert('Friend request has been sent!', function () {

                }, 'Done');
            }
            else
            {
                navigator.notification.alert('Something went wrong! Please try again.', function () {

                }, 'Sorry');
            }
        })
        .error(function() {
            $ionicLoading.hide();
        });
    }

})

.controller('editprofileCtrl', function ($scope, $http, $ionicLoading, $ionicNavBarDelegate, Datasharing) {

    $ionicNavBarDelegate.showBackButton(true);

    $scope.data = {}
    $scope.passingparams = Datasharing;

    $scope.loading = $ionicLoading.show({
        content: 'Getting profile...',
        showBackdrop: false
    });

    $http.post('http://www.icreax.in/icrowding_server/getprofile.php', { userid: localStorage.getItem('username') })
    .success(function (response) {

        $('#mypic').attr('src', '#');
        $('#mypic').attr('src', 'http://www.icreax.in/icrowding_server/images/users/' + localStorage.getItem('username') + '.jpg?' + new Date().getTime());
        $scope.data = response[0];
        $scope.data.height = parseInt(response[0].height);
        $scope.data.weight = parseInt(response[0].weight);
        $scope.data.age = parseInt(response[0].age);
        $ionicLoading.hide();
    });

    $scope.changepic = function () {
        $scope.passingparams.passparam2 = "#/app/editprofile";
        window.location.href = "#/app/uploadpic";
    }

    $scope.save = function () {
        $http.post('http://www.icreax.in/icrowding_server/editprofile.php', { userid: localStorage.getItem('username'), fname: $scope.data.fname, gender: $scope.data.gender, height: $scope.data.height, weight: $scope.data.weight, age: $scope.data.age, sexuality: $scope.data.sexuality, occupation: $scope.data.occupation })
        .success(function (response) {
            $ionicLoading.hide();
            if(response == 'success')
            {
                navigator.notification.alert('Your changes have been saved successfully!', function () {
                }, 'Done');
            }
        })
        .error(function() {
            $ionicLoading.hide();
        });
    }

    $scope.changepassword = function () {

        if ($scope.data.newpwd === $scope.data.rnewpwd) {
            $http.post('http://www.icreax.in/icrowding_server/changepassword.php', { currpwd: $scope.data.currpwd, newpwd: $scope.data.newpwd, userid: localStorage.getItem('userid') })
            .success(function (response) {
                if (response == "success") {
                    navigator.notification.alert('Your password has been successfully changed!', function () {
                        localStorage.removeItem('username');
                        localStorage.removeItem('password');

                        window.location.href = "#/notloggedin/login";
                    }, 'Done');
                }
                else {
                    navigator.notification.alert('Your current password is wrong! Please try again', function () {

                    }, 'Wrong current password');
                }
            })
        }
        else {
            navigator.notification.alert('Please check your passwords!', function () {

            }, 'Passwords does not match');
        }
    }

})

.controller('chatsCtrl', function ($scope,$http, $ionicNavBarDelegate,$timeout, $ionicScrollDelegate, Datasharing, socket) {

    $ionicNavBarDelegate.showBackButton(true);
    var self = this;
    $scope.passingparams = Datasharing;
    $scope.curruser = localStorage.getItem('userid');
    $scope.chats = {};
    $scope.hidestatus = 'display: flex;';
    
    var alternate,
    isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

    $http.post('http://www.icreax.in/icrowding_server/getmessage.php', { receiverid: localStorage.getItem('receiverid'), userid: localStorage.getItem('userid') })
    .success(function (response) {

        if (response == 'nodata') {

        }
        else {
            $scope.chats = response;
        }

        var instances = $ionicScrollDelegate.$getByHandle("mainScroll")._instances;
        instances[instances.length-1].scrollBottom(true);

    });
    
    socket.on('connection',function(){
        
    });
    
    socket.on('identity request', function(incoming) {
        socket.emit('identity confirm', {userid: localStorage.getItem('userid')}); 
    });
    
    socket.on('chat message', function(msg) {
        $scope.chats.push(msg);
    });
    
    socket.on('alert message', function(msg) {
        
        if(msg == 'user offline')
        {
            navigator.notification.alert('You can still send messages.', function() {},'User went offline!');
        }
        
    })
    
    $scope.submitComment = function () {

        /*$http.post("http://www.icreax.in/icrowding_server/sendmessage.php", { senderid: localStorage.getItem('userid'), receiverid: localStorage.getItem('receiverid'), senderemail: localStorage.getItem('username'), content: $scope.data.comment })
        .success(function (response) {
            if (response == 'success') {
                $http.post('http://www.icreax.in/icrowding_server/getmessage.php', { receiverid: localStorage.getItem('receiverid'), userid: localStorage.getItem('userid') })
                .success(function (response) {
                    
                    $scope.data.comment = '';
                    if (response == 'nodata') {

                    }
                    else {
                        var objDiv = document.getElementById("chatdiv");
                        objDiv.scrollTop = objDiv.scrollHeight;
                        $scope.chats = response;
                    }

                    var instances = $ionicScrollDelegate.$getByHandle("mainScroll")._instances;
                    instances[instances.length-1].scrollBottom(true);
                });
            }
        });*/
        
        $scope.message = {
            content: $scope.data.comment,
            idreceiver: localStorage.getItem('receiverid'),
            idsender: localStorage.getItem('userid'),
            senderemail: localStorage.getItem('username')
        };
        
        $scope.chats.push($scope.message);
        
        socket.emit('chat message', $scope.message);
        $scope.data.comment = '';
        
        var instances = $ionicScrollDelegate.$getByHandle("mainScroll")._instances;
        instances[instances.length-1].scrollBottom(true);
        
    }
    
})

.controller('participantsCtrl', function ($scope, $http, $ionicNavBarDelegate, $ionicLoading, Datasharing) {

    $ionicNavBarDelegate.showBackButton(true);

    $scope.passingparams = Datasharing;
    $scope.noparticipantsMessage = "";

    $scope.gotoProfile = function(id) {
        
        localStorage.setItem('profileid',id);
        window.location.href = "#/app/profile";
        
    }

    $scope.loading = $ionicLoading.show({
        content: 'Getting profile...',
        showBackdrop: false
    });

    $http.post('http://www.icreax.in/icrowding_server/getparticipants.php', { eventid: $scope.passingparams.passid })
    .success(function (response) {
        $ionicLoading.hide();
        if (response == "nodata") {

        }
        else {
            
            if(response.length < 1)
            {
                $scope.noparticipantsMessage = "No participants.";
            }
            
            $scope.friends = response;
        }
    })
    .error(function() {
        $ionicLoading.hide();
    });
})

.controller('justnowCtrl', function ($scope, $http, $ionicNavBarDelegate, Datasharing) {
    
    $ionicNavBarDelegate.showBackButton(true);
    
    $scope.passingparams = Datasharing;
    $scope.data = {}

    $http.post('http://www.icreax.in/icrowding_server/getmyevents.php', {userid: localStorage.getItem('userid')})
    .success(function (response) {
        if (response != "nodata") {
            $scope.events = response;
        }
    });

    $http.get('http://www.icreax.in/icrowding_server/getsharedevents.php')
    .success(function (response) {
        if (response != "nodata") {
            $scope.sharedevents = response;
        }
    });

    $scope.gotoevent = function (eventid) {
        $scope.passingparams.passid = eventid;
        window.location.href = "#/app/event-info";
    }

    $scope.shareevent = function () {

        if ($scope.data.eventid == undefined) {
            navigator.notification.alert('Please select an event to share!', function () {

            }, 'Attention!');
        }
        else
        {
            $http.post('http://www.icreax.in/icrowding_server/shareevent.php', { eventid: $scope.data.eventid })
        .success(function (response) {
            if (response == "success") {
                navigator.notification.alert('Your event has been shared!', function () {
                    $http.get('http://www.icreax.in/icrowding_server/getsharedevents.php')
                    .success(function (response) {
                        if (response != "nodata") {
                            $scope.sharedevents = response;
                        }
                    });
                }, 'Success');
            }
            else {
                navigator.notification.alert('Please try again !', function () {

                }, 'Something went wrong');
            }
        })
        }
        
    }

})

.controller('changepasswordCtrl', function ($scope, $http) {

    $scope.data = {}

    $scope.changepassword = function () {

        if($scope.data.newpwd === $scope.data.rnewpwd)
        {
            $http.post('http://www.icreax.in/icrowding_server/changepassword.php', { currpwd: $scope.data.currpwd, newpwd: $scope.data.newpwd, userid: localStorage.getItem('userid') })
            .success(function (response) {
                if (response == "success")
                {
                    navigator.notification.alert('Your password has been successfully changed!', function () {
                        localStorage.removeItem('username');
                        localStorage.removeItem('password');

                        window.location.href = "#/notloggedin/login";
                    }, 'Done');
                }
                else
                {
                    navigator.notification.alert('Your current password is wrong! Please try again', function () {

                    }, 'Wrong current password');
                }
            })
        }
        else
        {
            navigator.notification.alert('Please check your passwords!', function () {

            }, 'Passwords does not match');
        }
    }
})

.controller('friendrequestsCtrl', function ($scope, $http, $ionicLoading,$ionicNavBarDelegate, Datasharing) {
    
    $ionicNavBarDelegate.showBackButton(true);
    
    $scope.passingparams = Datasharing;

    $scope.loading = $ionicLoading.show({
        content: 'Working...',
        showBackdrop: false
    });

    $http.post('http://www.icreax.in/icrowding_server/getfriendrequests.php', { userid: localStorage.getItem('userid') })
    .success(function (response) {

        $ionicLoading.hide();

        if (response == "failure") {
            navigator.notification.alert("System experienced an error. Please try again in a few minutes.", function () {
                window.location.href = "#/app/notifications";
            }, "Sorry");
        }
        else if (response == "nodata") {
            navigator.notification.alert("You don't have any pending friend requests at the moment.", function () {
                window.location.href = "#/app/friends";
            }, "Relax!");
        }
        else if (response == "") {
            navigator.notification.alert("System experienced an error. Please try again in a few minutes.", function () {
                window.location.href = "#/app/notifications";
            }, "Sorry");
        }
        else {
            $scope.friends = response;
        }
    })
    .error(function() {
        $ionicLoading.hide();
    });

    $scope.gotoprofile = function (id) {
        localStorage.setItem('profileid',id);
        window.location.href = "#/app/profile";
    }

    $scope.confirmfriend = function (id) {

        $scope.loading = $ionicLoading.show({
            content: 'Working...',
            showBackdrop: false
        });

        $http.post('http://www.icreax.in/icrowding_server/confirmfriend.php', { userid: id, curruserid: localStorage.getItem('userid') })
        .success(function (response) {

            $ionicLoading.hide();

            navigator.notification.alert('You confirmed the request !', function () {
                
                $http.post('http://www.icreax.in/icrowding_server/getfriendrequests.php', { userid: localStorage.getItem('userid') })
                .success(function (response) {
            
                    $ionicLoading.hide();
            
                    if (response == "failure") {
                        navigator.notification.alert("System experienced an error. Please try again in a few minutes.", function () {
                            window.location.href = "#/app/notifications";
                        }, "Sorry");
                    }
                    else if (response == "nodata") {
                        navigator.notification.alert("You don't have any pending friend requests at the moment.", function () {
                            window.location.href = "#/app/friends";
                        }, "Relax!");
                    }
                    else if (response == "") {
                        navigator.notification.alert("System experienced an error. Please try again in a few minutes.", function () {
                            window.location.href = "#/app/notifications";
                        }, "Sorry");
                    }
                    else {
                        $scope.friends = response;
                    }
                });
                
                $http.post('http://www.icreax.in/icrowding_server/getnotifications.php', { userid: localStorage.getItem('username') })
                .success(function (response) {

                    if (response == 'nodata') {
                        $scope.notificationstatus = "display: none";
                    }
                    else {
                        $scope.notificationstatus = "display: block";
                        $('#notificationcount').val(response.length);
                    }

                });
            }, 'Done!');
        })
        .error(function() {
            $ionicLoading.hide();
        });
    }

    $scope.deleterequest = function (id) {

        $scope.loading = $ionicLoading.show({
            content: 'Working...',
            showBackdrop: false
        });

        $http.post('http://www.icreax.in/icrowding_server/deletefriendrequest.php', { userid: id, curruserid: localStorage.getItem('userid') })
        .success(function (response) {

            $ionicLoading.hide();

            if (response == "success")
            {
                navigator.notification.alert('You deleted the request !', function () {
                    
                $http.post('http://www.icreax.in/icrowding_server/getfriendrequests.php', { userid: localStorage.getItem('userid') })
                .success(function (response) {
            
                    $ionicLoading.hide();
            
                    if (response == "failure") {
                        navigator.notification.alert("System experienced an error. Please try again in a few minutes.", function () {
                            window.location.href = "#/app/friends";
                        }, "Sorry");
                    }
                    else if (response == "nodata") {
                        navigator.notification.alert("You don't have any pending friend requests at the moment.", function () {
                            window.location.href = "#/app/friends";
                        }, "Relax!");
                    }
                    else if (response == "") {
                        navigator.notification.alert("System experienced an error. Please try again in a few minutes.", function () {
                            window.location.href = "#/app/friends";
                        }, "Sorry");
                    }
                    else {
                        $scope.friends = response;
                    }
                });
                    
                $http.post('http://www.icreax.in/icrowding_server/getnotifications.php', { userid: localStorage.getItem('username') })
                    .success(function (response) {

                        if (response == 'nodata') {
                            $scope.notificationstatus = "display: none";
                        }
                        else {
                            $scope.notificationstatus = "display: block";
                            $('#notificationcount').val(response.length);
                        }

                    });
                }, 'Done!');
            }

        })
        .error(function() {
            $ionicLoading.hide();
        });

    }

})

.controller('eventrequestsCtrl', function ($scope, $http, $ionicLoading, $ionicNavBarDelegate, Datasharing) {

    $ionicNavBarDelegate.showBackButton(true);

    $scope.loading = $ionicLoading.show({
            content: 'Working...',
            showBackdrop: false
        });
        
    $http.post('http://www.icreax.in/icrowding_server/geteventrequests.php', {userid: localStorage.getItem('userid')})
    .success(function(response) {
       
       $ionicLoading.hide();
       
       if (response == "failure") {
            navigator.notification.alert("System experienced an error. Please try again in a few minutes.", function () {
                window.location.href = "#/app/notifications";
            }, "Sorry");
        }
        else if (response == "nodata") {
            navigator.notification.alert("You don't have any pending event requests at the moment.", function () {
                window.location.href = "#/app/events";
            }, "Relax!");
        }
        else if (response == "") {
            navigator.notification.alert("System experienced an error. Please try again in a few minutes.", function () {
                window.location.href = "#/app/events";
            }, "Sorry");
        }
        else {
            $scope.events = response;
        }
        
    })
    .error(function() {
        $ionicLoading.hide();
    });

    $scope.confirmrequest = function (id, id2) {

        $scope.loading = $ionicLoading.show({
            content: 'Working...',
            showBackdrop: false
        });

        $http.post('http://www.icreax.in/icrowding_server/confirmevent.php', { eventid: id, targetid: id2, userid: localStorage.getItem('userid') })
        .success(function (response) {
            
            if(response == 'success')
            {
                $ionicLoading.hide();
                navigator.notification.alert('You confirmed the request !', function () {
                    
                    $http.post('http://www.icreax.in/icrowding_server/geteventrequests.php', {userid: localStorage.getItem('userid')})
                    .success(function(response) {
                    
                    $ionicLoading.hide();
                    
                    if (response == "failure") {
                            navigator.notification.alert("System experienced an error. Please try again in a few minutes.", function () {
                                window.location.href = "#/app/notifications";
                            }, "Sorry");
                        }
                        else if (response == "nodata") {
                            navigator.notification.alert("You don't have any pending event requests at the moment.", function () {
                                window.location.href = "#/app/events";
                            }, "Relax!");
                        }
                        else if (response == "") {
                            navigator.notification.alert("System experienced an error. Please try again in a few minutes.", function () {
                                window.location.href = "#/app/events";
                            }, "Sorry");
                        }
                        else {
                            $scope.events = response;
                        }
                        
                    });
                    
                    $http.post('http://www.icreax.in/icrowding_server/getnotifications.php', { userid: localStorage.getItem('username') })
                    .success(function (response) {
    
                        if (response == 'nodata') {
                            $scope.notificationstatus = "display: none";
                            window.location.href = "#/app/location";
                        }
                        else {
                            $scope.notificationstatus = "display: block";
                            $scope.data.notificationcount = response.length;
                        }
    
                    });
                }, 'Done!');
            }
            else
            {
                navigator.notification.alert("System experienced an error. Please try again in a few minutes.", function () {
                
                }, "Sorry");
            }
            
            
        })
        .error(function() {
            $ionicLoading.hide();
        });
    }
    
    $scope.deleterequest = function(id,id2) {
        
        $scope.loading = $ionicLoading.show({
            content: 'Working...',
            showBackdrop: false
        });
        
        $http.post('http://www.icreax.in/icrowding_server/deleteeventrequest.php', {userid: id2, eventid: id})
        .success(function(response) {
           
           if(response == 'success') {
               
               $ionicLoading.hide();
                navigator.notification.alert('You confirmed the request !', function () {
                    
                    $http.post('http://www.icreax.in/icrowding_server/geteventrequests.php', {userid: localStorage.getItem('userid')})
                    .success(function(response) {
                    
                    $ionicLoading.hide();
                    
                    if (response == "failure") {
                            navigator.notification.alert("System experienced an error. Please try again in a few minutes.", function () {
                                window.location.href = "#/app/notifications";
                            }, "Sorry");
                        }
                        else if (response == "nodata") {
                            navigator.notification.alert("You don't have any pending event requests at the moment.", function () {
                                window.location.href = "#/app/events";
                            }, "Relax!");
                        }
                        else if (response == "") {
                            navigator.notification.alert("System experienced an error. Please try again in a few minutes.", function () {
                                window.location.href = "#/app/events";
                            }, "Sorry");
                        }
                        else {
                            $scope.events = response;
                        }
                        
                    });
                    
                    $http.post('http://www.icreax.in/icrowding_server/getnotifications.php', { userid: localStorage.getItem('username') })
                    .success(function (response) {
    
                        if (response == 'nodata') {
                            $scope.notificationstatus = "display: none";
                            window.location.href = "#/app/location";
                        }
                        else {
                            $scope.notificationstatus = "display: block";
                            $scope.data.notificationcount = response.length;
                        }
    
                    });
                }, 'Done!');
               
           }
           else
           {
               navigator.notification.alert("System experienced an error. Please try again in a few minutes.", function () {
                                window.location.href = "#/app/events";
                            }, "Sorry");
           }
            
        })
        .error(function() {
            $ionicLoading.hide();
        });
        
    }

})

