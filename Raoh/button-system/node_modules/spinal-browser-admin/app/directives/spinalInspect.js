var angular = require("angular");
var d3 = require("d3");
var $ = require("jquery");
angular
  .module("app.directives")
  .factory("spinalInspectUID", [
    function() {
      let uid = 0;
      let facto = {
        uid: 0,
        get_uid: () => {
          uid = facto.uid;
          ++facto.uid;
          return uid;
        },
        get_last_uid: () => {
          return uid;
        },
        elem: {}
      };

      //tooltip ~~
      facto.tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "inspect-tooltip")
        .style("opacity", 1e-6);

      return facto;
    }
  ])
  .directive("spinalInspect", [
    "spinalInspectUID",
    function(spinalInspectUID) {
      let directive = {
        restrict: "EA",
        link: function(s, e) {
          // scope, element, attribute
          let uid = spinalInspectUID.get_uid();
          let elem = $(
            '<div class="spinal-inspector-container" id="spinalinspect_' +
              uid +
              '"></div><div class="spinal-inspect-btn-grp"><button class="btn btn-primary fa fa-bullseye" id="spinalinspect_btn_centerroot_' +
              uid +
              '"></button></div>'
          );
          spinalInspectUID.elem[uid] = elem;
          $(e).append(elem);
        }
      };
      return directive;
    }
  ]);
