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

	app.controller('LoginController', ['$http', '$ionicPopup', function($http, $ionicPopup){
		var login = this;
		login.verbose = false;
		login.showLogin = true;
		login.showCogerHideDejar = true;
		login.logRequest = {}
		
		login.user = localStorage.getItem("nick");
		login.passwd = localStorage.getItem("passwd");
		login.res = "por saber";
		login.ownerKey = "";
		
		login.showAlert = function(message) {
			var alertPopup = $ionicPopup.alert({
				title: 'Error',
				template: message
			});
			alertPopup.then(function(res) {
				console.log('[ERROR] ' + message);
			});
		};

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
	};

	login.whoOwn = function() {
		$http.post('http://gui.uva.es:5584/who/', {
			nick: localStorage.getItem("nick"),
			passwd: localStorage.getItem("passwd")
		}).success(function(data){
			login.ownerKey = data.nick;
			if (login.ownerKey == localStorage.getItem("nick")){
				console.log("[INFO] entro en 1");
				login.showCogerHideDejar = false;
			}else if (login.ownerKey == "secretaria"){
				console.log("[INFO] entro en 2");
				login.showCogerHideDejar = true;
			}
		}).error(function(data){
			login.showAlert("no tienes conexion");
		});
	};
	
	login.getKey = function() {
		$http.post('http://gui.uva.es:5584/take/', {
			nick: localStorage.getItem("nick"),
			passwd: localStorage.getItem("passwd")
		}).success(function(data){
			if (data.resultado) {
				//login.ownerKey = localStorage.getItem("nick");
				login.whoOwn();
			} else {
				login.showAlert("no puedes coger la llave, la tiene otra persona!!!");
				login.whoOwn();
			}
		}).error(function(data){
			login.showAlert("no tienes conexion");
		});
	};

	login.unGetKey = function() {
		$http.post('http://gui.uva.es:5584/drop/', {
			nick: localStorage.getItem("nick"),
			passwd: localStorage.getItem("passwd")
		}).success(function(data){
			if (data.resultado)
				login.whoOwn();
			else 
				login.showAlert("no puedes dejar la llave, la tiene otra persona!!!");
		}).error(function(data){
			login.showAlert("no tienes conexion");
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
