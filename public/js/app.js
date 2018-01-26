var app=angular.module('firstApp',['ui.router','restmod'])

.config(function ($stateProvider){
$stateProvider
			.state('create',{
				url:'/Create',
				templateUrl:'./partials/create.html',
				controller:'create'

				})

			.state('find',{
				url:'/find',
				templateUrl:'./partials/find.html',
				controller:'find'

				})
			.state('findone',{
				url:'/Single',
				templateUrl:'./partials/findone.html',
				controller:'findone'
			
				})
			

});

app.controller('create',function($scope,service)
{

		$scope.create=function(){
        service.$create({firstName:$scope.firstName,lastName:$scope.lastName});

							}
});
app.controller('find',function($scope,service)
{
 
 users= service.$search().$then(function() {
		$scope.persons = users;
	});
});
app.controller('findone',function($scope,service,$stateParams)
{
 
 	user = service.$find($stateParams.id).$then(function() {
		$scope.person = user;

	});
});



app.factory('service',function(restmod){
		 return restmod.model('http://localhost:3000/crud/find');

});
