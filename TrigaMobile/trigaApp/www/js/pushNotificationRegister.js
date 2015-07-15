/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var PushNotificationService;
var isColdStart = false;

var pushNotificationRegister = {
		
    initialize: function(service) {
    	PushNotificationService = service;
    	var pushNotification = window.plugins.pushNotification;
    	var deviceId = window.localStorage.getItem("deviceId");
		if(deviceId == null || deviceId.pass == false ){
			console.log("registering GCM")
			pushNotification.register(pushNotificationRegister.successHandler , pushNotificationRegister.errorHandler ,{senderID:"1019849228712","ecb":"pushNotificationRegister.onNotificationGCM"});
		}else{
			console.log("setting GCM callback")
			pushNotification.setecb(pushNotificationRegister.successHandler , pushNotificationRegister.errorHandler, {senderID:"1019849228712","ecb":"pushNotificationRegister.onNotificationGCM"});
		}
    	
    },
    successHandler: function(result) {
    	console.log("successfull register GCM", JSON.stringify(regiGCM))
    	var regiGCM = { pass : true , content : null};
    	window.localStorage.setItem("regiGCM", JSON.stringify(regiGCM));
    },
    errorHandler:function(error) {
    	var regiGCM = { pass : false , content : JSON.stringify(error)};
    	window.localStorage.setItem("regiGCM", regiGCM);
    	alert(" regiGCM Fail error:" + error);
    },
    onNotificationGCM: function(e) {
    	console.log("notificationReceived", e)
        switch( e.event )
        {
            case 'registered':
            	var newRegistrationId = e.regid;
            	
                if ( newRegistrationId.length > 0 )
                {
                		
                      	PushNotificationService.saveDeviceKeyInServer(newRegistrationId).then(function(resp) {
                      		//store  the id -- deviceId -- generated on the server. 
                      		window.localStorage.setItem("deviceId",JSON.stringify({pass : true , content : resp}));
                      	},function(error){
                      		alert("deviceId fail " + JSON.stringify(error));
                      		window.localStorage.setItem("deviceId", {pass : false , content : error});
                      	});
                }
            break;
            case 'message':
            	// update unsawNotficiations to use on notification screen
            	var unsawNotficiations =  JSON.parse(window.localStorage.getItem("unsawNotficiations")) || [];
            	unsawNotficiations.unshift(e.payload);
            	window.localStorage.setItem("unsawNotficiations", JSON.stringify(unsawNotficiations));
              // this is the actual push notification. its format depends on the data model from the push server
            	 if ( e.coldstart ){
            		 //coldstart means that app was closed and the user opened it by click on notification in notification  bar.
            		 isColdStart = true;
                 }else{
                	//here we update unsawNotficiations global icon
        			 var scope = angular.element($("div[nav-bar='active']").find('#notificationPopover')).scope();
        			 if(scope != null)
    			     scope.$apply(function(){
    			        scope.unsawNotficiations = unsawNotficiations;
    			        scope.unsawNotficiationsSize = unsawNotficiations.length;
    			     });
                 }
//     			}
            break;
 
            case 'error':
              alert('GCM error = '+e.msg);
            break;
 
            default:
              alert('An unknown GCM event has occurred');
              break;
        }
    }
};