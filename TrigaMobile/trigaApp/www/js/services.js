'use strict';
var devLocalUrl = "http://192.168.1.4:8080/trigaportal/trigaMobile/aluno/"
var devWebUrl= "http://trigaportal-trigaserver.rhcloud.com/trigaMobile/aluno/"
var isLocal = false;
var apiUrl = isLocal ? devLocalUrl : devWebUrl;

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
var lastTimeCached = {};

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
	    								   {action: "notas", alunoId: studentId, institution: JSON.parse(window.localStorage.getItem("appConfig")).instituionName},{ 'get':  {method: 'GET', isArray : true} });
	            var q = $q.defer();
	            regResource.get(function(resp) {
	            	removePromiseProperties(resp);
	                q.resolve(resp);
	            }, function(err) { 
	                q.reject(err);
	            })
	            return q.promise;
	        }
	 	}
})

trigaApp.service('ControleDeFaltasService', function($q,$resource) {
	return {
		findAll: function() {
			var q = $q.defer();
			//fixme cache!!!!
			if(isCacheExpired("ControleDeFaltasService") || true){
				var studentId = JSON.parse(window.localStorage.getItem("studentPerfil")).id;
	    		var institutionName = JSON.parse(window.localStorage.getItem("appConfig")).instituionName;
				var faltasResource = $resource(apiUrl+':action?studentId=:studentId&institution=:institution',
											  {action: "faltas" , studentId: studentId, institution: institutionName}, { 'get':  {method: 'GET', isArray : true} });
				faltasResource.get(function(resp) {
					removePromiseProperties(resp);
					var lastTimeCachedDate = new Date();
					lastTimeCached["ControleDeFaltasService"] = lastTimeCachedDate;
					var response = { faults : resp, isUpdated : true , lastUpdateDate : lastTimeCachedDate};
					window.localStorage.setItem("faults", JSON.stringify(response));
					console.log(JSON.stringify(response))
					q.resolve(response);
					
				}, function(err) { 
					console.log("error retrive faults: "+ JSON.stringify(resp));
					var response = JSON.parse(window.localStorage.getItem("faults"));
					response.isUpdated = false;
					q.reject(response);
					
				});
				
			}else{
				//cache
				q.resolve(JSON.parse(window.localStorage.getItem("faults")));
			}
			return q.promise;
		},
		addFalta: function(cadeiraId) {
			var studentId = JSON.parse(window.localStorage.getItem("studentPerfil")).id;
    		var institutionName = JSON.parse(window.localStorage.getItem("appConfig")).instituionName;
			var addFaltaResource = $resource(apiUrl +':action?studentId=:studentId&institution=:institution&cadeiraId=:cadeiraId',{ action: "addFalta", studentId: studentId,  institution: institutionName, cadeiraId : cadeiraId}, { 'get':  {method: 'GET', isArray : false} });
			var q = $q.defer();
			addFaltaResource.get(function(resp) {
				q.resolve(resp);
			}, function(err) { 
				q.reject(err);
			})
			return q.promise;
		},
		subFalta: function(cadeiraId) {
			var studentId = JSON.parse(window.localStorage.getItem("studentPerfil")).id;
    		var institutionName = JSON.parse(window.localStorage.getItem("appConfig")).instituionName;
			var subFaltaResource = $resource(apiUrl +':action?studentId=:studentId&institution=:institution&cadeiraId=:cadeiraId',{ action: "subFalta", studentId: studentId,  institution: institutionName, cadeiraId : cadeiraId}, { 'get':  {method: 'GET', isArray : false} });
			var q = $q.defer();
			subFaltaResource.get(function(resp) {
				q.resolve(resp);
			}, function(err) { 
				q.reject(err);
			})
			return q.promise;
		}
	}
})



trigaApp.service('QuadroDeHorarioSevice', function($q,$resource) {
	return {
		obterQuadroDeHorario: function(studentId) {
			var quadroDeHorarioResource = $resource(apiUrl+':action?alunoId=:studentId&institution=:institution',
												   { action: "quadroDeHorario" , studentId: studentId, institution: JSON.parse(window.localStorage.getItem("appConfig")).instituionName}, { 'get':  {method: 'GET'} });
			var q = $q.defer();
			quadroDeHorarioResource.get(
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
	var institutionName = "";
	return {
		login: function(username, password) {
			var resource = $resource(apiUrl+':action?username=:username&password=:password&institution=:institution',{ action: "login", username: username, password : password, institution: institutionName }, { get:  {method: 'GET'} });
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
		},
		getInstitution : function(){
			return institutionName;
		},
		setInstitution : function(newName){
			institutionName = newName;
		}
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
		var minutes = Math.floor((diff/1000)/60);
		if( minutes >= 1){
			expired = true;
		}
		
	}else {
		expired = true;
	}
	return expired;
}



function removePromiseProperties(resp){
	var promise = "$promise";
	var resolved = "$resolved";
	resp["$promise"] = null;
	resp["$resolved"] = null;
	delete resp["$promise"];
	delete resp["$resolved"];
}
