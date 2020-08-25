angular
  .module('app')
  .directive('dateInputMask', function () {
    var dateFormat = 'MM/DD/YYYY';
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function (scope, element, attrs, ctrl) {
        if(!ctrl){
          return;
        }
         function dateMask(value) {
          let v = value.replace(/\D/g,'').slice(0, 10);
          console.log('v', v);
          if (v.length >= 5) {
            return `${v.slice(0,2)}/${v.slice(2,4)}/${v.slice(4, 8)}`;
          }
          else if (v.length >= 3) {
            return `${v.slice(0,2)}/${v.slice(2)}`;
          }
          return v.slice(0)
        }
        function formatter(value) {
          if (ctrl.$isEmpty(value)) {
            return null;
          }
          var formatedValue = dateMask(value) || '';
          return formatedValue.trim().replace(/[^0-9]$/, '');
        }

        ctrl.$formatters.push(formatter);

        ctrl.$parsers.push(function parser(value) {
          if (ctrl.$isEmpty(value)) {
            return value;
          }

          var formatedValue = formatter(value);

          if (ctrl.$viewValue !== formatedValue) {
            ctrl.$setViewValue(formatedValue);
            ctrl.$render();
          }

          return formatedValue;
        });

        ctrl.$validators.date = function validator(modelValue, viewValue) {
          if (ctrl.$isEmpty(modelValue)) {
            return true;
          }
          const futureDate = new Date()
          const currDate = new Date(viewValue);
          return currDate.toDateString() !== 'Invalid Date'
            && viewValue.length === dateFormat.length
            && currDate.getTime() <= futureDate.getTime()
        };
      }
    };
  })