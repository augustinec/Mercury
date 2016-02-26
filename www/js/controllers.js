angular.module('mercury.controllers', ['ionic'])

.controller('AppStart', function($scope, $state, $timeout, $ionicLoading, $ionicHistory ){
	//user should not be able to Navigate back to the welcome screen 
	$ionicHistory.nextViewOptions({ 
		disableBack: true
	});
	//use a welcome screen to the application
	$timeout(function(){ 
		$scope.loading = $ionicLoading.show();
		console.log('Application Mecury Fired Up');
	}, 2000);	
	$timeout(function(){ 
		$ionicLoading.hide();		 
		$state.go('abstract.home');
	}, 4000); 	
	//use timer to navigate to the home from the welcome 
})

.controller('AbstractCtrl', function($scope, $ionicSideMenuDelegate){
})

.controller('HomeCtrl', function($scope, $state, $http, $ionicPopover, $ionicPopup, $ionicPlatform, $location, $ionicHistory, $templateCache ){
	//ensure that the back button or function closes the App
	$ionicPlatform.registerBackButtonAction(function(){
		var path = $location.path(); 
		if($location.path() === "/home" || $location.path() === "home"){
			navigator.app.exitApp(); 
		}
		else{
			$ionicHistory.goBack(); 
		}
	}, 100);
	
	//removed actual values of access and secrete key 
	var access_key = 'xxx';
	var secrete_key = 'yyy'; 
	var tonce = Math.round(new Date().getTime()/1000.0); 
	var payload = 'GET|/api/v1/markets|access_key=' + access_key + '&foo=bar&tonce=' + tonce;
	
	//compute signature from the secrete key and payload. ( NB:use HMAC SHA-256 )
	var hashType = 'SHA-256'; 
	var shaObj = new jsSHA(hashType, "TEXT");
	shaObj.setHMACKey(access_key, "TEXT");
	shaObj.update(payload);
	var signature = shaObj.getHMAC("HEX");
	
	
	console.log(signature); 
	
	//valid request needs three authentication parts : access key, signature, server time stamp(Tonce)
	var request_URL = 'https://bitcoinfundi.com/api/v1/markets?access_key=' + access_key + '&foo=bar&tonce=' + tonce + '&signature=' + signature; 
	
	$http({method: 'GET', url: request_URL, cache: $templateCache}).
		then(function(response) {
			$scope.status = response.status;
			$scope.data.amount = response.data.ticker.buy;
		}, function(response) {
			var alertPopup = $ionicPopup.alert({
				title: response.status,
				template: response.data.ticker.last || "Request failed " + response.status
			});			
		});
	/*$http.get('https://docsample.herokuapp.com/jsonSample').then(function(response){
		//'response.data' will contain the result
		//the JSON file returned with response should set the 
		console.log('Successful');
	}, function(err){
		console.error('ERR', err); 
		//err.status will contain the status code
	}); */
	
	//launch the popover for the settings and information link
	$ionicPopover.fromTemplateUrl('popover.html', {
		scope: $scope, 
	}).then(function(popover){
		$scope.popover = popover; 
	});
	
	//move to Info and Set redirect to the popover pages requested 
	$scope.moveToInfo = function(){
		console.log('Redirected to Information Page'); 
		$scope.popover.hide(); 
		$state.go('abstract.information');
	}; 	
	$scope.moveToSet = function(){
		console.log('Redirected to Settings Page'); 
		$scope.popover.hide(); 
		$state.go('abstract.settings');
	}; 
	
	//data place holders, comment out when GET functional
	$scope.data = {
		currency: 'AB', 
		//amount: '0.00'
	}; 
	$scope.data.currency = 'USD'; 
	//$scope.data.amount = 789.00 * 0.666;
})

.controller('SettingCtrl', function($state, $scope){
	//controller to manage the settings provided for the user 
})

.controller('InformationCtrl', function($state, $scope){
	
});

