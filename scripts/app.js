'use strict';

angular.module('venmurasuwebApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider, $locationProvider) {    
    $routeProvider
      .when('/', {
        templateUrl: 'views/episodes.html'
      })
      .when('/latest', {
        templateUrl: 'views/episodes.html',
        controller: 'LatestEpisodeController'
      })     
      .when('/novel/:novel', {
        templateUrl: 'views/episodes.html',
        controller: 'NovelController'
        //controller: 'MainCtrl'
      })
      .when('/novel/:novel/section/:section', {
        templateUrl: 'views/episodes.html',
        controller: 'SectionController'
      })
      .when('/tag/:tag', {
        templateUrl: 'views/episodes.html',
        controller: 'TagController'
      })      
      .when('/novel/:novel/chapter/:chapter', {
        templateUrl: 'views/episode_detail.html',
        controller: 'EpisodeController'
      })            
      .otherwise({
        redirectTo: '/'
      });

      //$locationProvider.html5Mode(true);
  })

  .service('Helper', function () {

    /* Init Helpers */
    this.getAllTags = function (db) {
      var tags = [];
      Enumerable.from(db)
                .select(function (x) { return x.tags; })
                .forEach(function(i) { for(var a=0;a<i.length; a++) {tags.push (i[a]); } });

      return tags.unique().sort();
     // return $.unique(tags);
    };

    this.getTagCount = function (db) {
      
      var tags = [];
      Enumerable.from(db)
                .select(function (x) { return x.tags; })
                .forEach(function(i) { for(var a=0;a<i.length; a++) {tags.push (i[a]); } });


      var counts = {};

      for(var i = 0; i< tags.length; i++) {
          var num = tags[i];
          counts[num] = counts[num] ? counts[num]+1 : 1;
      }

      return Enumerable.from(counts).select("{'tag' : $.key, 'count' : $.value}").orderByDescending("$.count").toArray();
    };

    this.getNovels = function (db) {
        return Enumerable.from(db)
                .select(function(x) { return {"id" : x.novelno, "name" : x.novelname} })
                .distinct("$.id")
                .toArray();
    };

    this.getSections = function (db,novel) {
      return Enumerable.from(db)
                .where (function (x) { return x.novelno == novel.id})
                .select(function (x) { return {"novelno" : x.novelno, "id" : x.sectionno, "name" : x.sectionname} })
                .distinct("$.id")
                .toArray();           
    };

    this.getEpisode = function (db, novel, chapter) {
      var e = Enumerable.from(db)
                .where (function (x) { return x.novelno == novel && x.chapter == chapter})
                .toArray();   
      return (e.length > 0) ? e[0] : {};
    }

    this.getEpisodesByNovel = function (db, novel) {
      return Enumerable.from(db)
                .where (function (x) { return x.novelno == novel })
                .orderByDescending("$.chapter")
                .toArray();     
    };

    this.getEpisodesByNovelAndSection = function (db, novel, section) {
      return Enumerable.from(db)
                .where (function (x) { return x.novelno == novel && x.sectionno == section  })
                .toArray();
    };
    
    this.getEpisodesByTag = function (db, tag) {
      console.log('in getEpisodesByTag looking for tag ' + tag)
      return Enumerable.from(db)
                       .where (function  (x) { return $.inArray(tag, x.tags) > -1 })
                       .orderByDescending("$.novelno")
                       .thenByDescending("$.chapter")
                       .toArray();
    };

  })


  .service('EpisodeService', function () {
    var episodes = [];

    this.Episodes = episodes;
  })

.directive('dirDisqus', function($window) {
        return {
            restrict: 'E',
            scope: {
                disqus_shortname: '@disqusShortname',
                disqus_identifier: '@disqusIdentifier',
                disqus_title: '@disqusTitle',
                disqus_url: '@disqusUrl',
                disqus_category_id: '@disqusCategoryId',
                disqus_disable_mobile: '@disqusDisableMobile',
                readyToBind: "@"
            },
            template: '<div id="disqus_thread"></div><a href="http://disqus.com" class="dsq-brlink">comments powered by <span class="logo-disqus">Disqus</span></a>',
            link: function(scope) {

                scope.$watch("readyToBind", function(isReady) {

                    // If the directive has been called without the 'ready-to-bind' attribute, we
                    // set the default to "true" so that Disqus will be loaded straight away.
                    if ( !angular.isDefined( isReady ) ) {
                        isReady = "true";
                    }
                    if (scope.$eval(isReady)) {
                        // put the config variables into separate global vars so that the Disqus script can see them
                        $window.disqus_shortname = scope.disqus_shortname;
                        $window.disqus_identifier = scope.disqus_identifier;
                        $window.disqus_title = scope.disqus_title;
                        $window.disqus_url = scope.disqus_url;
                        $window.disqus_category_id = scope.disqus_category_id;
                        $window.disqus_disable_mobile = scope.disqus_disable_mobile;

                        // get the remote Disqus script and insert it into the DOM, but only if it not already loaded (as that will cause warnings)
                        if (!$window.DISQUS) {
                            var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
                            dsq.src = '//' + scope.disqus_shortname + '.disqus.com/embed.js';
                            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
                        } else {
                            $window.DISQUS.reset({
                                reload: true
                            });
                        }
                    }
                });
            }
        };
    });
  ;
