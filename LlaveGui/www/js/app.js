// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
(function() {
	var app = angular.module('starter', ['ionic'])
		.run(function($ionicPlatform) {
  			$ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
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

	app.controller('LoginController', ['$http', function($http){
		var login = this;
		login.verbose = false;
		login.showLogin = true;
		login.showCoger = true;
		login.showDejar = false;
		login.logRequest = {}
		
		login.user = localStorage.getItem("nick");
		login.passwd = localStorage.getItem("passwd");
		login.res = "por saber";
		login.ownerKey = "";

		login.log = function(){
			$http.post('http://gui.uva.es:5584/login/', {
				nick: login.logRequest.nick,
				passwd: login.logRequest.passwd
			}).success(function(data){
				if (data.resultado){
					//alert ("login ok");
					localStorage.setItem("nick", login.logRequest.nick);
					localStorage.setItem("passwd", login.logRequest.passwd);
					login.user = localStorage.getItem("nick");
					login.passwd = localStorage.getItem("passwd");
					login.res = "login ok";
					login.showLogin = false;
					login.whoOwn();
				}
				else{
					alert("usuario o contrase√a erroneos!");
					login.res = "login no ok";
					login.logRequest = {};
				}
			}).error(function(data){
				alert("no tienes conexion");
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
				//alert("entro en 1");
				login.showCoger = false;
				login.showDejar = true;
			}else if (login.ownerKey == "secretaria"){
				//alert("entro en 2");
				login.showCoger = true;
				login.showDejar = false;
			} else {
				//alert("entro en 3");
				login.showCoger = false;
				login.showDejar = false;
			}
		}).error(function(data){
			alert("no tienes conexion");
		});
	};
	
	login.getKey = function() {
		$http.post('http://gui.uva.es:5584/take/', {
			nick: localStorage.getItem("nick"),
			passwd: localStorage.getItem("passwd")
		}).success(function(data){
			if (data.resultado)
				//login.ownerKey = localStorage.getItem("nick");
				login.whoOwn();
			else 
				alert("no puedes coger la llave, la tiene otra persona!!!");
		}).error(function(data){
			alert("no tienes conexion");
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
				alert("no puedes dejar la llave, la tiene otra persona!!!");
		}).error(function(data){
			alert("no tienes conexion");
		});
	};

	if (localStorage.getItem("nick") == null || localStorage.getItem("passwd") == null){ 
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
