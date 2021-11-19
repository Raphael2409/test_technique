// require("./SpinalUserManagerService");
// require("./UserManagerCtrl");
(function() {
  window.angular.module("app.spinal-panel").controller("userManagerPanelIframeCtrl",
    [
      function() {}
    ]);


  window.angular.module("app.spinal-panel").run([
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
      let toload = [{
        uri: "../templates/spinal-env-admin-panel-user-manager/user-manager-panel-iframe.html",
        name: "user-manager-panel-iframe.html"
      }
        // {
        //   uri:
        //     "../templates/spinal-env-admin-panel-user-manager/user-manager-panel.html",
        //   name: "user-manager-panel.html"
        // },
        // {
        //   uri:
        //     "../templates/spinal-env-admin-panel-user-manager/user-manager-create-user.html",
        //   name: "user-manager-create-user.html"
        // },
        // {
        //   uri:
        //     "../templates/spinal-env-admin-panel-user-manager/user-manager-edit.html",
        //   name: "user-manager-edit.html"
        // }
      ];
      for (var i = 0; i < toload.length; i++) {
        load_template(toload[i].uri, toload[i].name);
      }

      goldenLayoutService.registerPanel({
        id: "drag-users-list-panel",
        name: "User Manager",
        cfg: {
          isClosable: true,
          title: "User Manager",
          type: "component",
          width: 20,
          componentName: "SpinalHome",
          componentState: {
            template: "user-manager-panel-iframe.html",
            module: "app.spinal-panel",
            controller: "userManagerPanelIframeCtrl"
          }
        }
      });

      // goldenLayoutService.registerPanel({
      //   id: "drag-users-list-panel",
      //   name: "Users List",
      //   cfg: {
      //     isClosable: true,
      //     title: "Users List",
      //     type: "component",
      //     width: 20,
      //     componentName: "SpinalHome",
      //     componentState: {
      //       template: "user-manager-panel.html",
      //       module: "app.spinal-panel",
      //       controller: "UserManagerCtrl"
      //     }
      //   }
      // });
    }
  ]);
})();
