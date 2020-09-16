angular.module('app')
    .directive('usernameValidator', function usernameValidatorDirective() {
      return {
        required:'ngModel',
        link: function usernameValidatorLinkFn(scope, elm, attrs, ctrl) {
          if(!ctrl) {
            return;
          }
          var USERNAME_REGEXP = /^[a-zA-Z0-9_-]{7,12}$/;
          ctrl.$validators.usernamePattern = function usernameValidator(modelValue, viewValue) {
            var value = modelValue || viewValue;
            return ctrl.$isEmpty(value) || USERNAME_REGEXP.test(value);
          };
        }
      }
    })
    .directive('passwordValidator', function passwordValidatorDirective() {
      return {
        required: 'ngModel',
        link: function passwordValidatorLinkFn(scope, elm, attrs, ctrl) {
          if(!ctrl) {
            return;
          }
          var PASSWORD_REGEXP = /^(?=.\d)(?=.[a-z])(?=.[A-Z])(?!.\s).{8,30}$/;
          ctrl.$validators.passwordPattern = function usernameValidator(modelValue, viewValue) {
            var value = modelValue || viewValue;
            return ctrl.$isEmpty(value) || PASSWORD_REGEXP.test(value);
          };
          var isNum = function (n) { return !isNaN(n); }
          var isSequentialOrSame = function (s, i, v) {
            return isNum(s)
              ? isNum(v[i + 1]) && isNum(v[i + 2])
              && (+v[i + 1] === +s + 1 && +v[i + 2] === +s + 2)
              || (s === v[i + 1] && s === v[i + 2])
              : !isNum(v[i + 1]) && !isNum(v[i + 2])
              && (v.charCodeAt(i) + 1 === v.charCodeAt(i + 1) && v.charCodeAt(i) + 2 === v.charCodeAt(i + 2))
              || (v.charCodeAt(i) === v.charCodeAt(i + 1) && v.charCodeAt(i) === v.charCodeAt(i + 2))
          }
          ctrl.$validators.sequentialOrSame = function passwordValidator(modelValue, viewValue) {
            var value = modelValue || viewValue;
            var valid = true;
            if(ctrl.$isEmpty(value)) {
              return true;
            }

            for (var i = 0; i < value.length - 2; i++) {
              if (isSequentialOrSame(value[i], i, value)) {
                valid = false;
                break;
              }
            }
            return valid;
          };
        }
      }
    })
    .component('appLogin', {
      templateUrl: 'app/login/login.html',
      controller: function LoginComponentController() {
        this.onSubmit = function onSubmit() {
          if(form.$valid) {
            console.log('form is valid')
          } else {
            console.log('form is invalid');
          }
        }
      }
    })