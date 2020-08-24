define(['app', 'app/directives/dateMask'], function (app) {
  app.controller('HomeCtrl', function ($scope) {
   //Do whatever you need 
   $scope.title = 'Home Page';
   $scope.value = {
     dob: '08/18/2020'
   }
   this.onSubmit = function() {

   }
  })
})
