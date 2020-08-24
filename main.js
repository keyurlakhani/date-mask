require.config({
  baseUrl: '',
  // urlArgs: 'cache_bust=' + (new Date()).getTime(),
  paths: {
    'angular': 'bower_components/angular/angular.min',
    'angularAMD': 'bower_components/angularAMD/angularAMD.min',
    'router': 'bower_components/angular-ui-router/release/angular-ui-router.min',
    'string-mask': 'bower_components/string-mask/src/string-mask',
    'moment': 'bower_components/moment/min/moment-with-locales.min'
  },
  shim: { 
    'angularAMD': ['angular'],
    'router': ['angular']
  },
  deps: ['app']
})


