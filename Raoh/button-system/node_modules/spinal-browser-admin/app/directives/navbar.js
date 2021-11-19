var angular = require("angular");
var $ = require("jquery");

compareTo.$inject = [];

function compareTo() {
  return {
    require: "ngModel",
    scope: {
      compareTolValue: "=compareTo"
    },
    link: function(scope, element, attributes, ngModel) {
      ngModel.$validators.compareTo = function(modelValue) {
        return modelValue == scope.compareTolValue;
      };
      scope.$watch("compareTolValue", function() {
        ngModel.$validate();
      });
    }
  };
}
angular
  .module("app.directives")
  .directive("navbar", [
    function() {
      return {
        restrict: "E",
        templateUrl: "app/templates/navbar.html",
        controller: "navbarCtrl"
      };
    }
  ])
  .directive("menuGlayout", [
    "goldenLayoutService",
    "$timeout",
    function(goldenLayoutService, $timeout) {
      return {
        restrict: "E",
        scope: {
          layoutInfo: "=info"
        },
        replace: true,
        template:
          '<li ng-repeat="layout in layoutInfo"  id="{{layout.id}}"><a >{{layout.name}}</a></li>',
        link: scope => {
          goldenLayoutService.wait_ready().then(() => {
            let create_callback = (goldenLayoutService, layout) => {
              return () => {
                goldenLayoutService.createChild(layout.cfg);
              };
            };
            goldenLayoutService.watch_panel(panels => {
              $timeout(() => {
                for (var i = 0; i < panels.length; i++) {
                  let layout = panels[i];
                  if (!layout.shown) {
                    layout.shown = true;
                    goldenLayoutService.createDragSource(
                      $("#" + layout.id)[0],
                      layout.cfg
                    );
                    $("#" + layout.id).click(
                      create_callback(goldenLayoutService, layout)
                    );
                  }
                }
              }, 200);
              scope.layoutInfo = panels;
            });
          });
        }
      };
    }
  ])
  .directive("ngRightClick", [
    "$parse",
    function($parse) {
      return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind("contextmenu", function(event) {
          scope.$apply(function() {
            event.preventDefault();
            fn(scope, {
              $event: event
            });
          });
        });
      };
    }
  ])
  .directive("compareTo", compareTo)
  .provider("$copyToClipboard", [
    function() {
      this.$get = [
        "$q",
        "$window",
        function($q, $window) {
          var body = angular.element($window.document.body);
          var textarea = angular.element("<textarea/>");
          textarea.css({
            position: "fixed",
            opacity: "0"
          });
          return {
            copy: function(stringToCopy) {
              var deferred = $q.defer();
              deferred.notify("copying the text to clipboard");
              textarea.val(stringToCopy);
              body.append(textarea);
              textarea[0].select();
              try {
                var successful = $window.document.execCommand("copy");
                if (!successful) throw successful;
                deferred.resolve(successful);
              } catch (err) {
                deferred.reject(err);
              } finally {
                textarea.remove();
              }
              return deferred.promise;
            }
          };
        }
      ];
    }
  ]);
