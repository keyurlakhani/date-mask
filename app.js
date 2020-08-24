define(['angularAMD', 'router', 'app/routes'], function (angularAMD) {
  var app = angular.module('app', [
    'app.routes'
  ])
  return angularAMD.bootstrap(app)
})
