'use strict';

angular.module('myApp.view1', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/calendar', {
      templateUrl: 'calendar/calendarTemplate.html',
      controller: 'CalendarCtrl'
    });
  }])

  .controller('CalendarCtrl', ['$scope', function ($scope) {
    var startDate,
      numDays = 0,
      months = [],

      /*For validating user input*/
      dateValidator = /^\d{1,2}\/\d{1,2}\/\d{4}$/,
      numberValidator = /^\d+$/;


    $scope.$watch('startDate', function (newValue, oldValue) {
      if (newValue) {
        if (dateValidator.test($scope.startDate)) {
          startDate = new Date($scope.startDate);
          if (numDays) {
            getMonthsList();
          }
        } else {
          startDate = undefined;
        }
      }
    })

    $scope.$watch('numDays', function (newValue, oldValue) {
      if (newValue) {
        if (numberValidator.test($scope.numDays)) {
          numDays = parseInt($scope.numDays)
          if (startDate) {
            getMonthsList();
          }
        } else {
          numDays = 0;
        }
      }
    })

    //Adds or subtracts days in a Date
    function setDate(date, days) {
      var d = new Date(date);
      d.setDate(d.getDate() + days);
      return d;
    }

    // get the array of months 
    function getMonthsList() {
      var month = startDate.getMonth(),
        k = 0;

      months = [];
      //initiates the first month
      months.push(new Array());

      for (var i = 0; i < numDays; i++) {
        var iDate = setDate(startDate, i);

        //if month has changed to the next
        if (iDate.getMonth() != month) {
          k++;
          months.push(new Array());
          month = iDate.getMonth();
        }

        let css = (iDate.getDay() == 0 || iDate.getDay() == 6) ? "isWeekend" : "hasData";
        let lang = navigator.languages ? navigator.languages[0] : navigator.language;

        //adds the day
        months[k].push({
          date: iDate,
          day: iDate.getDate(),
          month: iDate.toLocaleString(lang, { month: "long" }),
          year: iDate.getFullYear(),
          css: css
        });
      }

      //interates months array and add the first and last empty days 
      for (var j = 0; j < months.length; j++) {

        let initDay = months[j][0],
          lastDay = months[j][months[j].length - 1];

        let firstEmptyDays = new Date(initDay.date).getDay(),
          lastEmptyDays = 7 - (new Date(lastDay.date).getDay() + 1);

        let initDaysArray = new Array(firstEmptyDays);
        let lastDaysArray = new Array(lastEmptyDays);

        months[j] = initDaysArray.concat(months[j]);
        months[j] = months[j].concat(lastDaysArray);


        if (!months[j][0]) {
          months[j][0] = {};
        }

        months[j][0].monthLabel = initDay.month + " " + initDay.year;

      }

      $scope.months = months;
    }
  }]);