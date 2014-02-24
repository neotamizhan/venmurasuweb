'use strict';

angular.module('venmurasuwebApp')
  .controller('MainCtrl', function ($scope, $http) {

    /****** Init Stuff ***/

  	$scope.db = [];
  	$scope.episodes = [];
  	$scope.sections = [];
  	$scope.novels = [];
    $scope.novelsWithSections = [];

  	$scope.selectedNovel = 0;

  	$scope.loadData = function () {
  		var url = 'data.json?nocache=' + Math.random();
  		$http.get(url).then(function (response) { 
        $scope.db = response.data; 
        $scope.fetchNovels();   
        $scope.fetchNovelsWithSections();           
      });
  	}


    /*****/
    // Getters 

    var getNovels = function () {
        return Enumerable.from($scope.db)
                .select(function(x) { return {"id" : x.novelno, "name" : x.novelname} })
                .distinct("$.id")
                .toArray();
    }

    var getSections = function (novel) {
      return Enumerable.from($scope.db)
                .where (function (x) { return x.novelno == novel.id})
                .select(function (x) { return {"novelno" : x.novelno, "id" : x.sectionno, "name" : x.sectionname} })
                .distinct("$.id")
                .toArray();           
    };


    var getEpisodes = function (section) {
      return Enumerable.from($scope.db)
                .where (function (x) { return x.novelno == section.novelno && x.sectionno == section.id  })
                .toArray();
    }

    var getAllEpisodes = function (novel) {
      return Enumerable.from($scope.db)
                .where (function (x) { return x.novelno == novel.id })
                .orderByDescending("$.chapter")
                .toArray();     
    }

    /********** Setters *********/



    $scope.fetchNovels = function () {
        $scope.novels = getNovels();
    }

    $scope.fetchNovelsWithSections = function () {
      $scope.novelsWithSections = [];

      
      for (var i = 0; i < $scope.novels.length; i++) {
        var novelWithSections = {};
        novelWithSections.novel = $scope.novels[i];
        novelWithSections.sections = getSections($scope.novels[i]);
        $scope.novelsWithSections.push (novelWithSections);
      };      
    }    

  	$scope.fetchSections = function (novel) {
  		$scope.sections = getSections(novel);		        
  	};


  	$scope.fetchEpisodes = function (section) {
  		$scope.episodes = getEpisodes(section);
  	}

  	$scope.fetchAllEpisodes = function (novel) {
  		$scope.episodes = getAllEpisodes(novel);
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





    /*** Init Stuff ***/

  	$scope.loadData();

  });