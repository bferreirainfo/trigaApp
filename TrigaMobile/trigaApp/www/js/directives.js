'use strict';

/* Directives */
trigaApp.directive('slideschedulecomponent', function () {
	return {
	    restrict: 'E',
	    scope: {schedule: '=' , fecthMethod:'&'},
	    replace: true,
	    templateUrl: 'views/components/slideschedulecomponent.html',
	    }
	}); 
trigaApp.directive('notificationnavbariconcomponent', function () {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'views/components/notificationnavbariconcomponent.html',
	}
}); 