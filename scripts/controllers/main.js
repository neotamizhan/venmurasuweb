'use strict';

angular.module('venmurasuwebApp')
  .controller('MainCtrl', function ($scope, $http) {

  	$scope.db = [];
  	$scope.episodes = [];
  	$scope.sections = [];
  	$scope.novels = [];

  	$scope.selectedNovel = 0;

  	$scope.loadData = function () {
  		var url = 'data.json?nocache=' + Math.random();
		$http.get(url).then(function (response) {
			console.log(response.data);
			$scope.db = response.data;	
			$scope.novels = Enumerable.from($scope.db)
							.select(function(x) { return {"id" : x.novelno, "name" : x.novelname} })
							.distinct("$.id")
							.toArray();
		});
  	}

  	$scope.fetchSections = function (novel) {
  		console.log('novel :' + novel.name);
  		$scope.sections = Enumerable.from($scope.db)
  						  .where (function (x) { return x.novelno == novel.id})
  						  .select(function (x) { return {"novelno" : x.novelno, "id" : x.sectionno, "name" : x.sectionname} })
  						  .distinct("$.id")
  						  .toArray();
		console.log($scope.sections);
  	};


  	$scope.fetchEpisodes = function (section) {
  		$scope.episodes = Enumerable.from($scope.db)
  						  .where (function (x) { return x.novelno == section.novelno && x.sectionno == section.id  })
  						  .toArray();
  	}

  	$scope.fetchAllEpisodes = function (novel) {
  		$scope.episodes = Enumerable.from($scope.db)
  						  .where (function (x) { return x.novelno == novel.id })
  						  .orderBy("$.chapter")
  						  .toArray();  		
  	}

  	$scope.orderEpisodes = function (order) {
  		if (order == 'd') {
  			$scope.episodes = Enumerable.from($scope.episodes)
	  						  .orderByDescending("$.chapter")
	  						  .toArray();  	
  		} else {
  			$scope.episodes = Enumerable.from($scope.episodes)
	  						  .orderBy("$.chapter")
	  						  .toArray();  	  			
  		}
  	}

  	$scope.loadData();

  });