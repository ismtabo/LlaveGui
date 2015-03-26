// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving
// Angular modules
// 'starter' is the name of this angular module example (also set in a <body>
// attribute in index.html)
// the 2nd parameter is an array of 'requires'
(function() {
	var app = angular.module('starter', ['ionic'])
		.run(function($ionicPlatform) {
  			$ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar
    // above the keyboard
    // for form inputs)
    		if(window.cordova && window.cordova.plugins.Keyboard) {
    			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    		}
    		if(window.StatusBar) {
      			StatusBar.styleDefault();
    		}
  			});
		});

	app.config(function($httpProvider) {
		$httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
	});

	app.controller('LoginController', ['$scope', '$http', '$ionicPopup', function($scope, $http, $ionicPopup){
		var login = this;
		login.verbose = false;
		login.showLogin = true;
		login.showCogerHideDejar = true;
		login.logRequest = {}
		
		login.user = localStorage.getItem("nick");
		login.passwd = localStorage.getItem("passwd");
		login.res = "por saber";
		login.ownerKey = "";

		login.tagContent = [{
			name:"sede",
			indice:0},{
			name:"cafeteria",
			indice:1},{
			name:"servicio",
			indice:2},{
			name:"laboratio general",
			indice:3},{
			name:"abajo en la puerta fumando",
			indice:4},{
			name:"otro lugar",
			indice:5}];
		login.tagSet = 0;
		login.isSet = function (tag) {
			return tag === login.tagSet;
		};

		login.setTag = function(tag) {
			console.log("state = " + tag);
			$http.post('http://gui.uva.es:5584/state/', {
				nick: localStorage.getItem("nick"),
				passwd: localStorage.getItem("passwd"),
				estado: tag
			}).success(function(data){
				if (data.resultado) {
					login.whoOwn();
				} else {
					login.showAlert("no tienes la llave!!!");
					login.whoOwn();
				}
				}).error(function(data){
					login.showCogerHideDejar = null;
					login.ownewKey = "Sin conexion, intentalo de nuevo mas tarde";
				});
		};

		login.getTagFormat = function(){
			if (login.ownerKey === "secretaria") return "";
			if (login.tagSet === 0 || login.tagSet === 1)
				return ("que esta en la " + login.tagContent[login.tagSet].name);
			if (login.tagSet === 2 || login.tagSet === 3)
				return ("que esta en el " + login.tagContent[login.tagSet].name);
			if (login.tagSet === 5)
				return ("que esta en " + login.tagContent[login.tagSet].name);
			return ("que esta " + login.tagContent[login.tagSet].name);
		};
		
		login.showAlert = function(message) {
			var alertPopup = $ionicPopup.alert({
				title: 'Error',
				template: message
			});
			alertPopup.then(function(res) {
				console.log('[ERROR] ' + message);
			});
		};

		//TODO refactor http functions to get and set tag

		login.log = function(){
			$http.post('http://gui.uva.es:5584/login/', {
				nick: login.logRequest.nick,
				passwd: login.logRequest.passwd
			}).success(function(data){
				if (data.resultado){
					console.log("[INFO] login ok");
					localStorage.setItem("nick", login.logRequest.nick);
					localStorage.setItem("passwd", login.logRequest.passwd);
					login.user = localStorage.getItem("nick");
					login.passwd = localStorage.getItem("passwd");
					login.res = "login ok";
					login.showLogin = false;
					login.whoOwn();
				}
				else{
					login.showAlert("usuario o contraseña erroneos!");
					login.res = "login no ok";
					login.logRequest = {};
				}
			}).error(function(data){
				login.showAlert("no tienes conexion");
				login.res = "peticion no ok";
			});
		};
	
	login.back = function () {
		login.showLogin = true;
		localStorage.removeItem("nick");
		localStorage.removeItem("passwd");
		login.nick = "";
		login.passwd = "";
		login.logRequest = {};
	};

	login.whoOwn = function() {
		$http.post('http://gui.uva.es:5584/who/', {
			nick: localStorage.getItem("nick"),
			passwd: localStorage.getItem("passwd")
		}).success(function(data){
			console.log("succes en who con data = " + data);
			login.ownerKey = data.nick;
			if (login.ownerKey == localStorage.getItem("nick")){
				console.log("[INFO] entro en 1");
				login.showCogerHideDejar = false;
			}else if (login.ownerKey == "secretaria"){
				console.log("[INFO] entro en 2");
				login.showCogerHideDejar = true;
			}else{
				console.log("[INFO] entro en 3");
				login.showCogerHideDejar = null;
			}
			login.tagSet = data.estado;
			login.getTagFormat();
		}).error(function(data){
			login.showCogerHideDejar = null;
			login.ownewKey = "Sin conexion, intentalo de nuevo mas tarde";
			//login.showAlert("no tienes conexion");
		}).finally(function() {
			// Stop the ion-refresher from spinning
			$scope.$broadcast('scroll.refreshComplete');
		});
	};
	
	login.getKey = function() {
		$http.post('http://gui.uva.es:5584/take/', {
			nick: localStorage.getItem("nick"),
			passwd: localStorage.getItem("passwd")
		}).success(function(data){
			if (data.resultado) {
				login.whoOwn();
			} else {
				login.showAlert("no puedes coger la llave, la tiene otra persona!!!");
				login.whoOwn();
			}
		}).error(function(data){
			login.showCogerHideDejar = null;
			login.ownewKey = "Sin conexion, intentalo de nuevo mas tarde";
		});
	};

	login.unGetKey = function() {
		$http.post('http://gui.uva.es:5584/drop/', {
			nick: localStorage.getItem("nick"),
			passwd: localStorage.getItem("passwd")
		}).success(function(data){
			if (!data.resultado)
				login.showAlert("no puedes dejar la llave, la tiene otra persona!!!");
			login.whoOwn();
		}).error(function(data){
			login.showCogerHideDejar = null;
			login.ownewKey = "Sin conexion, intentalo de nuevo mas tarde";
			//login.showAlert("no tienes conexion");
		});
	};

	if (localStorage.getItem("nick") == null ||
			localStorage.getItem("passwd") == null){ 
		login.showLogin = true;
	}else{
		login.showLogin = false;
		login.whoOwn();
	}	

	//login.whoOwn();


	}]);

	//app.controller('LoginFormController', function(){
		//this.logRequest = {}

})();
