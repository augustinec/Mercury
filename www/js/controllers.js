angular.module('mercury.controllers', ['ionic', 'highcharts-ng'])

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
	
	$scope.result = '';
	//the request string to the API 
	var request_URL = "https://bitcoinfundi.com/api/v1/tickers"; 
	
	$http.get(request_URL).
	then(function(response) {
		console.log('Request successfull');	
		//set the display values   
		$scope.result = response.data.btcusd.ticker;  
		//console.log($scope.result);
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
	
	$scope.moveToCalc = function(){
		console.log('Redirected to Calculator');
		$scope.popover.hide(); 
		$state.go('abstract.calculator'); 
	};
	
	//reload the view to reload the values 
	$scope.reloadData = function(){    
		console.log('Refreshing data !');		
		$timeout( function() {
			//make a new request to check the price 
			var request_URL = "https://bitcoinfundi.com/api/v1/tickers";
			$http.get(request_URL).
			then(function(response) {
				console.log('Request successfull');	
				$scope.result = response.data.btcusd.ticker;  
				//console.log($scope.result);
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
	//populate the graph
	$scope.chartConfig = {
        options: {
            chart: {
                type: 'area',
				backgroundColor: {
					 linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
					 stops: [
						[0, '#595959'],
						[1, '#3e3e40']
					 ]
				  }
            },
			plotOptions: {
				area: {
					marker: {
						enabled: false,
						symbol: 'circle',
						radius: 2,
						states: {
							hover: {
								enabled: true
							}
						}
					}
				}
			},
        },
		
        series: [{
			name: 'USD',  
            data: [10, 10, 10.1, 10.5, 10, 9]
        }],
        title: {
            text: '1BTC = USD 7', 
			
        },
		yAxis: {
			gridLineWidth: 0, 
			labels: {
				enabled: false
			}, 
			title: {
				text: "price (USD)"
			}
		},
				
        loading: false
    }
	
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
	
})

.controller('CalculatorCtrl', function($state, $scope){
	//a function set to monitor the change in the dollar value and affect the coins
	$scope.$watch('dolla', function(newValue,oldValue){
        if(newValue != oldValue){
            $scope.changeDollar();
        }
    });
	
	$scope.calculate = function(){
		var price = 0.0;  
		var coins = 0.0; 
		var dolla =  0.0;
		//allocate the variables 
		price = $scope.price; 
		coins = $scope.coins; 
		dolla = $scope.dolla; 
		
		if(price > 0 && coins > 0){
			$scope.dolla = ($scope.coins * $scope.price);
		}
	};	    
    
    $scope.changeDollar = function(){
        var price = 0;
        var dolla = 0;
        
        price = $scope.price;
        dolla = $scope.dolla;
		if(price > 0)
			$scope.coins  = (dolla / price);       
    }
});

