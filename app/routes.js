define(['angularAMD', 'router'], function (angularAMD) {
  angular.module('app.routes', ['ui.router'])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('home',
          //AngularAMD is requesting the controllers on demand
          angularAMD.route({
            url: '/home',
            templateUrl: 'app/home/home.html',
            controller: 'HomeCtrl',
            controllerUrl: 'app/home/home.ctrl.js'
          })
        )
      $urlRouterProvider.otherwise('/home')
    })
})
