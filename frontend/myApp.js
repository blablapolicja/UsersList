angular.module('myApp', ['ui.bootstrap','xeditable'])

	.directive('scroller', function(){
		return {
	        restrict: 'A',
	        scope: {
	            loadingMethod: "&"
	        },
	        link: function (scope, elem, attrs) {
	            rawElement = elem[0];
	            elem.bind('scroll', function () {
	                if((rawElement.scrollTop + rawElement.offsetHeight) >= rawElement.scrollHeight){
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

	.run(function(editableOptions) {
		editableOptions.theme = 'bs3';
	})

	.controller('mainController', function ($scope, services, $modal, $anchorScroll, $location) {
		'use strict';
		$scope.Users = [];
		$scope.genders = ["Male", "Female"];
		$scope.currentPage = 0;
		$scope.pages = 11;

		$scope.nextPage = function(){
			var anchor 	= parseInt($scope.currentPage - 1 + "0"),
				start	= $scope.Users.length + 1;
			$scope.loadMore(start, anchor);
		};

		$scope.prevPage = function(){
			$scope.currentPage--;
			var anchor;
			if ($scope.currentPage == 2) {
				anchor = "top";
			} else {
				anchor = parseInt($scope.currentPage - 1 + "0");
			}
			$scope.gotoAnchor(anchor);
		};

		$scope.gotoAnchor = function(x) {
			$location.hash('anchor' + x);
	        $anchorScroll();
		};

		$scope.loadMore = function(start, anchor){			
			services.allUsers(start).success(function (data) {
                angular.forEach(data, function(user){
                	if ($scope.Users[$scope.Users.length] != user) {
	            		$scope.Users.push(user);
            		}
                });
                if (anchor) {
                	$scope.gotoAnchor(anchor);
                }
            });
			if ($scope.currentPage < $scope.pages) {
				$scope.currentPage++;
			}
		};
		$scope.loadMore(1);

		$scope.submit = function(user, id){
			angular.extend(user, {Id: id});
			console.log(user);
			services.updateUser(user, user.FirstName, user.LastName, user.Email, user.Age, user.Gender);
		};

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





