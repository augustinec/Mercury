angular.module('mercury.controllers', ['ionic'])

.controller('AbstractCtrl', function($scope, $ionicSideMenuDelegate){
})

.controller('HomeCtrl', function($scope, $state, $http, $ionicPopover, $ionicPopup, $ionicPlatform, $location, $ionicHistory, $templateCache, $ionicLoading, $timeout ){
	//ensure that the back button or function closes the App
	$ionicPlatform.registerBackButtonAction(function(){
		var path = $location.path(); 
		if($location.path() == "/abstract/home" || $location.path() == "abstract/home"){
			ionic.Platform.exitApp(); //close the application
		}
		else{
			$ionicHistory.goBack(); 
		}
	}, 100);
	
	$scope.data = {
		//variable to set the currency 
		currency: 'USD'
	};
	//valid request needs three authentication parts : access key, signature, server time stamp(Tonce)
	
	//access values and variables 
	var accessKey = "Lg7ywecDYG119uTJrlhLSH6X65qm12BOqCeTt7X2";
	var secrete_key = "Acf1HHz41AJcGdpDEZUgIlWJ3u3Ik71tzQLRIvB3"; 
	var t_stamp = Math.round(new Date().getTime()/1.0); //the tonce ( NB: server time stamp )
	var payload = "GET|/api/v1/markets|access_key=" + accessKey + "&foo=bar&tonce=" + t_stamp;
	
	//compute signature from the secrete key and payload. ( NB:use HMAC SHA-256 )	
	var shaObj = new jsSHA("SHA-256", "TEXT");
	shaObj.setHMACKey(secrete_key, "TEXT");
	shaObj.update(payload);
	var hashOut = shaObj.getHMAC("HEX");	
	
	var request_URL =  "https://bitcoinfundi.com/api/v1/markets?access_key=" + accessKey + "&foo=bar&tonce=" + t_stamp + "&signature=" + hashOut; 
	
	
	$http.get(request_URL).
	then(function(response) {
		console.log('Request successfull');	
		//set the display values 
		$scope.market = {
			buy : response.data, 
			sell : response.data, 
			last : response.data
		}; 
	}, function(err) {
		console.error('ERR', err); 			
	});
	
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
		console.log('Refreshing data !');		
		$timeout( function() {
			//recompute the request
			//access values and variables 
			var accessKey = "Lg7ywecDYG119uTJrlhLSH6X65qm12BOqCeTt7X2";
			var secrete_key = "Acf1HHz41AJcGdpDEZUgIlWJ3u3Ik71tzQLRIvB3"; 
			var t_stamp = Math.round(new Date().getTime()/1.0); //the tonce ( NB: server time stamp )
			var payload = "GET|/api/v1/markets|access_key=" + accessKey + "&foo=bar&tonce=" + t_stamp;

			//compute signature from the secrete key and payload. ( NB:use HMAC SHA-256 )	
			var shaObj = new jsSHA("SHA-256", "TEXT");
			shaObj.setHMACKey(secrete_key, "TEXT");
			shaObj.update(payload);
			var hashOut = shaObj.getHMAC("HEX");	

			var request_URL =  "https://bitcoinfundi.com/api/v1/markets?access_key=" + accessKey + "&foo=bar&tonce=" + t_stamp + "&signature=" + hashOut; 
			$http.get(request_URL).
			then(function(response) {
				console.log('Request successfull');	
				//set the display values
				//use function to format the string JSON.parse(response); 
				$scope.market = {
					buy : response.data.id, 
					sell : response.data, 
					last : response.data
				}; 
				var alertPopup = $ionicPopup.alert({
					title: 'New Prices',
					template: 'Refresh complete.'
				});
				
			}, function(err) {
				console.error('ERR', err); 			
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

