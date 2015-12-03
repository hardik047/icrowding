angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, Datasharing) {
  
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
  
    //change-password Pop-Up

    $scope.notificationstatus = '';

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

    $scope.data = {}
    $scope.data.myname = localStorage.getItem('name');
    $('#mypic').attr('src', '#');
    $('#mypic').attr('src', 'http://www.icreax.in/icrowding_server/images/users/' + localStorage.getItem('username') + '.jpg');
    $scope.passingparams = Datasharing;

    $scope.logout = function () {
        navigator.notification.confirm('Are you sure you want to logout?', function () {
            localStorage.removeItem('username');
            localStorage.removeItem('password');

            window.location.href = "#/notloggedin/login";
        }, 'Logout');
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
.controller('MapCtrl', function ($scope, $ionicLoading, $ionicNavBarDelegate, $http) {

    $ionicNavBarDelegate.showBackButton(false);

    $scope.mapCreated = function(map) {
        $scope.map = map;
        $scope.centerOnMe();
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

            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            $ionicLoading.hide();

            var latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

            var marker = new google.maps.Marker({
                position: latLng,
                title: 'Your Location',
                visible: true,
                icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            });

            marker.setMap($scope.map);

            $http.post('http://www.icreax.in/icrowding_server/getlocations.php?'+ new Date().getTime(), { position: pos, userid: localStorage.getItem('userid') })
          .success(function (response) {
              var markerlocations = response;

              var markerinfowindow = new google.maps.InfoWindow();
              var directionsService = new google.maps.DirectionsService();
              var directionsDisplay = new google.maps.DirectionsRenderer();

              for (var i = 0; i < markerlocations.length; i++) {

                  var currloc = new google.maps.LatLng((markerlocations[i]).lat, (markerlocations[i]).lng);

                  marker = new google.maps.Marker({
                      position: currloc,
                      title: (markerlocations[i]).fname,
                      eventplace: (markerlocations[i]).location,
                      eventtime: (markerlocations[i]).formattedtime.toString(),
                      eventdate: (markerlocations[i]).date.toString(),
                      participants: (markerlocations[i]).participants,
                      visible: true
                  });

                  marker.setMap($scope.map);

                  marker.addListener('mousedown', function () {
                      markerinfowindow.setContent('<h4>' + this.title + '</h4><h6>' + this.eventplace + '</h6><h6>' + this.eventdate + '</h6><h6>' + this.eventtime + '</h6><h6>' + this.participants + ' are going.</h6>');
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
.controller('validatephoneCtrl', function ($scope, $http, $ionicLoading, Datasharing) {

    $scope.data = {}
    $scope.passingparams = Datasharing;

    $scope.loading = $ionicLoading.show({
        content: 'Validating...',
        showBackdrop: false
    });

    $http.post('http://www.icreax.in/icrowding_server/validatephone.php', { userid: $scope.passingparams.passid })
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

.controller('loginCtrl', function($scope, $http, $ionicLoading, Datasharing) {
     
    $scope.class="hide";
    $scope.data = {};
    $scope.passingparams = Datasharing;

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

        });

    }
})

.controller('notloggedinCtrl', function ($scope) {

})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('EventsCtrl', function ($scope, $http, $ionicLoading, $ionicNavBarDelegate, Datasharing) {

    $ionicNavBarDelegate.showBackButton(true);

    $http.post('http://www.icreax.in/icrowding_server/listevents.php', {userid: localStorage.getItem('username')})
    .success(function (response) {
        $ionicLoading.hide();
        $scope.events = response;
    });

    $scope.data = {}
    $scope.passingparams = Datasharing;

    $scope.loading = $ionicLoading.show({
        content: 'Getting events...',
        showBackdrop: false
    });

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
        
        justeventinfo[0].date = 
        
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
            else
            {
                $scope.visitorbuttonshowstatus = "display: block;";
                $scope.adminbuttonshowstatus = "display: none";
            }
            
        }
    });

    $http.post('http://www.icreax.in/icrowding_server/getmessage.php', { eventid: $scope.passingparams.passid })
    .success(function (response) {

        if (response == 'nodata') {

        }
        else {
            $scope.chats = response;
        }

    });

    $scope.seeparticipants = function () {
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

.controller('EventCtrl', function ($scope, $http, $ionicNavBarDelegate) {

    $ionicNavBarDelegate.showBackButton(true);

    var d = new Date();
    var todate = new Date(d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate());
    var totime = new Date(d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds());

    $scope.model = {
    };

    $scope.suggestions = [];
    $scope.selectedTags = [];
    $scope.selectedIndex = -1;

    $scope.search = function () {
        $http.post('http://www.icreax.in/icrowding_server/bringtags.php', { keyword: $scope.model.searchText }).success(function (data) {

            $scope.suggestions = data;
            $scope.selectedIndex = -1;
        });
    }

    $scope.removeTag = function (index) {
        $scope.selectedTags.splice(index, 1);
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

        if (index == -2) {
            $scope.selectedTags.push($scope.model.searchText);
            $scope.model.searchText = '';
            $('#searchInput2').click();
            $scope.suggestions = [];
        }
        if ($scope.selectedTags.indexOf($scope.suggestions[index]) === -1) {

            if ($scope.suggestions[index] != undefined) {
                $scope.selectedTags.push($scope.suggestions[index]);
                $scope.model.searchText = '';
                $('#searchInput2').click();
                $scope.suggestions = [];
            }
        }
    }

    $scope.createEvent = function () {

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

        $http.post('http://www.icreax.in/icrowding_server/createevent.php', { eventhost: localStorage.getItem('userid'), eventname: $scope.model.eventname, eventdate: new Date($scope.model.eventdate), eventtime: finaltime, eventlocation: $scope.model.location.formatted_address, keywords: $scope.selectedTags, lat: lat, lng: lng })
        .success(function (response) {
            if (response == 'success') {
                navigator.notification.alert('Event has been successfully created!', function () {
                    window.location.href = "#/app/location";
                }, 'Thanks!');
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

.controller('CreateCtrl', function ($scope, $http, $ionicLoading, Datasharing) {

    $scope.data = {};
    $scope.passingparams = Datasharing;
    $scope.suggestions = [];
    $scope.selectedTags = [];
    $scope.selectedIndex = -1;

    $scope.search = function () {
        $http.post('http://www.icreax.in/icrowding_server/bringtags.php', {keyword:$scope.data.searchText }).success(function (data) {
            
            $scope.suggestions = data;
            $scope.selectedIndex = -1;
        });
    }

    $scope.removeTag = function (index) {
        $scope.selectedTags.splice(index, 1);
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
    }

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

        $http.post('http://www.icreax.in/icrowding_server/register.php', { fname: $scope.data.fname, phone: $scope.data.phone, email: $scope.data.email, password: $scope.data.password, gender: $scope.data.gender, height: $scope.data.height, weight: $scope.data.weight, age: $scope.data.age, sexuality: $scope.data.sexuality, occupation: $scope.data.occupation, seeking: $scope.selectedTags })
        .success(function (response) {
            $ionicLoading.hide();
            if(response == 'success')
            {
                navigator.notification.alert('You have successfully signed up! Now, validate your phone number to continue!', function () {

                    $scope.passingparams.passid = $scope.data.email;
                    $scope.passingparams.passparam = "#/notloggedin/login";
                    window.location.href = "#/notloggedin/validatephone";
                }, 'Great!');
            }
            else
            {
                navigator.notification.alert(response, function () {
                }, 'Sorry!');
            }

        });

    }

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
.controller('SearchCtrl', function ($scope, $http, $ionicLoading,$ionicNavBarDelegate, Datasharing) {

    $ionicNavBarDelegate.showBackButton(true);

    $scope.data = {}
    $scope.passingparams = Datasharing;
    $scope.searchnow = function () {

        $scope.loading = $ionicLoading.show({
            content: 'Getting results...',
            showBackdrop: false
        });

        if ($scope.data.targettype == undefined)
        {
            navigator.notification.alert('Please select either Event or People to search!', function () {

            }, 'Attention!');
        }
        else
        {
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

    $scope.gotoprofile = function (id) {
        $scope.passingparams.profileid = id;
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

            var message = 'Hey ' + contact.displayName + ', I want you to join this awesome app called iCrowding. Click the link below to download.';

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

.controller('notificationsCtrl', function ($scope, $http, $ionicLoading) {

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
    });

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
        });
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

    $scope.passingparams = Datasharing;
    $scope.profileid = "";

    $scope.loading = $ionicLoading.show({
        content: 'Getting profile...',
        showBackdrop: false
    });

    $('#mypic').attr('src', 'img/profile.jpg');

    if ($scope.passingparams.profileid != '')
    {
        
        $http.post('http://www.icreax.in/icrowding_server/getprofile.php', { userid: $scope.passingparams.profileid })
        .success(function (response) {

            $('#mypic').attr('src', 'http://www.icreax.in/icrowding_server/images/users/' + $scope.passingparams.profileid + '.jpg?' + new Date().getTime());

            $scope.profileid = response[0].id;
            $scope.data = response[0];
            $scope.adminbuttondisplaystatus = "display: none;";
            $scope.passingparams.profileid = '';
            $ionicLoading.hide();
        });
    }
    else
    {
        $scope.friendbuttondisplaystatus = "display: none;";
        $('#mypic').attr('src', 'http://www.icreax.in/icrowding_server/images/users/' + localStorage.getItem('username') + '.jpg?' + new Date().getTime());
        $http.post('http://www.icreax.in/icrowding_server/getprofile.php', { userid: localStorage.getItem('username') })
        .success(function (response) {

            $ionicLoading.hide();
            $scope.data = response[0];
        });
    }

    $scope.changepic = function () {
        $scope.passingparams.passparam2 = "#/app/profile";
        window.location.href = "#/app/uploadpic";
    }

    $scope.gotochats = function () {
        localStorage.setItem('receiverid',$scope.profileid);
        window.location.href = "#/app/chats";
    }

})

.controller('editprofileCtrl', function ($scope, $http, $ionicLoading, Datasharing) {

    $scope.data = {}
    $scope.passingparams = Datasharing;

    $scope.suggestions = [];
    $scope.selectedTags = [];
    $scope.selectedIndex = -1;

    $scope.search = function () {
        $http.post('http://www.icreax.in/icrowding_server/bringtags.php', {keyword:$scope.data.searchText }).success(function (data) {
            
            $scope.suggestions = data;
            $scope.selectedIndex = -1;
        });
    }

    $scope.removeTag = function (index) {
        $scope.selectedTags.splice(index, 1);
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
    }

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
        $scope.selectedTags = (response[0].interest).split(',');
        $ionicLoading.hide();
    });

    $scope.changepic = function () {
        $scope.passingparams.passparam2 = "#/app/profile";
        window.location.href = "#/app/uploadpic";
    }

    $scope.save = function () {
        $http.post('http://www.icreax.in/icrowding_server/editprofile.php', { userid: localStorage.getItem('username'), fname: $scope.data.fname, gender: $scope.data.gender, height: $scope.data.height, weight: $scope.data.weight, age: $scope.data.age, sexuality: $scope.data.sexuality, occupation: $scope.data.occupation, seeking: $scope.selectedTags })
        .success(function (response) {
            $ionicLoading.hide();
            if(response == 'success')
            {
                navigator.notification.alert('Your changes have been saved successfully!', function () {
                    window.location.href = "#/app/profile";
                }, 'Done');
            }
        })
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

.controller('chatsCtrl', function ($scope,$http, $ionicNavBarDelegate, Datasharing) {

    $ionicNavBarDelegate.showBackButton(true);

    $scope.passingparams = Datasharing;

    $http.post('http://www.icreax.in/icrowding_server/getmessage.php', { receiverid: localStorage.getItem('receiverid'), userid: localStorage.getItem('userid') })
    .success(function (response) {

        if (response == 'nodata') {

        }
        else {
            $scope.chats = response;
        }

    });

    $scope.submitComment = function () {

        $http.post("http://www.icreax.in/icrowding_server/sendmessage.php", { senderid: localStorage.getItem('userid'), receiverid: localStorage.getItem('receiverid'), senderemail: localStorage.getItem('username'), content: $scope.data.comment })
        .success(function (response) {
            if (response == 'success') {
                $http.post('http://www.icreax.in/icrowding_server/getmessage.php', { receiverid: localStorage.getItem('receiverid'), userid: localStorage.getItem('userid') })
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

})

.controller('participantsCtrl', function ($scope, $http, $ionicNavBarDelegate, Datasharing) {

    $ionicNavBarDelegate.showBackButton(true);

    $scope.passingparams = Datasharing;

    $.post('http://www.icreax.in/icrowding_server/getparticipants.php', { eventid: $scope.passingparams.passid })
    .success(function (response) {
        if (response == "nodata") {

        }
        else {
            $scope.friends = response;
        }
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
                navigator.notification.alert('Your event has been shared !', function () {
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
    });

    $scope.gotoprofile = function (id) {
        $scope.passingparams.profileid = id;
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
            
        });
        
    }

})

