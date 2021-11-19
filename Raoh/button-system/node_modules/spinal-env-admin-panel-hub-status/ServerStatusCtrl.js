(function() {
  var angular = require("angular");
  var d3 = require("d3");
  angular.module("app.spinal-panel").controller("ServerStatusCtrl", [
    "$scope",
    "$injector",
    "$mdToast",
    "$interval",
    "$timeout",
    "$mdDialog",
    "$q",
    "SpinalServerStatusService",
    "layout_uid",
    function(
      $scope,
      $injector,
      $mdToast,
      $interval,
      $timeout,
      $mdDialog,
      $q,
      SpinalServerStatusService,
      layout_uid
    ) {
      $scope.injector = $injector;
      $scope.users = [];
      $scope.uid = layout_uid.get();
      $scope.statusLst = [];
      var width;
      var lastGraph = null;
      $scope.statusModel = null;

      $scope.backupClick = () => {
        $scope.statusModel.btn.backup.set(1);
      };
      $scope.garbageCollectorClick = () => {
        $scope.statusModel.btn.garbageCollector.set(1);
      };
      $scope.isBackupDisabled = () => {
        if ($scope.statusModel && $scope.statusModel.btn.backup.get() === 0) {
          return false;
        }
        return true;
      };
      $scope.isGrbageCollectorDisabled = () => {
        if (
          $scope.statusModel &&
          $scope.statusModel.btn.garbageCollector.get() === 0
        ) {
          return false;
        }
        return true;
      };

      function getStatus(name) {
        for (var i = 0; i < $scope.statusLst.length; i++) {
          if ($scope.statusLst[i].name === name) return $scope.statusLst[i];
        }
        return null;
      }

      function updateData(status, data) {
        data.forEach(function(value, index) {
          data[index] = parseInt(data[index]);
        });
        for (var i = 0; i < data.length; i++) {
          if (isNaN(data[i])) {
            data.splice(i, 1);
            i -= 1;
          }
        }
        let elem = d3.select("#" + status.id);
        elem.select("svg").remove();
        let graph = elem
          .append("svg")
          .attr("width", "100%")
          .attr("height", "50px");
        lastGraph = graph;
        var height = parseInt(graph.style("height"));
        width = parseInt(graph.style("width"));
        var x = d3
          .scaleLinear()
          .domain([0, data.length])
          .range([0, width]);
        var ymax = d3.max(data);
        var y = d3
          .scaleLinear()
          .domain([0, ymax])
          .range([height, 0]);
        var line = d3
          .line()
          .x(function(d, i) {
            return x(i);
          })
          .y(function(d) {
            return y(d);
          });
        graph
          .append("path")
          .data([data])
          .attr("class", "line")
          .attr("d", line);
        var mouseG = graph.append("g").attr("class", "mouse-over-effects");

        mouseG
          .append("path") // this is the black vertical line to follow mouse
          .attr("class", "mouse-line")
          .style("stroke", "#96ceff")
          .style("stroke-width", "1px")
          .style("opacity", "0");

        var mousePerLine = mouseG
          .selectAll(".mouse-per-line")
          .data([1])
          .enter()
          .append("g")
          .attr("class", "mouse-per-line");

        mousePerLine
          .append("circle")
          .attr("r", 5)
          .style("stroke", "#96ceff")
          .style("fill", "none")
          .style("stroke-width", "1px")
          .style("opacity", "0");

        var textgroup = mousePerLine
          .append("g")
          .attr("transform", "translate(-3,17)")
          .style("opacity", "0");
        textgroup.append("rect").attr("fill", "#96ceff");

        textgroup.append("text").attr("text-anchor", "end");

        mouseG
          .append("svg:rect") // append a rect to catch mouse movements on canvas
          .attr("width", width) // can't catch mouse events on a g element
          .attr("height", height)
          .attr("fill", "none")
          .attr("pointer-events", "all")
          .on("mouseout", function() {
            // on mouse out hide line, circles and text
            mouseG.select(".mouse-line").style("opacity", "0");
            mousePerLine.select(".mouse-per-line circle").style("opacity", "0");
            mousePerLine.select(".mouse-per-line g").style("opacity", "0");
          })
          .on("mouseover", function() {
            // on mouse in show line, circles and text
            mouseG.select(".mouse-line").style("opacity", "1");
            mousePerLine.select(".mouse-per-line circle").style("opacity", "1");
            mousePerLine.select(".mouse-per-line g").style("opacity", "1");
          })
          .on("mousemove", function() {
            // mouse moving over canvas
            var mouse = d3.mouse(this);
            mouseG.select(".mouse-line").attr("d", function() {
              let _x = Math.floor(x.invert(mouse[0]));
              let __x = Math.floor(x(_x));
              var d = "M" + __x + "," + height;
              d += " " + __x + "," + 0;
              return d;
            });
            mouseG.selectAll(".mouse-per-line").attr("transform", function() {
              let _x = Math.floor(x.invert(mouse[0]));
              let real_x = Math.floor(x(_x));
              let _y = data[_x];
              let real_y = y(_y);
              let text = d3.select(this).select("text");
              let grp = d3.select(this).select("g");
              if (_y < ymax / 2) {
                grp.attr("transform", "translate(-3,-17)");
              } else grp.attr("transform", "translate(-3,25)");
              let rect = d3.select(this).select("rect");
              text.text(_y.toFixed(0));
              let bbox = text.node().getBBox();
              var padding = 2;
              rect
                .attr("x", bbox.x - padding)
                .attr("y", bbox.y - padding)
                .attr("width", bbox.width + padding * 2)
                .attr("height", bbox.height + padding * 2);
              return "translate(" + real_x + "," + real_y + ")";
            });
          });
      }

      function wait_DOM_RDY_rec(defer, status) {
        let elem = d3.select("#" + status.id);
        if (!elem._groups[0][0])
          setTimeout(() => {
            wait_DOM_RDY_rec(defer, status);
          }, 200);
        else defer.resolve(elem);
      }

      function wait_DOM_RDY(status) {
        let defer = $q.defer();
        wait_DOM_RDY_rec(defer, status);
        return defer.promise;
      }

      function update_or_push_Status(name, value, data) {
        let status = getStatus(name);
        if (status) {
          status.value = value;
        } else {
          status = {
            name: name,
            value: value,
            id: "spark_" + name + "_" + $scope.uid
          };
          $scope.statusLst.push(status);
        }
        wait_DOM_RDY(status).then(function() {
          updateData(status, data);
        });
      }

      function draw() {
        update_or_push_Status(
          "count_models",
          $scope.statusModel.count_models.get(),
          $scope.statusModel.data.count_models.get().split(";")
        );
        update_or_push_Status(
          "count_sessions",
          $scope.statusModel.count_sessions.get(),
          $scope.statusModel.data.count_sessions.get().split(";")
        );
        update_or_push_Status(
          "count_users",
          $scope.statusModel.count_users.get(),
          $scope.statusModel.data.count_users.get().split(";")
        );
        update_or_push_Status(
          "ram_usage_res",
          $scope.statusModel.ram_usage_res.get(),
          $scope.statusModel.data.ram_usage_res.get().split(";")
        );
        update_or_push_Status(
          "ram_usage_virt",
          $scope.statusModel.ram_usage_virt.get(),
          $scope.statusModel.data.ram_usage_virt.get().split(";")
        );
      }

      SpinalServerStatusService.init().then(function(statusModel) {
        $scope.statusModel = statusModel;
        draw();
        let check_redraw = () => {
          let graphWidth = parseInt(lastGraph.style("width"));
          if (width != graphWidth) {
            width = graphWidth;
            draw();
          }
        };
        $scope.statusModel.bind(draw);
        let interval_resize = setInterval(check_redraw, 600);
        $scope.$on("$destroy", function() {
          clearInterval(interval_resize);
          $scope.statusModel.unbind(draw);
          interval_resize = undefined;
        });
      });
    }
  ]);
})();
