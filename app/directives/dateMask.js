define(['app', 'string-mask', 'moment'], function (app, StringMask, moment) {
  function isISODateString(date) {
    return /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}([-+][0-9]{2}:[0-9]{2}|Z)$/
      .test(date.toString());
  }
  app.directive('dateInputMask', function () {
    var dateFormat = 'MM/DD/YYYY';
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function (scope, element, attrs, ctrl) {
        if(!ctrl){
          return;
        }
        var dateMask = new StringMask(dateFormat.replace(/[YMD]/g, '0'));

        function formatter(value) {
          if (ctrl.$isEmpty(value)) {
            return null;
          }

          var cleanValue = value;
          if (typeof value === 'object' || isISODateString(value)) {
            cleanValue = moment(value).format(dateFormat);
          }

          cleanValue = cleanValue.replace(/[^0-9]/g, '');
          var formatedValue = dateMask.apply(cleanValue) || '';
          console.log('formatedValue', formatedValue);
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
          return moment(viewValue, dateFormat, true).isValid() 
            && viewValue.length === dateFormat.length
            && (moment(viewValue, dateFormat).isBefore() || moment(viewValue, dateFormat).isSame())
        };
      }
    };
  })
});