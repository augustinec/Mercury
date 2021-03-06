// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('mercury', ['ionic', 'mercury.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider){
	//the following states manage each view state for the script pages
	$stateProvider
		
	.state('abstract', {
		url: '/abstract',
		templateUrl: 'abstract.html', 
		abstract: true, 
		controller: 'AbstractCtrl'
	})
	
	.state('abstract.home', {
		url: '/home', 
		views: {
			'abstract': {
				templateUrl: 'home.html', 
				controller: 'HomeCtrl'
			}
		}
	})
	
	//an abstract state to template structure of the App views 
	.state('abstract.settings', {
		url: '/settings',
		views: {
			'abstract': {
				templateUrl: 'settings.html',
				controller: 'SettingCtrl'
			}
		}
	})
	
	.state('abstract.information', {
		url: '/information', 
		views: {
			'abstract': {
				templateUrl: 'information.html', 
				controller: 'InformationCtrl'
			}
		}
	})
	
	.state('abstract.calculator', {
		url: '/calculator', 
		views: {
			'abstract': {
				templateUrl: 'calculator.html',
				controller: 'CalculatorCtrl'
			}
		}
	});
	
	//ensure App always starts on the welcome page 
	$urlRouterProvider.otherwise('/abstract/home'); 
});
