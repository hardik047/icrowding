angular.module('starter.directives', [])

.directive('map', function () {
    return {
        restrict: 'E',
        scope: {
            onCreate: '&'
        },
        link: function ($scope, $element, $attr) {
            function initialize() {
                var mapOptions = {
                    zoom: 12,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                $($element[0]).attr('data-tap-disabled', 'true');
                var map = new google.maps.Map($element[0], mapOptions);

                $scope.onCreate({ map: map });

            }

            if (document.readyState === "complete") {
                initialize();
            } else {
                google.maps.event.addDomListener(window, 'load', initialize);
            }
        }
    }
})
// Time For Create Event
.directive('formattedTime', function ($filter) {

    return {
        require: '?ngModel',
        link: function (scope, elem, attr, ngModel) {
            if (!ngModel)
                return;
            if (attr.type !== 'time')
                return;

            ngModel.$formatters.unshift(function (value) {
                return value.replace(/:[0-9]+.[0-9]+$/, '');
            });
        }
    };

})

.directive('modelSuffix', [function () {
    return {
        restrict: 'AE',
        require: '^ngModel',
        link: function (scope, element, attributes, ngModelController) {
            var suffix = attributes.modelSuffix;
            // Pipeline of functions called to read value from DOM 
            ngModelController.$parsers.push(function (value) {
                return value + suffix;
            });

            // Pipeline of functions called to display on DOM
            ngModelController.$formatters.push(function (value) {
                return value.replace(suffix, '');
            });
        }
    }
}]);