var angular = require("angular");

angular.module("app.controllers").controller("mainCtrl", [
  "goldenLayoutService",
  function( goldenLayoutService) {
    goldenLayoutService.init();
  }
]);
