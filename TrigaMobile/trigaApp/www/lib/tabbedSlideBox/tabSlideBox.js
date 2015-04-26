/*
 * SimplePubSub from https://github.com/mbenford/ngTagsInput/blob/master/src/util.js
 * */
'use strict';
var firstTime = true;
function SimplePubSub() {
    var events = {};
    return {
        on: function(names, handler) {
            names.split(' ').forEach(function(name) {
                if (!events[name]) {
                    events[name] = [];
                }
                events[name].push(handler);
            });
            return this;
        },
        trigger: function(name, args) {
            angular.forEach(events[name], function(handler) {
                handler.call(null, args);
            });
            return this;
        }
    };
};

angular.module('tabSlideBox', [])
.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
})
.directive('tabSlideBox', [ '$timeout', '$window', '$ionicSlideBoxDelegate', '$ionicScrollDelegate','$rootScope',
	function($timeout, $window, $ionicSlideBoxDelegate, $ionicScrollDelegate,$rootScope) {
		'use strict';

		return {
			restrict : 'A, E, C',
			link : function(scope, element, attrs, ngModel) {
				
				var ta = element[0], $ta = element;
				$ta.addClass("tabbed-slidebox");
				if(attrs.tabsPosition === "bottom"){
					$ta.addClass("btm");
				}
				
				function renderScrollableTabs(){
					var iconsDiv = angular.element(ta.querySelector(".tsb-icons")), icons = iconsDiv.find("a"), wrap = iconsDiv[0].querySelector(".tsb-ic-wrp"), totalTabs = icons.length;
					var scrollDiv = wrap.querySelector(".scroll");
					
					angular.forEach(icons, function(value, key){
					     var a = angular.element(value);
					     a.on('click', function(){
					    	 $ionicSlideBoxDelegate.slide(key);
					     });
					});
					var initialIndex = attrs.tab;
					$ionicSlideBoxDelegate.update();
					
					if((initialIndex ? initialIndex : 0) == 0){
						$ionicSlideBoxDelegate.slide(0, -1);
						setPosition(0);
					}else{
						$timeout(function () { 
							$ionicSlideBoxDelegate.slide(initialIndex ? initialIndex : 0, -1);
						},0);
						
					}
				}
				function setPosition(index){
					var iconsDiv = angular.element(ta.querySelector(".tsb-icons")), icons = iconsDiv.find("a"), wrap = iconsDiv[0].querySelector(".tsb-ic-wrp"), totalTabs = icons.length;
					var scrollDiv = wrap.querySelector(".scroll");
					
					var middle = iconsDiv[0].offsetWidth/2;
					var curEl = angular.element(icons[index]);
					if(curEl && curEl.length){
					var curElWidth = curEl[0].offsetWidth, curElLeft = curEl[0].offsetLeft;

					angular.element(iconsDiv[0].querySelector(".active")).removeClass("active");
					curEl.addClass("active");
					
					var leftStr = (middle  - (curElLeft) -  curElWidth/2 );
					if(leftStr > 0){
						leftStr = 0;
					}
					//Use this scrollTo, so when scrolling tab manually will not flicker
					$timeout(function () { 
						$ionicScrollDelegate.scrollTo(Math.abs(leftStr + 1.5), 0, true);
					},0);
					}
				};
				function getX(matrix) {
					matrix = matrix.replace("translate3d(","");
					matrix = matrix.replace("translate(","");
					return (parseInt(matrix));
				}
				var events = scope.events;
				events.on('slideChange', function(data){
					setPosition(data.index);
				});
				events.on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
					renderScrollableTabs();
				});
				attrs.$observe('whenready', function(dto){
					$timeout(function () { 
						if(dto){
							renderScrollableTabs();
						}
					},150);
	        	});
			},
			controller : function($scope, $attrs, $element) {
				$scope.events = new SimplePubSub();
				
				$scope.slideHasChanged = function(index){
					$scope.events.trigger("slideChange", {"index" : index});
				};
				
				$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
//					$scope.events.trigger("ngRepeatFinished", {"event" : ngRepeatFinishedEvent});
				});
			}
		};

	} 
]);
