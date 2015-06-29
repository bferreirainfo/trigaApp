'use strict';
var devLocalUrl = "http://192.168.1.4:8080/trigaportal/trigaMobile/aluno/"
var devWebUrl= "http://trigaportal-trigaserver.rhcloud.com/trigaMobile/aluno/"
var isLocal = false;
var apiUrl = isLocal ? devLocalUrl : devWebUrl;

var timeoutError = -2;
var noConnectionError = -1;

//trigaApp.factory("TrigaPortalWS", functi on ($resource,$rootScope) {
//    return $resource(
//        'http://trigaportal-trigaserver.rhcloud.com/trigaMobile/aluno/:action?alunoId=:alunoId&instituicao=:instituicao', { action: "notas", alunoId: '10', instituicao: 'alquimia'}, {
//        update: {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
//            method: 'PUT'
//        },
//        get: {
//            method: 'GET',
//            // This is what I tried.
//            interceptor: {
//                response: function (resp) {
//                    return resp.data;
//                },
//                responseError: function (err) {
//                    console.log('error in interceptor', err);
//                }
//            },
//            isArray: true
//        }
//    }
//
//    );
//});
/* Services */

trigaApp.service('PushNotificationService', function($q,$resource) {
    return {
    	saveDeviceKeyInServer: function(devicePushNotificationKey) {
    		var studentId = JSON.parse(window.localStorage.getItem("studentPerfil")).id;
    		var institutionName = JSON.parse(window.localStorage.getItem("appConfig")).instituionName;
    		var regResource = $resource(apiUrl+ ':action?studentId=:studentId&institution=:institution&devicePushNotificationKey=:devicePushNotificationKey&deviceUUID=:deviceUUID&deviceModel=:deviceModel&devicePlatform=:devicePlatform&deviceVersion=:deviceVersion',
    								   { action: "saveDeviceKey", studentId: studentId,  institution: institutionName, devicePushNotificationKey : devicePushNotificationKey, deviceUUID : device.uuid, deviceModel : device.model , devicePlatform: device.platform, deviceVersion: device.version }, { 'get':  {method: 'GET', isArray : false} });
            var q = $q.defer();
            regResource.get(function(resp) {
            	removePromiseProperties(resp);
                q.resolve(resp);
            }, function(err) { 
                q.reject(err);
            })
            return q.promise;
        },	
        updateDeviceKeyInServer: function(deviceId,deviceKey) {
        	var updateResource = $resource(apiUrl+':action?alunoId=:alunoId&instituicao=:instituicao&deviceKey=:deviceKey',
        								  {action:"updateDeviceKey",alunoId: 19,instituicao:"padrao", 'deviceKey':deviceKey }, { 'get':  {method: 'GET', isArray : false} });
        	var q = $q.defer();
        	updateResource.get(function(resp) {
        		q.resolve(resp);
        	}, function(err) { 
        		q.reject(err);
        	})
        	return q.promise;
        }
    }
})


trigaApp.service('NotasService', function($q,$resource) {
	 return {
	        TodasNotas: function(studentId) {
	    		var regResource = $resource(apiUrl+':action?alunoId=:alunoId&institution=:institution', 
	    								   {action: "notas", alunoId: studentId, institution: JSON.parse(window.localStorage.getItem("appConfig")).instituionName},{ 'get':  {method: 'GET', timeout: 2000} });
	            var q = $q.defer();
	            fecthData(q,regResource, 'get',"grades");
	            return q.promise;
	        }
	 	}
})

trigaApp.service('ControleDeFaltasService', function($q,$resource) {
	return {
		findAll: function() {
			var q = $q.defer();
			var studentId = JSON.parse(window.localStorage.getItem("studentPerfil")).id;
    		var institutionName = JSON.parse(window.localStorage.getItem("appConfig")).instituionName;
			var faltasResource = $resource(apiUrl+':action?studentId=:studentId&institution=:institution',
										  {action: "faltas" , studentId: studentId, institution: institutionName}, { 'get':  {method: 'GET', timeout: 2000} });
			fecthData(q,faltasResource, 'get',"faults");
			return q.promise;
		},
		addFalta: function(cadeiraId) {
			var studentId = JSON.parse(window.localStorage.getItem("studentPerfil")).id;
    		var institutionName = JSON.parse(window.localStorage.getItem("appConfig")).instituionName;
			var addFaltaResource = $resource(apiUrl +':action?studentId=:studentId&institution=:institution&cadeiraId=:cadeiraId',{ action: "addFalta", studentId: studentId,  institution: institutionName, cadeiraId : cadeiraId}, { 'get':  {method: 'GET', timeout: 20000} });
			var q = $q.defer();
			fecthData(q,addFaltaResource, 'get');
			return q.promise;
		},
		subFalta: function(cadeiraId) {
			var studentId = JSON.parse(window.localStorage.getItem("studentPerfil")).id;
    		var institutionName = JSON.parse(window.localStorage.getItem("appConfig")).instituionName;
			var subFaltaResource = $resource(apiUrl +':action?studentId=:studentId&institution=:institution&cadeiraId=:cadeiraId',{ action: "subFalta", studentId: studentId,  institution: institutionName, cadeiraId : cadeiraId}, { 'get':  {method: 'GET', timeout: 20000} });
			var q = $q.defer();
			fecthData(q,subFaltaResource, 'get');
			return q.promise;
		}
	}
})

trigaApp.service('QuadroDeHorarioSevice', function($q,$resource) {
	return {
		obterQuadroDeHorario: function(studentId) {
			var quadroDeHorarioResource = $resource(apiUrl+':action?alunoId=:studentId&institution=:institution',
												   { action: "quadroDeHorario" , studentId: studentId, institution: JSON.parse(window.localStorage.getItem("appConfig")).instituionName}, { 'get':  {method: 'GET', timeout: 2000} });
			var q = $q.defer();
			fecthData(q,quadroDeHorarioResource, 'get',"scheduleGrid");
			return q.promise;
		}
		
	}
})

trigaApp.service('UserPerfilService', function($q,$resource) {
	return {
		getPerfil: function(studentId) {
			var resource = $resource(apiUrl+':action?studentId='+studentId+'&instituicao=alquimia',{ action: "perfil"}, { 'get':  {method: 'GET'} });
			var q = $q.defer();
			resource.get(
					function(resp) {
						removePromiseProperties(resp);
						q.resolve(resp);
					}, 
					function(err) { 
						q.reject(err);
					});
			return q.promise;
		}
	
	}
})

trigaApp.service('LoginService', function($q,$resource) {
	return {
		login: function(username, password,institutionName) {
			var resource = $resource(apiUrl+':action?username=:username&password=:password&institution=:institution',{ action: "login", username: username, password : password, institution: institutionName }, { get:  {method: 'GET'} });
			var q = $q.defer();
			fecthData(q,resource, 'get',"login");
			return q.promise;
		},
	}
})

trigaApp.service('productService', function() {
  var productList = [];

  var addProduct = function(newObj) {
      productList.push(newObj);
  }

  var getProducts = function(){
      return productList;
  }

  return {
    addProduct: addProduct,
    getProducts: getProducts
  };

});

function isCacheExpired(serviceName){
	var expired = false;
	var lastTime = lastTimeCached[serviceName];
	if(lastTime){
		
		var diff = new Date() -  lastTime;
		var minutes = Math.floor((diff/20000)/60);
		if( minutes >= 1){
			expired = true;
		}
		
	}else {
		expired = true;
	}
	return expired;
}

function fecthData(qDefered,resource,methodName,storageKey, tries){
	if(connectionStatus()){
		var isFirstTime = tries == null;
		isFirstTime ? tries = 1 : tries++;
		//this method above tries to fetch the data based on the resource and methodName
		resource[methodName](function(resp) {
	    	removePromiseProperties(resp);
	    	console.log("RESPONSE " + JSON.stringify(resp));
	    	if(resp.status != null){
	    		if(storageKey){
	    			resp.lastUpdateDate = new Date();
	    			window.localStorage.setItem(storageKey, JSON.stringify(resp));
	    		}
	    		qDefered.resolve(resp);
	    	}else if(tries == 10){
	    			var err = {cache : null, status: null, errorMessage: null};
	    			if(storageKey)
	    			err.cache = JSON.parse(window.localStorage.getItem(storageKey));
	    			err.status = noConnectionError;
	    			err.errorMessage = {title: "Não foi possível conectar" , description: "Verifique sua conexão e tente novamente.", lastU0pdateDate: err.cache ? err.cache.lastUpdateDate : "nunca atualizado"};
	    			qDefered.reject(err);
    		}else{
    			fecthData(qDefered,resource,methodName,storageKey,tries);
    		}
	    }, function(err) {
	    	var isTimeOutError = err.status == 0 && err.data == null;
	    	if(isTimeOutError){
	    		console.log("THE TRIES THO,THE TRIES..." + tries)
	    		if(tries == 10){
	    			if(storageKey)
	    			err.cache = JSON.parse(window.localStorage.getItem(storageKey));
	    			err.status = timeoutError;
	    			err.errorMessage = {title: "Demora na resposta" , description: "Tente novamente mais tarde.", lastUpdateDate: err.cache ? err.cache.lastUpdateDate : "nunca atualizado"};
	    			qDefered.reject(err);
	    		}else{
	    			fecthData(qDefered,resource,methodName,storageKey,tries);
	    		}
	    	}
	    })
	}else{
		var err = {cache : null, status: null, errorMessage: null};
		err.cache = JSON.parse(window.localStorage.getItem(storageKey));
		err.status = noConnectionError;
		err.errorMessage = {title: "Sem conexão com a internet" , description: "Verifique se ah uma conexão válida e tente novamente.", lastUpdateDate: err.cache ? err.cache.lastUpdateDate : "nunca atualizado"};
		qDefered.reject(err);
	}
}

function removePromiseProperties(resp){
	var promise = "$promise";
	var resolved = "$resolved";
	resp["$promise"] = null;
	resp["$resolved"] = null;
	delete resp["$promise"];
	delete resp["$resolved"];
}
function connectionStatus(){
	if(ionic.Platform.isWebView()){
		 var networkState = navigator.connection.type;
		 var states = {};
	    states[Connection.UNKNOWN]  = 'Unknown connection';
	    states[Connection.ETHERNET] = 'Ethernet connection';
	    states[Connection.WIFI]     = 'WiFi connection';
	    states[Connection.CELL_2G]  = 'Cell 2G connection';
	    states[Connection.CELL_3G]  = 'Cell 3G connection';
	    states[Connection.CELL_4G]  = 'Cell 4G connection';
	    states[Connection.CELL]     = 'Cell generic connection';
	    states[Connection.NONE]     = 'No network connection';
	    
	    return states[networkState] != 'No network connection';
	 }else{
		 return true;
	 }
}

function objToString (obj) {
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += obj[p];
        }
    }
    return str;
}