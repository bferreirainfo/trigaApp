'use strict';

trigaApp.controller('NotasCtrl', function($rootScope,$scope, NotasService, $ionicLoading, $timeout) {
	var firstime = true;
	function fetch(isPushToFrefresh){
		$scope.isFetching = true;
		if(!isPushToFrefresh){
			$("#gradeListView").hide();
			 if(firstime){
				$("#gradeListView").addClass("contentAnimation1");
			 }
			 $ionicLoading.show()
		 }
		 var studentId = JSON.parse(window.localStorage.getItem("studentPerfil")).id;
		 NotasService.TodasNotas(studentId).then(
					function success(resp) {
						$scope.isFetching = false;
						$scope.errorMessage = null;
						$scope.$broadcast('scroll.refreshComplete');
						$ionicLoading.hide();
						$scope.dto = resp;
						$timeout(function(){
							 $(".slideUp1").hide();
							 $(".slideUp1").fadeIn(1000);
							 if(isPushToFrefresh || !firstime){
								 $("#gradeListView").show();
							 }else{
								 $("#gradeListView").animate({
									 'top': '44px',
								 }, {duration: 'slow', queue: false}).fadeIn(1000);
								 $("#gradeListView").removeClass("contentAnimation1");
								 firstime = false;
							 }
						 },50)
				},  function error(resp){
					$scope.isFetching = false;
					$scope.$broadcast('scroll.refreshComplete');
					$ionicLoading.hide();
					$scope.errorMessage = resp.errorMessage;
					$scope.dto = resp.cache;
					$timeout(function(){
						 $(".slideUp1").hide();
						 $(".slideUp1").fadeIn(1000);
						 if(isPushToFrefresh || !firstime){
							 $("#gradeListView").show();
						 }else{
							 $("#gradeListView").animate({
								 'top': '44px',
							 }, {duration: 'slow', queue: false}).fadeIn(1000);
							 $("#gradeListView").removeClass("contentAnimation1");
							 firstime = false;
						 }
					 },50)
				});
	}
	$scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {
		if(states.stateName == "menu.notas"){
			fetch();
			$rootScope.sideMenuController.canDragContent(true);
			$('.appHeader').addClass("shadowed");
        }
	});
	$scope.fetch = fetch;
})
trigaApp.controller('AulasCtrl', function ($rootScope,$scope, QuadroDeHorarioSevice, $ionicLoading,$timeout) {
//	ionic.Platform.showStatusBar(true);
	var firstime = true;
	function fetch(isPushToFrefresh){
		 var day = new Date().getDay();
		 if(!isPushToFrefresh){
			 $("#contentAnimation").hide();
			 if(firstime){
				 $("#subHeader1").addClass("subHeaderAnimationCondition");
				 $("#contentAnimation").addClass("contentAnimation");
			 }
			 $ionicLoading.show()
		 }
		var studentId = JSON.parse(window.localStorage.getItem("studentPerfil")).id;
		QuadroDeHorarioSevice.obterQuadroDeHorario(studentId).then(
				function success(resp) {
					$scope.errorMessage = null;
					$scope.$broadcast('scroll.refreshComplete');
					$ionicLoading.hide();
					$scope.dto = resp;
					$timeout(function(){
						$scope.events.trigger("render" , day == 0 ? 6 : day -1);
						 $("#subHeader1").animate({
					            'top': '64px',
					            }, {duration: 'slow', queue: false}).fadeIn(1200);
						 if(isPushToFrefresh || !firstime){
							 $("#contentAnimation").show();
							 $(".slideUp").hide();
							 $(".slideUp").fadeIn(1000);
						 }else{
							 $("#contentAnimation").animate({
								 'top': '100px',
							 }, {duration: 'slow', queue: false}).fadeIn(1000);
							 $("#contentAnimation").removeClass("contentAnimation");
							 firstime = false;
						 }
						 $("#subHeader1").removeClass("subHeaderAnimationCondition");
					},50)
			},  function error(resp){
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.hide();
				$scope.errorMessage = resp.errorMessage;
				$scope.dto = resp.cache;
				$timeout(function(){
					$scope.events.trigger("render" , day == 0 ? 6 : day -1);
					 $("#subHeader1").animate({
				            'top': '64px',
				            }, {duration: 'slow', queue: false, height: "easeOutBounce"}).fadeIn(1200);
					 if(isPushToFrefresh || !firstime){
						 $("#contentAnimation").show();
						 $(".slideUp").hide();
						 $(".slideUp").fadeIn(1000);
					 }else{
						 $("#contentAnimation").animate({
							 'top': '100px',
						 }, {duration: 'slow', queue: false}).fadeIn(1000);
						 $("#contentAnimation").removeClass("contentAnimation");
						 firstime = false;
					 }
					 $("#subHeader1").removeClass("subHeaderAnimationCondition");
				},50)
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

trigaApp.controller('LoginCtrl', function($scope,$mdDialog,$mdToast, $state, $timeout, $ionicHistory, LoginService, PushNotificationService) {
	 $scope.username = null; 
	 $scope.password = null;	 
	 $scope.selectedInstitution = null;
	 $scope.institutions = [{value: "TRIGA" , name :"Triga"}, {value: "ALQUIMIA", name:"Alquimia"}];
	 if(!isProd){			 
  		$scope.username = "bferreira.info@gmail.com";
  		$scope.password = "123";
  		$scope.selectedInstitution = {value: "TRIGA" , name :"Triga"};
	  }
	  $scope.show = false;
	  $scope.signIn = function(ev,username,password,selectedInstitution) {
		  	// Appending dialog to document.body to cover sidenav in docs app
		    // Modal dialogs should fully cover application
		    // to prevent interaction outside of dialog
			$mdDialog.show(
				      $mdDialog.alert()
				        .title('Efetuando login.')
				        .content('Aguarde um momento...')
				        .targetEvent(ev)
				    );
		  LoginService.login(username,password,selectedInstitution.value).then(
					  function success(resp) {
						  $mdDialog.hide();
						  if(isNotEmpty(resp.data)){
							  window.localStorage.setItem("appConfig", JSON.stringify(resp.data.appConfig));
							  window.localStorage.setItem("studentPerfil", JSON.stringify(resp.data.perfil));
							  //
							  //registerNewDevice + teste notification
							  if(ionic.Platform.isWebView())
								  pushNotificationRegister.initialize(PushNotificationService);
							  $ionicHistory.nextViewOptions({
								  historyRoot: true
							  });
							  
							  
							  if(ionic.Platform.isWebView()){
								  
//							  var institutionName = resp.appConfig.instituionName.toLowerCase();
//							  var url = "http://trigaportal-trigaserver.rhcloud.com/institutionsLogos/institutionSmallIcon/" + institutionName + '_small_icon.png';
//							  var fileDir = cordova.file.dataDirectory;
//							  var fileName = 'institution_small_icon.png'
//							  var targetPath = fileDir + fileName;
							  
//							  window.resolveLocalFileSystemURL(targetPath, console.log("starting verification"), function downloadAsset() {
//								var fileTransfer = new FileTransfer();
//								fileTransfer.download(url, targetPath, 
//									function(entry) {
//										console.log("Success!");
//										console.log("file downloaded")
//									}, 
//									function(err) {
//										console.log("Error");
//										console.dir(err);
//									});
//							  });
							  }
							  
							  
							  
							  console.log(JSON.stringify(resp.data.appConfig));
							  $state.go('menu.'+ resp.data.appConfig.defaultPage);
						  }else{
							  $timeout(function(){
								  $mdToast.show($mdToast.simple()
									        .content('Email ou senha incorretos')
									        .position("bottom right")
									        .hideDelay(1000));
							  },400)
						  }
					  }, function error(resp){
						  $mdDialog.hide();
						  $mdToast.show(
							      $mdToast.simple()
							        .content(resp.errorMessage.title + "  " + resp.errorMessage.description)
							        .position("bottom right")
							        .hideDelay(1000)
							    );
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
				  },60);
			  }
		  },1000);
	  }else{
		  $state.go('menu.notas');
	  }
})

trigaApp.controller('ControleDeFaltasCtrl', function($rootScope, $scope, $mdToast, ControleDeFaltasService, $ionicLoading,$timeout) {
	var firstime = true;
	function fetch(isPushToFrefresh){
		$scope.isFetching = true;
		if(!isPushToFrefresh){
			$("#controleDeFaltaView").hide();
			 if(firstime){
				$("#controleDeFaltaView").addClass("contentAnimation");
			 }
			 $ionicLoading.show()
		 }
		ControleDeFaltasService.findAll().then(
			function success(resp) {
				$scope.isFetching = false;
				$scope.errorMessage = null;
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.hide();
				$scope.dto = resp;
				$timeout(function(){
					 if(isPushToFrefresh || !firstime){
						 $("#controleDeFaltaView").show();
						 $(".slideUp1").hide();
						 $(".slideUp1").fadeIn(1000);
					 }else{
						 $("#controleDeFaltaView").animate({
							 'top': '20px',
						 }, {duration: 'slow', queue: false}).fadeIn(1000);
						 $("#controleDeFaltaView").removeClass("contentAnimation");
						 firstime = false;
					 }
				},50)
		},  function error(resp){
			$scope.isFetching = false;
			$scope.$broadcast('scroll.refreshComplete');
			$ionicLoading.hide();
			$scope.errorMessage = resp.errorMessage;
			$scope.dto = resp.cache;
			$timeout(function(){
				 if(isPushToFrefresh || !firstime){
					 $("#controleDeFaltaView").show();
					 $(".slideUp1").hide();
					 $(".slideUp1").fadeIn(1000);
				 }else{
					 $("#controleDeFaltaView").animate({
						 'top': '20px',
					 }, {duration: 'slow', queue: false}).fadeIn(1000);
					 $("#controleDeFaltaView").removeClass("contentAnimation");
					 firstime = false;
				 }
			},50)
		});
	}
	
	$scope.$on( "$ionicView.beforeEnter", function( scopes, states) {
		if(states.stateName == "menu.controleDeFaltas" ) {
			fetch();
			$rootScope.sideMenuController.canDragContent(true);
			$('.appHeader').addClass("shadowed");
		}
	});
	$scope.fetch = fetch;
	$scope.addFalta = function(cadeiraId){
		ControleDeFaltasService.addFalta(cadeiraId).then(function success(resp) {
			 $mdToast.show(
				      $mdToast.simple()
				        .content('Falta adicionada')
				        .position("bottom right")
				        .hideDelay(500)
				    );
			 $.map($scope.dto.data, function(val) {
				 if(val.cadeira.id == cadeiraId){
					 val.telaFaltasControlePessoal.push(resp);
				 }
			 });
		},function error(resp){
			 $mdToast.show(
			      $mdToast.simple()
			        .content(resp.errorMessage.title + "  " + resp.errorMessage.description)
			        .position("bottom right")
			        .hideDelay(1000)
			    );
		});
	};
	
	$scope.subFalta = function(cadeiraId){
		ControleDeFaltasService.subFalta(cadeiraId).then(function success(resp) {
			 $mdToast.show(
				      $mdToast.simple()
				        .content('Falta removida')
				        .position("bottom right")
				        .hideDelay(500)
				    );
			 $.map($scope.dto.data, function(val) {
				 if(val.cadeira.id == cadeiraId ){
					 val.telaFaltasControlePessoal.pop();
				 }
			 });
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
trigaApp.controller('NotificationsCtrl', function($rootScope,$scope, $mdDialog, $timeout) {
	$scope.formatDate = function(time){
		var notificationDate = new Date();
		notificationDate.setTime(time);
		var todayDate = new Date();
		var isTodayDate = (todayDate.toDateString() === notificationDate.toDateString());
		if(isTodayDate){
			return  zeroFill(notificationDate.getHours(),2) + ':' + zeroFill(notificationDate.getMinutes(),2);
		}else{
			return zeroFill(notificationDate.getDate(),2) + '/' + zeroFill((notificationDate.getMonth() + 1),2)  + '/' +  notificationDate.getFullYear();
		}
	}
	$scope.showAlert = function(ev) {
	    // Appending dialog to document.body to cover sidenav in docs app
	    // Modal dialogs should fully cover application
	    // to prevent interaction outside of dialog
	    $mdDialog.show(
	    		
	      $mdDialog.confirm()
	        .title('Deseja deletar todas as notificações?')
	        .content('Todas as notificações serão removidas para todo o sempre e não pode ser desfeito.')
	        .ariaLabel('Alert Dialog Demo')
	        .ok('Deletar!')
	        .cancel('Deixa pra lá!')
	        .targetEvent(ev)
	    ).then(function() {
	    	window.localStorage.removeItem("storedNotifications");
	    	$timeout(function(){
	    		var notificationListElement = document.getElementById("notificationList");
   			 if(null != notificationListElement){
   				 var storedNotificationsScope = angular.element(notificationListElement).scope();
   					 storedNotificationsScope.$apply(function(){
   						 storedNotificationsScope.storedNotifications = null;
   						 storedNotificationsScope.unsawNotficiations = null;
   					 });
   			 }
			},0)
	    }, function() {
	    	//
	    });;
	  };
	$scope.$on( "$ionicView.beforeEnter", function( scopes, states) {
		if( states.stateName == "menu.notifications" ) {
			$('.appHeader').addClass("shadowed");
//		var fileDir = ionic.Platform.isWebView() ? cordova.file.dataDirectory : "img/";
			var fileDir =  "img/";
//		var fileName = ionic.Platform.isWebView() ? 'institution_small_icon.png': "triga3.jpg"
			var fileName =  "triga3.jpg"
			var targetPath = fileDir + fileName;
			$scope.institutionIcon = targetPath;
			var unsawNotficiations = JSON.parse(window.localStorage.getItem("unsawNotficiations"));
			var storedNotifications = JSON.parse(window.localStorage.getItem("storedNotifications"));
			$timeout(function(){
			$scope.storedNotificationsHeight = $(window).height() -42;
			// if has unsawNotficiations we must save it as a sawed notification.
			if(unsawNotficiations){
				//if there is storedNotifications we must concat then both, otherwise, just put unsawNotficiations
				var AllNotifications = storedNotifications ?  unsawNotficiations.concat(storedNotifications) : unsawNotficiations;
				window.localStorage.setItem("storedNotifications",JSON.stringify(AllNotifications));
			}
			
			window.localStorage.removeItem("unsawNotficiations");
			if(!ionic.Platform.isWebView())
			storedNotifications = [{ title : 'seja bem vindo ao triga', message: 'Se você recebeu essa mensagem significa que seu dispositivo está pronto para receber notificações da instituição.', date: new Date().getTime(), notificaitonType: 'TRIGA'},
			                              { title : 'Não haverá aula', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
			                              { title : 'Não haverá aula', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
			                              { title : 'Não haverá aula', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
			                              { title : 'Não haverá aula', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
			                              { title : 'Não haverá aula', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
			                              { title : 'Não haverá aula', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
			                              { title : 'Não haverá aula', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
			                              { title : 'Não haverá aula', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
			                              { title : 'Não haverá aula', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
			                              { title : 'Não haverá aula', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
			                              { title : 'Não haverá aula', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
			                              { title : 'Não haverá aula', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
			                              { title : 'Não haverá aula', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
			                              { title : 'Não haverá aula', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
			                              { title : 'Não haverá aula', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
			                              { title : 'Não haverá aula', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
			                              { title : 'Não haverá aula', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
			                              { title : 'Não haverá aula', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
			                              { title : 'Não haverá aula', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
			                              { title : 'Não haverá aula', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
			                              { title : 'Não haverá aula', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
			                              { title : 'seja bem vindo ao triga', message: '', date: new Date().getTime(), notificaitonType:'GRADE_NOTIFICATION'}]
			var notificationListElement = document.getElementById("notificationList");
  			 if(null != notificationListElement){
  				 var storedNotificationsScope = angular.element(notificationListElement).scope();
  					 storedNotificationsScope.$apply(function(){
  						 storedNotificationsScope.unsawNotficiations = unsawNotficiations;
  						 storedNotificationsScope.storedNotifications = storedNotifications;
  					 });
  			 }
			
			},0)
			
		};
	});
})

trigaApp.controller('UnsawNotficiationsPopoverCtrl', function($scope, $ionicPopover, $timeout) {
	$timeout(function(){
		$scope.unsawNotficiations = JSON.parse(window.localStorage.getItem("unsawNotficiations")) || [];
		$scope.unsawNotficiationsSize =  $scope.unsawNotficiations.length;
	},1000)
	
	$scope.dto = {top: ionic.Platform.isWebView() ? '35px' : '0px'};
	$ionicPopover.fromTemplateUrl('views/popover.html',{scope:$scope}).then(function(popover) {
		$scope.popover = popover;
  });
	$scope.closePopover = function() {
		    $scope.popover.hide();
	};
	
	$scope.showUnsawNotifications = function(){
		$timeout(function(){
		//here we update unsawNotficiations list
		 var unsawNotficiations =  JSON.parse(window.localStorage.getItem("unsawNotficiations")) || null;
		 var notificationListElement = document.getElementById("notificationList");
		 if(null != notificationListElement && null !=  unsawNotficiations){
			 var unsawNotficiationsScope = angular.element(notificationListElement).scope();
			 unsawNotficiationsScope.$apply(function(){
				 if(unsawNotficiationsScope.unsawNotficiations){
					 unsawNotficiationsScope.unsawNotficiations =  unsawNotficiations.concat(unsawNotficiationsScope.unsawNotficiations);
				 }else{
					 unsawNotficiationsScope.unsawNotficiations =  unsawNotficiations;
				 }
			 });
		 }
		 $scope.unsawNotficiationsSize = 0;
		 window.localStorage.removeItem("unsawNotficiations");
		 var storedNotifications = JSON.parse(window.localStorage.getItem("storedNotifications"));
		 //if there is storedNotifications we must concat then both, otherwise, just put unsawNotficiations
		 var AllNotifications = storedNotifications ?  unsawNotficiations.concat(storedNotifications) : unsawNotficiations;
		 window.localStorage.setItem("storedNotifications",JSON.stringify(AllNotifications));
		},100)
	}
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


trigaApp.controller('MenuCtrl', function($scope) {
	var appConfig = JSON.parse(window.localStorage.getItem("appConfig"));
	$scope.showGrades =  appConfig.studentFuncionalities.funcionalities.indexOf('GRADES') > -1;
	$scope.showscheduleGrid =  appConfig.studentFuncionalities.funcionalities.indexOf('SCHEDULE_GRID') > -1;
	$scope.showfaultsControl =  appConfig.studentFuncionalities.funcionalities.indexOf('FAULTS_CONTROL') > -1;
	$scope.showNotifications =  appConfig.studentFuncionalities.funcionalities.indexOf('NOTIFICATIONS') > -1;
})

function isNotEmpty(obj){
	for(var key in obj) {
		  if(obj.hasOwnProperty(key)) return true
	}
	return false;
}

function zeroFill( number, width )
{
  width -= number.toString().length;
  if ( width > 0 )
  {
    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  }
  return number + ""; // always return a string
}