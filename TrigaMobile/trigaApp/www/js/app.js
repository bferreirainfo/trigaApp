'use strict';
/* App Module */
var trigaApp = angular.module('trigaApp', ['ionic','ngResource','ngMaterial','tabSlideBox']);
trigaApp.config(function($mdThemingProvider) {
	$mdThemingProvider.theme('default').primaryPalette("orange").accentPalette("green");
});

trigaApp.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
	    .state('login', {
	    	url: "/login",
	    	templateUrl: "views/login.html",
	    	controller: "LoginCtrl"
	    })
        .state('menu', {
            url: "/menu",
            abstract: true,
            templateUrl: "views/home.html"

        })
        .state('menu.aulas', {
            url: "/aulas",
            views: {
                'menuContent' :{
                    templateUrl: "views/aulas.html",
                    controller: "AulasCtrl"
                }
            }
        })
        .state('menu.teacherReview', {
        	url: "/teacherReview",
        	views: {
        		'menuContent' :{
        			templateUrl: "views/teacherReview.html",
        			controller: "TeacherReviewCtrl"
        		}
        	}
        })
	    .state('menu.notas', {
	    	url: "/notas",
	    	views: {
	    		'menuContent' :{
	    			templateUrl: "views/notas.html",
	    			controller: "NotasCtrl"
	    		}
	    	}
	    }) 
	    .state('menu.notifications', {
	    	url: "/notifications",
	    	views: {
	    		'menuContent' :{
	    			templateUrl: "views/notifications.html",
	    			controller: "NotificationsCtrl"
	    		}
	    	}
	    }) 
	    .state('menu.controleDeFaltas', {
	    	url: "/controleDeFaltas",
	    	views: {
	    		'menuContent' :{
	    			templateUrl: "views/controleDeFaltas.html",
	    			controller: "ControleDeFaltasCtrl"
	    		}
	    	}
	    }) ;
})

//trigaApp.config(function($httpProvider,$ionicConfigProvider) {
//	  //config ionic
//	  // note that you can also chain configs
//	  $ionicConfigProvider.backButton.text('Go Back').icon('ion-chevron-left');
//	
//	  //config loading screen spinner
//	  $httpProvider.interceptors.push(function($rootScope) {
//	    return {
//	      request: function(config) {
//	        $rootScope.$broadcast('loading:show')
//	        return config
//	      },
//	      response: function(response) {
//	    	 alert(JSON.stringify(response));
//	        $rootScope.$broadcast('loading:hide')
//	        return response
//	      }
//	    }
//	  })
//	})
//trigaApp.run(function($rootScope, $ionicLoading,$timeout) {
	
//  $rootScope.$on('loading:show', function() {
//    $ionicLoading.show({template: '<md-progress-circular md-mode="indeterminate"></md-progress-circular>', noBackdrop: true})
//	  window.plugins.spinnerDialog.show();
//  })

//  $rootScope.$on('loading:hide', function() {
//	  $timeout(function(){
//		  window.plugins.spinnerDialog.hide();
//	  },200);
//  })
//})
trigaApp.constant('$ionicLoadingConfig', {template: '<svg class="spinner-container" style="width:65px;height:65px;" viewBox="0 0 44 44" data-reactid=".0.1.0"><circle class="path" cx="22" cy="22" r="20" fill="none" stroke-width="4" data-reactid=".0.1.0.0"></circle></svg>', noBackdrop: true});
trigaApp.config(function($ionicConfigProvider) {
	//this make ionicKeyboard plugin resize screen when keyboard is showed in fullscreen mode.
	//	$ionicConfigProvider.scrolling.jsScrolling(!ionic.Platform.isWebView());
	ionic.Platform.isFullScreen = true;
});
var isProd;

trigaApp.run(function($ionicSideMenuDelegate,PushNotificationService, $location,$timeout,$rootScope) {
	isProd = true;
    
             
    
	//FastClick.attach(document.body);
	ionic.Platform.ready(function(){
          try{
		var isUserAllReadyLogged= window.localStorage.getItem("studentPerfil") != null;
		var waitForPushPluginInitialize = false;
		
		if(ionic.Platform.isWebView() && isUserAllReadyLogged){
			//initiate pushNotificationService to analize if the app was a "coldStart" openning
			//coldstart means that app was closed and the user opened it by click on notification in notification  bar.
			waitForPushPluginInitialize = true;
			//pushNotificationRegister.initialize(PushNotificationService);
		}
		
		///this plugin lock the orientation for all screens to only portrait |º|
		if(ionic.Platform.isWebView()){
			//screen.lockOrientation('portrait');
			//if (window.cordova && window.cordova.plugins.Keyboard) {
			    //Lets hide the accessory bar fo the keyboard (ios)
			    //cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
			    // also, lets disable the native overflow scroll
			    //cordova.plugins.Keyboard.disableScroll(true);
			 // }
			 //statusbarTransparent.enable();
		     // Get the bar back
		     //StatusBar.show();
		}
		//
		$timeout(function(){
			var startType;
			if(isColdStart){
				startType ="coldStart";
			}else if(isProd && window.localStorage.getItem("studentPerfil")){
				startType = "defaultPage"
			}else{
				startType = "firstTime";
			}
			switch(startType){
				case "coldStart":	
					$location.path("/menu/notifications");
					break;
				case "defaultPage":
					$location.path("/menu/" + JSON.parse(window.localStorage.getItem("appConfig")).defaultPage);
//					$location.path("/menu/" + "controleDeFaltas");
//					$location.path("/menu/" + "notifications");
//					$location.path("/menu/" + "notas");
					break;
				case "firstTime":
                    alert("login");
					$location.path("/login");
					break;
			}
			
			if(ionic.Platform.isWebView()){
				$timeout(function(){
					navigator.splashscreen.hide();
				}, 1000);
			}
			
		}, waitForPushPluginInitialize ? 1000 : 0 );
                         }catch(err){
                         alert(err);
                         }
	});
	
    // Menu button
    $rootScope.exitApp = ionic.Platform.exitApp;
    $rootScope.sideMenuController = $ionicSideMenuDelegate;
   
})
