directive('dateInputMask', dateInputMaskDirective);

  function dateInputMaskDirective() {
    var pattern = '99/99/9999';
    var mask = '99/99/9999';
    var kb = {};
    kb.backspace = 'Backspace';
    kb.arrowLeft = 'ArrowLeft';
    kb.arrowRight = 'ArrowRight';
    kb.home = 'Home';
    kb.end = 'End';
    kb.tab = 'Tab';

    var format = 'MM/DD/YYYY';
    var separator = '/'
    var formats = format.split('/')
    var formatLengthByIndex = [];
    var validatorByIndex = [];
    var fLength = formats.reduce((p, c) => p + c.length, 0) + formats.length - 1;
    formats.forEach(function (f) {
      var pos = format.indexOf(f);
      for (var index = pos; index < pos + f.length; index++) {
        formatLengthByIndex[index] = f.length;
      }
    })

    return {
      restrict: 'A',
      require: '?ngModel',
      link: dateInputMaskLinkFn
    }

    function dateInputMaskLinkFn(scope, element, attrs, ctrl) {
      if (!ctrl) {
        return;
      }

      element.on('keydown', onKeyDown);
      element.on('input', onInput);

      ctrl.$validators.date = function validator(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          return true;
        }
        const futureDate = new Date()
        const currDate = new Date(viewValue);
        return currDate.toDateString() !== 'Invalid Date'
          && viewValue.length === format.length
          && currDate.getTime() <= futureDate.getTime()
      };

      function isNumber(number) {
        return /^\d$/g.test(number);
      }
      //  removeLast(2 + input.value.length - index);
      function removeLast(count) {
        const inputValueArray = input.value.split('');

        for (let index = 0; index < count; index++) {
          inputValueArray.pop();
        }

        input.value = inputValueArray.join('');
      }

      function onKeyDown(event) {
        var input = event.target;
        if (event.key === kb.arrowLeft
          || event.key === kb.arrowRight
          || event.key === kb.home
          || event.key === kb.end) {
          return;
        }
        var index = input.selectionStart;
        if (event.key === kb.tab) {
          return false;
        }
        if (event.key !== kb.backspace) {
          if (!isNumber(event.key) || index === fLength) {
            return false;
          }
        } else {
          if (!input.value[index - 1]) {
            return false;
          }
          var separatorExistsAfterwards = !!input.value
            .split('')
            .filter((_, i) => i >= index)
            .find(i => i === separator);

          if (separatorExistsAfterwards) {
            if (input.value[index - 1] === separator) {
              return false;
            }
          } else {
            if (input.value[index - 2] === separator) {
              removeLast(2 + input.value.length - index);
              return false;
            }
          }
          return;
        }

        var delta = deltaFn(index, input);
        var currentIndex = index;
        if ((input.value[index + 1] && input.value[index] !== separator)
          || (input.value[index] && index + delta === fLength - 1)) {
          var inputValueArray = input.value.split('');

          for (let i = 0; i < inputValueArray.length; i++) {
            if (i === index) {
              inputValueArray[i] = event.key;

              for (let current = i + 1; input.value[current] !== separator
                && current < fLength; current++) {
                inputValueArray[current] = undefined;
              }
            }
          }

          input.value = inputValueArray.filter(i => i).join('');
          console.log('value', input.value)
          setCaretPosition(index + 1);

          const formatLength = formatLengthFn(index, input);

          if (formatLength === formatLengthByIndex[index + delta]) {
            input.dispatchEvent(new Event('change'));
          }

          return false;
        }
        var formatLength = formatLengthFn(index, input);

        if (formatLength === formatLengthByIndex[index + delta]) {
          return false;
        }
      }

      function onInput(event) {
        var input = event.target;
        var index = input.selectionStart;
        var delta = deltaFn(index, input);
        var isBeforeEnd = index + delta < fLength;
        console.log('before input value', input.value)
        if (!formatLengthByIndex[index + delta]
          && isBeforeEnd
          && input.value.length < fLength
          && event.inputType !== 'deleteContentBackward') {
          input.value += separator;
        }

        console.log('after input value', input.value);
        const formatLength = formatLengthFn(index, input);

        if (formatLength === formatLengthByIndex[index + delta - 1]) {
          input.dispatchEvent(new Event('change'));
        }
      }

      function formatLengthFn(index, input) {
        var formatLength = 0;

        for (var ix = index - 1; input.value[ix] && input.value[ix] !== separator && ix >= 0; ix--) {
          formatLength++;
        }

        for (var ix = index; input.value[ix] && input.value[ix] !== separator && ix < fLength; ix++) {
          formatLength++;
        }

        return formatLength;
      }

      function setCaretPosition(pos) {
        setCaretSelection(pos, pos);
      }

      function setCaretSelection(start, end) {
        // Modern browsers
        if (input.setSelectionRange) {
          input.focus();
          input.setSelectionRange(start, end);

          // IE8 and below
        } else if (input.createTextRange) {
          var range = input.createTextRange();
          range.collapse(true);
          range.moveEnd('character', start);
          range.moveStart('character', end);
          range.select();
        }
      }

      function deltaFn(index, input) {
        let delta = 0;

        if (input.value) {
          var previousSeparators = input.value
            .split('')
            .filter((_, i) => i < index)
            .filter(i => i === separator);

          var separatorsCount = previousSeparators.length;
          var subdelta = 0;

          if (input.value[index] === separator) {
            separatorsCount++;
            subdelta++;
          }

          if (separatorsCount === 2) {
            const inputLastIndex = input.value.lastIndexOf(separator);
            const formatLastIndex = format.lastIndexOf(separator);

            delta = format.substring(0, formatLastIndex).length - input.value.substring(0, inputLastIndex).length - subdelta;
          } else if (separatorsCount === 1) {
            const inputIndex = input.value.indexOf(separator);
            const formatIndex = format.indexOf(separator);

            delta = format.substring(0, formatIndex).length - input.value.substring(0, inputIndex).length - subdelta;
          }
        }

        return delta;
      }

    }

  }