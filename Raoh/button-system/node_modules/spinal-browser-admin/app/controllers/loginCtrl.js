var angular = require("angular");

angular.module("app.controllers").controller("loginCtrl", [
  "$scope",
  "authService",
  "$mdToast",
  "$location",
  function($scope, authService, $mdToast, $location) {
    let toast = $mdToast.simple().hideDelay(3000);
    // let user = authService.get_user();
    authService.logout();
    $scope.conf = {
      email: "",
      password: ""
    };
    $scope.ConnectBtn = () => {
      authService.login($scope.conf.email, $scope.conf.password).then(
        () => {
          $location.path("/home");
        },
        err => {
          toast.textContent(err);
          $mdToast.show(toast);
        }
      );
    };
  }
]);
