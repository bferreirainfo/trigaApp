'use strict';

trigaApp.controller('NotasCtrl', function($rootScope,$scope, NotasService, $ionicLoading, $timeout) {
	var firstime = true;
	function fetch(isPushToFrefresh){
		 if(!isPushToFrefresh){
			$("#contentAnimation1").hide();
			 if(firstime){
				$("#subHeader").addClass("subHeaderAnimationCondition");
				$("#contentAnimation1").addClass("contentAnimation1");
			 }
			 $timeout(function(){
				 $ionicLoading.show()
			 },100)
		 }
		 var studentId = JSON.parse(window.localStorage.getItem("studentPerfil")).studentId;
		 NotasService.TodasNotas(studentId).then(
					function success(resp) {
						$(".slideUp1:eq(0)").hide();
						var response = { grades : resp, isUpdate : true , lastUpdateDate : new Date()};
						window.localStorage.setItem("grades", JSON.stringify(response));
						$timeout(function(){
							$scope.$broadcast('scroll.refreshComplete');
							$ionicLoading.hide();
						},550)
						$timeout(function(){
							
							$scope.dto = response;
							
						},560)
						$timeout(function(){
							 $(".slideUp1:eq(0)").fadeIn(1000);
							$("#subHeader").animate({
						            'top': '64px',
						            }, {duration: 'slow', queue: false}).fadeIn(1700);
							if(isPushToFrefresh || !firstime){
								 $("#contentAnimation1").show();
							}else{
								$("#contentAnimation1").animate({
									'top': '41px',
								}, {duration: 'slow', queue: false}).fadeIn(1000);
								$("#contentAnimation1").removeClass("contentAnimation1");
								firstime = false;
							}
						    $("#subHeader").removeClass("subHeaderAnimationCondition");
							
						 },580)
				},  function error(resp){
						console.log("fecthing GRADES error response", resp)
						console.log("error retrive grades: "+ JSON.stringify(resp));
						$ionicLoading.hide();
						$scope.$broadcast('scroll.refreshComplete');
				});
	}
	$scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {
		if(states.stateName == "menu.notas"){
			$rootScope.sideMenuController.canDragContent(false);
//			$('.appHeader').removeClass("shadowed");
			fetch();
        }
	});
	$scope.fetch = fetch;
})
trigaApp.controller('AulasCtrl', function ($rootScope,$scope, QuadroDeHorarioSevice, $ionicLoading,$timeout) {
//	ionic.Platform.showStatusBar(true);
	var firstime = true;
	function fetch(isPushToFrefresh){
		 var day = new Date().getDay();
		 $scope.initialSlide = day == 0 ? 6 : day -1;
		 if(!isPushToFrefresh){
			 $("#contentAnimation").hide();
			 if(firstime){
				 $("#subHeader1").addClass("subHeaderAnimationCondition");
				 $("#contentAnimation").addClass("contentAnimation");
			 }
			 $ionicLoading.show()
		 }
		var studentId = JSON.parse(window.localStorage.getItem("studentPerfil")).studentId;
		QuadroDeHorarioSevice.obterQuadroDeHorario(studentId).then(
				function success(resp) {
					var response = {scheduleGrid : resp , isUpdated: true ,lastUpdateDate : new Date()};
					window.localStorage.setItem("scheduleGrid", JSON.stringify(response));
					$timeout(function(){
						$scope.$broadcast('scroll.refreshComplete');
						$ionicLoading.hide();
					},350)
					$timeout(function(){
						$scope.dto = response;
						 $("#subHeader1").animate({
					            'top': '64px',
					            }, {duration: 'slow', queue: false}).fadeIn(1200);
						 if(isPushToFrefresh || !firstime){
							 $("#contentAnimation").show();
							 $(".slideUp").hide();
							 $(".slideUp").fadeIn(700);
						 }else{
							 $("#contentAnimation").animate({
								 'top': '128px',
							 }, {duration: 'slow', queue: false}).fadeIn(1000);
							 $("#contentAnimation").removeClass("contentAnimation");
							 firstime = false;
						 }
						 $("#subHeader1").removeClass("subHeaderAnimationCondition");
					},370)
			},  function error(resp){
					 console.log("error retrive scheduleGrid: "+ JSON.stringify(resp));
					 $ionicLoading.hide();
					 $scope.$broadcast('scroll.refreshComplete');
			})
	}
	$scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {
        if(states.stateName == "menu.aulas") {
        	$rootScope.sideMenuController.canDragContent(false);
        	$('.appHeader').removeClass("shadowed");
        	fetch();
        }
	});
	$scope.fetch = fetch;
	$scope.updateFn = fetch;
})

trigaApp.controller('LoginCtrl', function($scope, $state, $timeout, $ionicHistory, LoginService, PushNotificationService) {
	 var username =""; 
	 var password ="";	 
	 if(!isProd){			 
		  switch(LoginService.getInstitution()){
		  	case 'ALQUIMIA' :
		  		username = "bferreira.info@gmail.com";
		  		break;
		  	case 'TRIGA' :
		  		username = "bferreira.info@gmail.com";
	  			password = "123";
		  		break;
		  }
	  }
		
	  $scope.user = { institution: LoginService.getInstitution(), username: username , password : password};
	  $scope.show = false;
	  $scope.signIn = function(user) {
			  LoginService.login(user.username, user.password).then(
					  function success(resp) {
						  if(isEmpty(resp)){
							  window.localStorage.setItem("appConfig", JSON.stringify(resp.appConfig));
							  window.localStorage.setItem("studentPerfil", JSON.stringify(resp.studentPerfil));
							  //registerNewDevice + teste notification
							  if(ionic.Platform.isWebView())
								  pushNotificationRegister.initialize(PushNotificationService);
							  $ionicHistory.nextViewOptions({
								  disableAnimate: true,
								  disableBack: true
							  });
							  console.log(JSON.stringify(resp.appConfig));
							  $state.go('menu.'+ resp.appConfig.defaultPage);
						  }else{
							  alert("email incorreto");
						  }
					  }, function error(resp){
					});
	  };
})
trigaApp.controller('loadingDataCtrl', function($scope, $state, $timeout, LoginService) {
	if(ionic.Platform.isWebView() &&  false == window.localStorage.getItem("testDone")){
		  $timeout(function(){
			  var testInitialConditions = "iniciando \nregiGCM " + window.localStorage.getItem("regiGCM") + "\ndeviceId " + window.localStorage.getItem("deviceId");
			  $scope.regiGCM = JSON.parse(window.localStorage.getItem("regiGCM"));
			  if($scope.regiGCM == null || !$scope.regiGCM.pass){
				  $scope.testResult = JSON.parse($scope.regiGCM);
			  }else{
				  $timeout(function(){
					  $scope.deviceId = JSON.parse(window.localStorage.getItem("deviceId"));
					  if($scope.deviceId == null || !$scope.deviceId.pass){
						  $scope.testResult = JSON.parse($scope.deviceId);
					  }else{
						  $timeout(function(){
							  if(window.localStorage.getItem("unsawNotficiations")){
								  $scope.testResult = { pass : true , content : null};
								  window.localStorage.setItem("testDone", true);
						  	      $state.go('menu.notas');
							  }else{
								  window.localStorage.setItem("testDone", true);
								  $scope.testResult = { pass : false , content : "notification not received" };
							  }
						  },2000);
					  }
				  },100);
			  }
		  },1000);
	  }else{
		  $state.go('menu.notas');
	  }
})

trigaApp.controller('ControleDeFaltasCtrl', function($rootScope, $scope, ControleDeFaltasService, $ionicLoading,$timeout) {
	function fetch(isPushToFrefresh){
		 if(!isPushToFrefresh){
			 $ionicLoading.show({template: '<ion-spinner icon="android"></ion-spinner>', noBackdrop: true})
		 }
		ControleDeFaltasService.findAll().then(
			function success(resp) {
				$scope.dto = resp;
				$ionicLoading.hide();
				$scope.$broadcast('scroll.refreshComplete');
		},  function error(resp){
				$scope.dto = resp;
				$ionicLoading.hide();
				$scope.$broadcast('scroll.refreshComplete');
		});
	}
	$scope.$on( "$ionicView.enter", function( scopes, states) {
		if(states.stateName == "menu.controleDeFaltas" ) {
			$rootScope.sideMenuController.canDragContent(true);
//			$('.appHeader').addClass("shadowed");
			fetch();
		}
	});
	fetch();
	$scope.fetch = fetch;
	
	$scope.addFalta = function(cadeiraId){
		ControleDeFaltasService.addFalta(cadeiraId).then(function(resp) {
			 $.map($scope.dto.faults, function(val) {
				 if(val.cadeira.id == cadeiraId){
					 val.telaFaltasControlePessoal.push(resp);
				 }
			 });
		});
	};
	
	$scope.subFalta = function(cadeiraId){
		ControleDeFaltasService.subFalta(cadeiraId).then(function success(resp) {
			if(resp.hasError == false && resp.data == true){
				 $.map($scope.dto.faults, function(val) {
					 if(val.cadeira.id == cadeiraId ){
						 val.telaFaltasControlePessoal.pop();
					 }
				 });
			}
		});
	}
		
	
	
})

trigaApp.controller('TeacherReviewCtrl', function ($scope,$ionicSideMenuDelegate) {
	 $scope.data = {
	    group1 : '',
	    group2 : '2'
	  };
	  $scope.radioData = [
	    { label: '1', value: '1' },
	    { label: '2', value: '2' },
	    { label: '3', value: '3', isDisabled: true },
	    { label: '4', value: '4' }
	  ];
	  $scope.addItem = function() {
	    var r = Math.ceil(Math.random() * 1000);
	    $scope.radioData.push({ label: r, value: r });
	  };
	  $scope.removeItem = function() {
	    $scope.radioData.pop();
	  };
})
trigaApp.controller('NotificationsCtrl', function($rootScope,$scope) {
	$scope.$on( "$ionicView.enter", function( scopes, states) {
		if( states.stateName == "menu.notifications" ) {
			$rootScope.sideMenuController.canDragContent(true);
//			$('.appHeader').addClass("shadowed");
			window.localStorage.removeItem("unsawNotficiations");
			$scope.storedNotifications = JSON.parse(window.localStorage.getItem("storedNotifications"));
//			$scope.storedNotifications = [{ title : 'seja bem vindo ao triga', message: 'mensagem padrão', date: '10/3'}]
		};
	});
})

trigaApp.controller('UnsawNotficiationsPopoverCtrl', function($scope, $ionicPopover, $timeout) {
	$timeout(function(){
		$scope.unsawNotficiations = JSON.parse(window.localStorage.getItem("unsawNotficiations")) || [];
		$scope.unsawNotficiationsSize =  $scope.unsawNotficiations.length;
	},1000)
	
	$ionicPopover.fromTemplateUrl('views/popover.html',{scope:$scope}).then(function(popover) {
		$scope.dto = {top: ionic.Platform.isWebView() ? '35px' : '-13px'};
		$scope.popover = popover;
  });
	$scope.closePopover = function() {
		    $scope.popover.hide();
	};
	
	$scope.openPopover = function($event){
		$scope.popover.show($event)
		$scope.unsawNotficiationsSize = 0;
		window.localStorage.removeItem("unsawNotficiations");
	}
})

trigaApp.controller('UserCtrl', function($scope, UserPerfilService) {
	var studentPerfil = JSON.parse(window.localStorage.getItem("studentPerfil"));
	if(studentPerfil){
		$scope.name = studentPerfil.name;
		$scope.course = studentPerfil.course;
	}else{
		UserPerfilService.getPerfil("124").then(function(resp) {
			$scope.name = resp.name;
			$scope.course = resp.course;
		});
	}
})

trigaApp.controller('ChooseInstitutionCtrl', function($scope, LoginService) {
	$scope.choose = function(institutionName){
		LoginService.setInstitution(institutionName);
    }
})

trigaApp.controller('MenuCtrl', function($scope) {
	var appConfig = JSON.parse(window.localStorage.getItem("appConfig"));
	$scope.showGrades =  appConfig.funcionalities.indexOf('GRADES') > -1;
	$scope.showscheduleGrid =  appConfig.funcionalities.indexOf('SCHEDULE_GRID') > -1;
	$scope.showfaultsControl =  appConfig.funcionalities.indexOf('FAULTS_CONTROL') > -1;
	$scope.showNotifications =  appConfig.funcionalities.indexOf('NOTIFICATIONS') > -1;
})

function isEmpty(obj){
	for(var key in obj) {
		  if(obj.hasOwnProperty(key)) return true
	}
	return false;
}