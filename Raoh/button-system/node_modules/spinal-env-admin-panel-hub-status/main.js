require("./SpinalServerStatusService");
require("./ServerStatusCtrl");
var angular = require("angular");

(function() {
  angular.module("app.spinal-panel").run([
    "$templateCache",
    "$http",
    "goldenLayoutService",
    function($templateCache, $http, goldenLayoutService) {
      let load_template = (uri, name) => {
        $http.get(uri).then(
          response => {
            $templateCache.put(name, response.data);
          },
          () => {
            console.log("Cannot load the file " + uri);
          }
        );
      };
      let toload = [
        {
          uri:
            "../templates/spinal-env-admin-panel-hub-status/hub-status-panel.html",
          name: "hub-status-panel.html"
        }
      ];
      for (var i = 0; i < toload.length; i++) {
        load_template(toload[i].uri, toload[i].name);
      }

      goldenLayoutService.registerPanel({
        id: "drag-hub-status-panel",
        name: "SpinalHub Status",
        cfg: {
          isClosable: true,
          title: "SpinalHub Status",
          type: "component",
          width: 20,
          componentName: "SpinalHome",
          componentState: {
            template: "hub-status-panel.html",
            module: "app.spinal-panel",
            controller: "ServerStatusCtrl"
          }
        }
      });
    }
  ]);
})();
