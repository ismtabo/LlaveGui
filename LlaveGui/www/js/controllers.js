angular.module('starter.controllers', ['ionic'])

.controller('AppCtrl',['$scope','$ionicModal', '$ionicPopup', '$http' ,function($scope, $ionicModal, $ionicPopup, $http) {
  // // Form data for the login modal
  // $scope.loginData = {};

  // // Create the login modal that we will use later
  // $ionicModal.fromTemplateUrl('templates/login.html', {
  //   scope: $scope
  // }).then(function(modal) {
  //   $scope.modal = modal;
  // });

  // // Triggered in the login modal to close it
  // $scope.closeLogin = function() {
  //   $scope.modal.hide();
  // };

  // // Open the login modal
  // $scope.login = function() {
  //   $scope.modal.show();
  // };

  // // Perform the login action when the user submits the login form
  // $scope.doLogin = function() {
  //   console.log('Doing login', $scope.loginData);

  //   // Simulate a login delay. Remove this and replace with your login
  //   // code if using a login system
  //   $timeout(function() {
  //     $scope.closeLogin();
  //   }, 1000);
  // };

  // $scope.login();

  // $scope.modal = $ionicModal.fromTemplateUrl('templates/login.html', {
  //   scope: $scope
  // })
 	// $ionicModal.fromTemplateUrl('templates/login.html', {
  //   scope: $scope,
  //   animation: 'slide-in-up'
  // }).then(function(modal) {
  //   $scope.modal = modal;
  // 	console.log($scope.modal);
		// if (localStorage.getItem("nick") == "null" ||
  // 		localStorage.getItem("passwd") == "null"){ 
	 //  	$scope.modal.show();
		// }else{
		// 	if (localStorage.getItem("nick") == "" ||
		// 	  		localStorage.getItem("passwd") == ""){ 
		// 	  	$scope.modal.show();
		// 	 }else{
		// 	 	console.log("nick:")
		// 	 	console.log(localStorage.getItem("nick"));
		// 	 	console.log("passwd:")
		// 	 	console.log(localStorage.getItem("passwd"));
		// 	 	console.log("todo ok");

		//   	// $scope.modal.hide();
	 //  	}
		// }
  // });

  $ionicModal.fromTemplate("templates/login.html", function($ionicModal) {
        $scope.modal = $ionicModal;
    }, {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope,
        // The animation we want to use for the modal entrance
        animation: 'slide-in-up'
    });

	$scope.verbose = true;
  $scope.logRequest = {}
	$scope.user = localStorage.getItem("nick");
	$scope.passwd = localStorage.getItem("passwd");
	$scope.res = "por saber";
	$scope.loged = !(localStorage.getItem("nick") == "null" ||
	  		localStorage.getItem("passwd") == "null" || localStorage.getItem("nick") == "" ||
			  		localStorage.getItem("passwd") == "");
	console.log("is loged",$scope.loged);

	$scope.log = function(){
		$http.post('http://gui.uva.es:5584/login/', {
			nick: $scope.logRequest.nick,
			passwd: $scope.logRequest.passwd
		}).success(function(data){
			if (data.resultado){
				console.log("[INFO] login ok");
				localStorage.setItem("nick", $scope.logRequest.nick);
				localStorage.setItem("passwd", $scope.logRequest.passwd);
				$scope.user = localStorage.getItem("nick");
				$scope.passwd = localStorage.getItem("passwd");
				$scope.res = "login ok";
				$scope.modal.hide();
				$scope.loged = true;
			}
			else{
				$scope.showAlert("usuario o contraseña erroneos!");
				$scope.res = "login no ok";
				$scope.logRequest = {};
			}
		}).error(function(data){
			$scope.showAlert("no tienes conexion");
			$scope.res = "peticion no ok";
		});
	};

  $scope.back = function () {
  	$scope.loged = false;
  	$scope.modal.show();
  	localStorage.removeItem("nick");
  	localStorage.removeItem("passwd");
  	$scope.nick = "";
  	$scope.passwd = "";
  	$scope.logRequest = {};
  };

  $scope.showAlert = function(message) {
			var alertPopup = $ionicPopup.alert({
				title: 'Error',
				template: message
			});
			alertPopup.then(function(res) {
				console.log('[ERROR] ' + message);
			});
		};

	$scope.showLog = function(argument) {
		$scope.modal.show();
	}

}])

.controller('KeyCtrl',['$scope', '$ionicPopup', '$http', function ($scope,$ionicPopup,$http) {

	$scope.ownerKey = "";
	$scope.tagContent = [{
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
	$scope.tagSet = 0;

	$scope.isSet = function (tag) {
		return tag === $scope.tagSet;
	};

	$scope.setTag = function(tag) {
		console.log("state = " + tag);
		$http.post('http://gui.uva.es:5584/state/', {
			nick: localStorage.getItem("nick"),
			passwd: localStorage.getItem("passwd"),
			estado: tag
		}).success(function(data){
			if (data.resultado) {
				$scope.whoOwn();
			} else {
				$scope.showAlert("no tienes la llave!!!");
				$scope.whoOwn();
			}
			}).error(function(data){
				$scope.showCogerHideDejar = null;
				$scope.ownewKey = "Sin conexion, intentalo de nuevo mas tarde";
			});
	};

	$scope.getTagFormat = function(){
		if ($scope.ownerKey === "secretaria") return "";
		if ($scope.tagSet === 0 || $scope.tagSet === 1)
			return ("que esta en la " + $scope.tagContent[$scope.tagSet].name);
		if ($scope.tagSet === 2 || $scope.tagSet === 3)
			return ("que esta en el " + $scope.tagContent[$scope.tagSet].name);
		if ($scope.tagSet === 5)
			return ("que esta en " + $scope.tagContent[$scope.tagSet].name);
		return ("que esta " + $scope.tagContent[$scope.tagSet].name);
	};


	$scope.whoOwn = function() {
		console.log("looking for the answer");
  	$http.post('http://gui.uva.es:5584/who/', {
  		nick: localStorage.getItem("nick"),
  		passwd: localStorage.getItem("passwd")
  	}).success(function(data){
  		console.log("succes en who con data = " + data);
  		$scope.ownerKey = data.nick;
  		if ($scope.ownerKey == localStorage.getItem("nick")){
  			console.log("[INFO] entro en 1");
  			$scope.showCogerHideDejar = false;
  		}else if ($scope.ownerKey == "secretaria"){
  			console.log("[INFO] entro en 2");
  			$scope.showCogerHideDejar = true;
  		}else{
  			console.log("[INFO] entro en 3");
  			$scope.showCogerHideDejar = null;
  		}
  		$scope.tagSet = data.estado;
  		$scope.getTagFormat();
  	}).error(function(data){
  		$scope.showCogerHideDejar = null;
  		$scope.ownewKey = "Sin conexion, intentalo de nuevo mas tarde";
  		//$scope.showAlert("no tienes conexion");
  	}).finally(function() {
  		// Stop the ion-refresher from spinning
  		$scope.$broadcast('scroll.refreshComplete');
  	});
  };
  
  $scope.getKey = function() {
  	$http.post('http://gui.uva.es:5584/take/', {
  		nick: localStorage.getItem("nick"),
  		passwd: localStorage.getItem("passwd")
  	}).success(function(data){
  		if (data.resultado) {
  			$scope.whoOwn();
  		} else {
  			$scope.showAlert("no puedes coger la llave, la tiene otra persona!!!");
  			$scope.whoOwn();
  		}
  	}).error(function(data){
  		$scope.showCogerHideDejar = null;
  		$scope.ownewKey = "Sin conexion, intentalo de nuevo mas tarde";
  	});
  };

  $scope.unGetKey = function() {
  	$http.post('http://gui.uva.es:5584/drop/', {
  		nick: localStorage.getItem("nick"),
  		passwd: localStorage.getItem("passwd")
  	}).success(function(data){
  		if (!data.resultado)
  			$scope.showAlert("no puedes dejar la llave, la tiene otra persona!!!");
  		$scope.whoOwn();
  	}).error(function(data){
  		$scope.showCogerHideDejar = null;
  		$scope.ownewKey = "Sin conexion, intentalo de nuevo mas tarde";
  		//$scope.showAlert("no tienes conexion");
  	});
  };

	$scope.showAlert = function(message) {
			var alertPopup = $ionicPopup.alert({
				title: 'Error',
				template: message
			});
			alertPopup.then(function(res) {
				console.log('[ERROR] ' + message);
			});
		};
		$scope.$on("$ionicView.enter", function () {
			$scope.loged = !(localStorage.getItem("nick") == "null" ||
	  		localStorage.getItem("passwd") == "null" || localStorage.getItem("nick") == "" ||
			  		localStorage.getItem("passwd") == "");
			if ($scope.logued){ 
				$scope.whoOwn();
			}else{
				$scope.showLog();
			}
		});

}]);
