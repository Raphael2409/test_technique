var angular = require("angular");
angular
  .module("app.directives")
  .directive("dragDrop", function() {
    return {
      scope: {
        fileObj: "=fileObj",
        events: "=dragEvents"
      },
      link: function(scope, element) {
        let events = [];
        element.attr("draggable", "true");
        if (scope.events) {
          let create_callback_event = (key, scope) => {
            return event => {
              return scope.events[key](event, scope.fileObj);
            };
          };

          for (let key in scope.events) {
            if (scope.events.hasOwnProperty(key)) {
              let obj = {
                fn: create_callback_event(key, scope),
                key: key
              };
              events.push(obj);
              element.on(key, obj.fn);
            }
          }
          scope.$on("$destroy", () => {
            for (var i = 0; i < events.length; i++) {
              element.off(events[i].key, events[i].fn);
            }
          });
        }
      }
    };
  })
  .directive("folderDrop", function() {
    return {
      scope: {
        events: "=folderdropEvents"
      },
      link: function(scope, element) {
        let events = [];
        if (scope.events) {
          let create_callback_event = (key, element) => {
            return event => {
              return scope.events[key](event, element);
            };
          };
          for (let key in scope.events) {
            if (scope.events.hasOwnProperty(key)) {
              let obj = {
                fn: create_callback_event(key, element),
                key: key
              };
              events.push(obj);
              element.on(key, obj.fn);
            }
          }
          scope.$on("$destroy", () => {
            for (var i = 0; i < events.length; i++) {
              element.off(events[i].key, events[i].fn);
            }
          });
        }
      }
    };
  });
