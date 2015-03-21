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
		login.showLogin = true;
		login.logRequest = {}
		
		login.user = localStorage.getItem("nick");
		login.passwd = localStorage.getItem("passwd");
		login.res = "por saber";

		login.log = function(){
			$http.post('http://localhost:3434/login/', {
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
				}
				else{
					//alert("login no ok");
					login.res = "login no ok";
					login.logRequest = {};
				}
			}).error(function(data){
				//alert("peticion no ok");
				login.res = "peticion no ok";
			});
		};

	if (localStorage.getItem("nick") == null || localStorage.getItem("passwd") == null){ 
		login.showLogin = true;
	}else{
		login.showLogin = true;
	}	

	}]);

	//app.controller('LoginFormController', function(){
		//this.logRequest = {}

})();
