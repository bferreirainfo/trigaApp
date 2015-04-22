'use strict';

/* Directives */
trigaApp.directive('slideschedulecomponent', function () {
	return {
	    restrict: 'E',
	    scope: {schedule: '=' , fecthMethod:'&'},
	    replace: true,
	    templateUrl: 'views/slideschedulecomponent.html',
	    }
	}); 