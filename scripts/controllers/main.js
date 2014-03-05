'use strict';

function MainCtrl ($scope, $http, Helper, EpisodeService, $location) {

    /****** Init Stuff ***/
  	$scope.db = [];
  	$scope.episodes = EpisodeService.Episodes; //Data.getEpisodes();

  	$scope.sections = [];
  	$scope.novels = [];
    $scope.novelsWithSections = [];
    $scope.allTags = [];
    $scope.tagCount = [];

  	$scope.message = "";

      


  	$scope.loadData = function () {
  		var url = 'data.json?nocache=' + Math.random();
  		$http.get(url).then(function (response) { 
        $scope.db = response.data; 
        
        initialize();
      });
  	};

    var initialize = function () {
      $scope.fetchNovels();   
      $scope.fetchNovelsWithSections();
      $scope.tagCount = Helper.getTagCount($scope.db);  
      // go to /latest
      console.log('path is ' + $location.path());
      if ($location.path() == "/")
        $location.path('/latest');
     // $scope.$apply();
    }


    /************/
    /*** Utility functions ****/

    Array.prototype.unique = function() {
      var unique = [];
      for (var i = 0; i < this.length; i++) {
          if (unique.indexOf(this[i]) == -1) {
              unique.push(this[i]);
          }
      }
      return unique;
    };


    /*****/
    // Getters 


    /********** Setters *********/

    $scope.fetchAllTags = function () {
      $scope.allTags = getAllTags();
    }

    $scope.fetchByTag = function  (tag) {
   
      
    }

    $scope.clearEpisodes = function () {
      console.log('Clearing');
      console.log(EpisodeService.Episodes.length);
      EpisodeService.Episodes = [];
      //$scope.episodes = [];      
      $scope.message = "";      
    }

    $scope.fetchNovels = function () {
        $scope.novels = Helper.getNovels($scope.db);
    }

    $scope.fetchNovelsWithSections = function () {
      $scope.novelsWithSections = [];
      
      for (var i = 0; i < $scope.novels.length; i++) {
        var novelWithSections = {};
        novelWithSections.novel = $scope.novels[i];
        novelWithSections.sections = Helper.getSections($scope.db,$scope.novels[i]);
        $scope.novelsWithSections.push (novelWithSections);
      };      
    }    

  	$scope.fetchSections = function (novel) {
  		$scope.sections = Helper.getSections($scope.db, novel);		        
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

  	//$scope.loadData();   
  };


function LatestEpisodeController ($scope, EpisodeService) {
  $scope.episodes = EpisodeService.Episodes;
  var e = [];      
  e.push($scope.db[$scope.db.length - 1]);         
  $scope.episodes = e;
  $scope.message = $scope.episodes[0].published_on + " தேதியிட்ட புதிய அத்தியாயம்."
}

function NovelController ($scope, $routeParams, Helper, EpisodeService) {
  $scope.episodes = EpisodeService.Episodes;
  $scope.episodes = Helper.getEpisodesByNovel($scope.db, $routeParams.novel);
}

function SectionController ($scope, $routeParams, Helper, EpisodeService) {
  $scope.episodes = EpisodeService.Episodes;
  $scope.episodes = Helper.getEpisodesByNovelAndSection($scope.db, $routeParams.novel, $routeParams.section);
  $scope.message = $scope.episodes[0].sectionname + " பகுதியின் அத்தியாயங்கள். எண்ணிக்கை : " + $scope.episodes.length;
}

function TagController ($scope, $routeParams, Helper, EpisodeService) {
  $scope.episodes = EpisodeService.Episodes;
  $scope.episodes = Helper.getEpisodesByTag($scope.db, $routeParams.tag);

  var singular = "அத்தியாயம்.";
  var plural = "அத்தியாயங்கள். எண்ணிக்கை : " + $scope.episodes.length;
  var t = ($scope.episodes.length == 1) ? singular : plural;
  $scope.message = $routeParams.tag + " என்ற குறிச்சொல்லுடைய " + t;  
}

function NovelController ($scope, $routeParams, Helper, EpisodeService) {
  $scope.episodes = EpisodeService.Episodes;
  $scope.episodes = Helper.getEpisodesByNovel($scope.db, $routeParams.novel);
}

function EpisodeController ($scope, $routeParams, Helper) {
  $scope.episode = Helper.getEpisode($scope.db, $routeParams.novel, $routeParams.chapter);
}
