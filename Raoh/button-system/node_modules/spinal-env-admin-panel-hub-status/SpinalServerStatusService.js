var angular = require("angular");

angular.module("app.spinal-panel").factory("SpinalServerStatusService", [
  "authService",
  "$q",
  "ngSpinalCore",
  function(authService, $q, ngSpinalCore) {
    let spinhubService = {};

    spinhubService.init = () => {
      if (!spinhubService.statusModel) {
        return authService.wait_connect().then(
          () => {
            return ngSpinalCore.load("/etc/Status").then(function(statusModel) {
              spinhubService.statusModel = statusModel;
              return spinhubService.statusModel;
            });
          },
          () => {
            let msg = "not able to load : /etc/Status";
            console.error(msg);
            deferred.reject(msg);
          }
        );
      } else {
        var deferred = $q.defer();
        deferred.resolve(spinhubService.statusModel);
        return deferred.promise;
      }
    };

    return spinhubService;
  }
]);
