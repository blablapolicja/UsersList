angular.module('myApp', ['ui.bootstrap'])

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
			allUsers: function(){
				return $http({ method: 'GET', url: '/api/users' });
			},
			updateUser: function(user, firstName, lastName, email, age, gender){
				return $http.put('/api/userEdit/' + user.Id, {Firstname: firstName, LastName: lastName, Email: email, Age: age, Gender: gender});
			}
		};
	})

	.controller('mainController', function ($scope, services, $modal) {
		'use strict';
		$scope.Users = {};
		$scope.getAllUsers = function(){
			services.allUsers()
				.success(function (data) {
                    $scope.Users = data;
                })
                .error(function (data, status, headers, config) {
                    throw error;
                });
		};
		$scope.getAllUsers();

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
		$scope.user = user;

		$scope.submit = function(user) {
			services.updateUser($scope.user, $scope.user.FirstName, $scope.user.LastName, $scope.user.Email, $scope.user.Age, $scope.user.Gender);
			$modalInstance.close();
		};

		$scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		};
	});





