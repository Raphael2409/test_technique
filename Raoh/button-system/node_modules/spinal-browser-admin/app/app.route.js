var angular = require("angular");

angular.module("app.route").config([
  "$routeProvider",
  function($routeProvider) {
    $routeProvider
      .when("/home", {
        templateUrl: "app/templates/main.html",
        authenticate: true,
        controller: "mainCtrl"
      })
      .when("/login", {
        templateUrl: "app/templates/login.html",
        authenticate: false,
        controller: "loginCtrl"
      })

      .otherwise({
        redirectTo: "/home"
      });
  }
]);
