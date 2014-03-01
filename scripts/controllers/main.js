'use strict';

angular.module('venmurasuwebApp')
  .controller('MainCtrl', function ($scope, $http) {

    /****** Init Stuff ***/

  	$scope.db = [];
  	$scope.episodes = [];
  	$scope.sections = [];
  	$scope.novels = [];
    $scope.novelsWithSections = [];
    $scope.allTags = [];

  	$scope.message = "Test Message";

  	$scope.loadData = function () {
  		var url = 'data.json?nocache=' + Math.random();
  		$http.get(url).then(function (response) { 
        $scope.db = response.data; 
        $scope.fetchNovels();   
        $scope.fetchNovelsWithSections();       
        $scope.fetchLatestEpisode();    
        $scope.setAllTags();
      });
  	}


    /*****/
    // Getters 

    var getAllTags = function () {
      var alltags = [];

      Enumerable.from($scope.db)
                .select(function (x) { return x.tags; })
                .forEach(function(i) { for(var a=0;a<i.length; a++) {alltags.push (i[a]); } });

      return $.unique(alltags);
    }

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
    

    var getLatestEpisode = function () {      
      var e = [];
      e.push($scope.db[$scope.db.length - 1]);
      return e;
    }

    var getAllTags = function () {
      
    }

    /********** Setters *********/

    $scope.setAllTags = function () {
      $scope.allTags = getAllTags();
    }

    $scope.fetchLatestEpisode = function () {      
      $scope.episodes = getLatestEpisode();

      $scope.message = $scope.episodes[0].published_on + " தேதியிட்ட புதிய அத்தியாயம்."
    }

    $scope.clearEpisodes = function () {
      $scope.episodes = [];      
      $scope.message = "";
    }

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
      $scope.message = section.name + " பகுதியின் அத்தியாயங்கள். எண்ணிக்கை : " + $scope.episodes.length;
  	}

  	$scope.fetchAllEpisodes = function (novel) {
  		$scope.episodes = getAllEpisodes(novel);
      $scope.message = novel.name + " நாவலின் அனைத்து அத்தியாயங்களும். எண்ணிக்கை : " + $scope.episodes.length;
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