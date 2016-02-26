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

.controller('HomeCtrl', function($scope, $state, $http, $ionicPopover, $ionicPopup, $ionicPlatform, $location, $ionicHistory, $templateCache, $ionicLoading, $timeout ){
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
	$scope.loading = $ionicLoading.show();
	//removed actual values of access and secrete key 
	var access_key = 'Lg7ywecDYG119uTJrlhLSH6X65qm12BOqCeTt7X2';
	var secrete_key = 'Acf1HHz41AJcGdpDEZUgIlWJ3u3Ik71tzQLRIvB3'; 
	var tonce = Math.round(new Date().getTime()/1000.0); 
	var payload = 'GET|/api/v1/markets|access_key=' + access_key + '&foo=bar&tonce=' + tonce;
	
	//compute signature from the secrete key and payload. ( NB:use HMAC SHA-256 )
	var hashType = 'SHA-256'; 
	var shaObj = new jsSHA(hashType, "TEXT");
	shaObj.setHMACKey(access_key, "TEXT");
	shaObj.update(payload);
	var signature = shaObj.getHMAC("HEX");	
	console.log(signature); 
	
	$scope.data = {
		currency: 'USD', 
		amount: '0.00', 
		err: ''
	};
	//valid request needs three authentication parts : access key, signature, server time stamp(Tonce)
	var request_URL = 'https://bitcoinfundi.com/api/v1/markets?access_key=' + access_key + '&foo=bar&tonce=' + tonce + '&signature=' + signature; 
	
	$http({method: 'GET', url: request_URL, cache: $templateCache}).
		then(function(response) {
			$scope.data.amount = response.data.ticker.buy;
			$scope.status = response.status;
			
		}, function(response) {
			var alertPopup = $ionicPopup.alert({
				title: 'BitcoinFundi Api',
				template: "Returned " + response.status || "Request failed " + response.status
			});	
			$scope.data.currency = 'USD'; 
			$scope.data.amount = response.data.ticker.buy;
			$scope.status = response.status;
		});
	$ionicLoading.hide();
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
	//reload the view to reload the values 
	$scope.reloadData = function(){    
		console.log('Refreshing!');
		
		$timeout( function() {
			//simulate async response
			$http({method: 'GET', url: request_URL, cache: $templateCache}).
			then(function(response) {
				$scope.data.amount = response.data.ticker.buy;
				$scope.status = response.status;
				
			}, function(err) {
				var alertPopup = $ionicPopup.alert({
					title: 'BitcoinFundi Api',
					template: response.data.ticker.buy || "Request failed " + err.status
				});	
				$scope.err = err
			});

			//Stop the ion-refresher from spinning
			$scope.$broadcast('scroll.refreshComplete');
		}, 5000);
	}; 
	
	//data place holders, comment out when GET functional
	
})

.controller('SettingCtrl', function($state, $scope, $ionicPopup, $ionicHistory){
	//controller to manage the settings provided for the user
	$scope.setCurrency = function(){
		//default currency set to USD
		var alertPopup = $ionicPopup.alert({
			title: 'Currency Set',
			template: 'Currency set to default, USD.'
		});
		$ionicHistory.goBack(); 
	};	
})

.controller('InformationCtrl', function($state, $scope){
	
});

