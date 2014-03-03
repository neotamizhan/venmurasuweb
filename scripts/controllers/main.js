'use strict';

angular.module('myFilters', []).filter('joinArray', function() {
  return function(array) {
    return array.join();
}});

angular.module('venmurasuwebApp',['myFilters'])
  .controller('MainCtrl', function ($scope, $http) {

    /****** Init Stuff ***/

  	$scope.db = [];
  	$scope.episodes = [];
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
        $scope.fetchNovels();   
        $scope.fetchNovelsWithSections();       
        $scope.fetchLatestEpisode();    
        //$scope.fetchAllTags();
        getTagCount();
      });
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

    var getAllTags = function () {
      var tags = [];
      Enumerable.from($scope.db)
                .select(function (x) { return x.tags; })
                .forEach(function(i) { for(var a=0;a<i.length; a++) {tags.push (i[a]); } });

      return tags.unique().sort();
     // return $.unique(tags);
    }

    var getTagCount = function () {
      
      var tags = [];
      Enumerable.from($scope.db)
                .select(function (x) { return x.tags; })
                .forEach(function(i) { for(var a=0;a<i.length; a++) {tags.push (i[a]); } });


      var counts = {};

      for(var i = 0; i< tags.length; i++) {
          var num = tags[i];
          counts[num] = counts[num] ? counts[num]+1 : 1;
      }

      $scope.tagCount = Enumerable.from(counts).select("{'tag' : $.key, 'count' : $.value}").orderByDescending("$.count").toArray();
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

    var getByTag = function (tag) {
      return Enumerable.from($scope.db)
                       .where (function  (x) { return $.inArray(tag, x.tags) > -1 })
                       .orderByDescending("$.novelno")
                       .thenByDescending("$.chapter")
                       .toArray();
    }

    /********** Setters *********/

    $scope.fetchAllTags = function () {
      $scope.allTags = getAllTags();
    }

    $scope.fetchByTag = function  (tag) {
      $scope.episodes = getByTag(tag);

      var singular = "அத்தியாயம்.";
      var plural = "அத்தியாயங்கள். எண்ணிக்கை : " + $scope.episodes.length;
       var t = ($scope.episodes.length == 1) ? singular : plural;
       $scope.message = tag + " என்ற குறிச்சொல்லுடைய " + t;     
      
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