angular.module('myApp', ['ui.bootstrap'])

	.directive('scroller', function(){
		return {
	        restrict: 'A',
	        scope: {
	            loadingMethod: "&"
	        },
	        link: function (scope, elem, attrs) {
	            rawElement = elem[0];
	            elem.bind('scroll', function () {
	                if((rawElement.scrollTop + rawElement.offsetHeight+5) >= rawElement.scrollHeight){
	                    scope.$apply(scope.loadingMethod);
	                }
	            });
	        }
	    };
	})

	.filter('ageFilter', function(){
		'use strict';
		return function(userList, value){
			var value2 = parseInt(value) + 24; 
			var filtered = [];
			angular.forEach(userList, function(user){
				if (value === undefined || value === "") {
					filtered.push(user);
				}
				if (value <= user.Age && user.Age < value2) {
					filtered.push(user);
				}
			});
			return filtered;
		};
	})

	.filter('genderFilter', function(){
		'use strict';
		return function(userList, gender){
			var filtered = [];
			angular.forEach(userList, function(user){
				if (gender === undefined || gender === "") {
					filtered.push(user);
				}
				if (user.Gender === gender) {
					filtered.push(user);
				}
			});
			return filtered;
		};
	})

	.factory('services', function($http){
		return {
			allUsers: function(start){
				return $http.get('/api/users/' + start);
			},
			updateUser: function(user, firstName, lastName, email, age, gender){
				return $http.put('/api/userEdit/' + user.Id, {Firstname: firstName, LastName: lastName, Email: email, Age: age, Gender: gender});
			}
		};
	})

	.controller('mainController', function ($scope, services, $modal) {
		'use strict';
		$scope.Users = {};

		$scope.loadMore = function(start){			
			if (start === undefined) {
				start = $scope.Users.length + 1;
				services.allUsers(start).success(function (data) {
	                angular.forEach(data, function(user){
                		$scope.Users.push(user);
	                });
	            });
			} else {
				services.allUsers(start).success(function (data) {
	                $scope.Users = data;
	            });
			}
		};
		$scope.loadMore(0);

		$scope.openModal = function(user, size){
			var modalInstance = $modal.open({
				templateUrl: 'myModalContent.html',
				controller: 'ModalInstanceCtrl',
				size: size,
			    resolve: {
				    user: function () {
				        return user;
				    }
				}
			});
		};
	})

	.controller('ModalInstanceCtrl', function($scope, $modalInstance, user, services){
		'use strict';
		$scope.user = user;
		$scope.submit = function(user) {
			services.updateUser($scope.user, $scope.user.FirstName, $scope.user.LastName, $scope.user.Email, $scope.user.Age, $scope.user.Gender);
			$modalInstance.close();
		};

		$scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		};
	});





