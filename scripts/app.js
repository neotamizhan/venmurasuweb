'use strict';

angular.module('venmurasuwebApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {    
    $routeProvider
      .when('/', {
        templateUrl: '/views/main.html'//,
        //controller: 'MainCtrl'
      })
      .when('/latest', {
        templateUrl: '/views/main.html',
        controller: 'LatestEpisodeController'
      })
      .when('/novel/:novel', {
        templateUrl: '/views/main.html',
        controller: 'NovelController'
      })
      .when('/novel/:novel/section/:section', {
        templateUrl: '/views/main.html',
        controller: 'SectionController'
      })
      .when('/tag/:tag', {
        templateUrl: '/views/main.html',
        controller: 'TagController'
      })      
      .otherwise({
        redirectTo: '/'
      });
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
      return Enumerable.from(db)
                       .where (function  (x) { return $.inArray(tag, x.tags) > -1 })
                       .orderByDescending("$.novelno")
                       .thenByDescending("$.chapter")
                       .toArray();
    };

  });
