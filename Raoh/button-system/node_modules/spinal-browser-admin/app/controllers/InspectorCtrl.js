var angular = require("angular");
var d3 = require("d3");
var d3ContextMenu = require("d3-context-menu");

angular.module("app.FileExplorer").controller("InspectorCtrl", [
  "$scope",
  "$injector",
  "spinalInspectUID",
  "authService",
  "$mdToast",
  "$interval",
  "spinalFileSystem",
  "$timeout",
  function(
    $scope,
    $injector,
    spinalInspectUID,
    authService,
    $mdToast,
    $interval,
    spinalFileSystem,
    $timeout
  ) {
    $scope.injector = $injector;
    $scope.fs_path = [];
    let svgGroup, rootnode, draw, update, centerNode, textGrp;
    let tree_idx = 0;
    let depthLength = [];
    let viewerWidth = 50;
    let viewerHeight = 50;
    let ptr_folow = [];
    let animation_duration = 500;
    let style = {
      nodefill: {
        empty: "#fff", // or atomic or unknown
        ptrClosed: "#f00",
        objClosed: "#0010f2",
        lstClosed: "#00ab00",
        ptrEmptyOrOpen: "#f0a9a9",
        objEmptyOrOpen: "#87ceeb",
        lstEmptyOrOpen: "#7fffd4"
      }
    };
    let menu = d => {
      let apps = window.spinalDrive_Env.get_applications("Inspector", d);
      let res = [];
      let create_action_callback = app => {
        return function() {
          let share_obj = {
            model_server_id: d.data._server_id,
            scope: $scope
          };
          app.action(share_obj);
        };
      };

      for (var i = 0; i < apps.length; i++) {
        let app = apps[i];
        res.push({
          title: app.label,
          action: create_action_callback(app)
        });
      }
      return res;
    };

    let diagonal = (s, d) => {
      let path = `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`;
      return path;
    };
    let zoom = () => {
      if (d3.event.transform != null) {
        svgGroup.attr("transform", d3.event.transform);
      }
    };
    let calc_dist_depth = (depth, mult) => {
      let i = 0;
      let res = 0;
      while (i < depth) {
        res += depthLength[i] * 2;
        ++i;
      }
      res += depthLength[depth];
      res *= mult;
      return res;
    };
    angular.element(document).ready(function() {
      let uid = spinalInspectUID.get_last_uid();
      let elem = spinalInspectUID.elem[uid];
      viewerWidth = elem.width();
      viewerHeight = elem.height();
      let elem_id = "spinalinspect_" + uid;
      let element = d3.select("#" + elem_id);
      let tree = d3.tree().size([viewerHeight, viewerWidth]);
      let zoomListener = d3
        .zoom()
        .scaleExtent([0.1, 3])
        .on("zoom", zoom);
      centerNode = function(d) {
        let x, y;
        let depth = d.depth + 1;
        let scale = 1;
        x = 0;
        depth -= d.depth;
        y = -d.x0;
        let x_limit = 120;
        while (x < x_limit) {
          x = -rootnode.y0;
          x = (x * scale) + (viewerWidth / 2);
          x = x - ((calc_dist_depth(depth, 6) / 2) * scale);
          if (x < x_limit) scale -= 0.01;
        }
        x -= calc_dist_depth(d.depth, 6) * scale;
        y = (y * scale) + (viewerHeight / 2);
        baseSvg
          .transition()
          .duration(animation_duration)
          .call(
            zoomListener.transform,
            d3.zoomIdentity.translate(x, y).scale(scale)
          );
      };
      element.select("svg").remove();
      let baseSvg = element
        .append("svg")
        .attr("width", viewerWidth)
        .attr("height", viewerHeight)
        .classed("svg-content", true)
        .call(zoomListener);
      baseSvg.on("dblclick.zoom", null);

      let centerrootbtn = d3.select("#spinalinspect_btn_centerroot_" + uid);
      centerrootbtn.on("click", () => {
        if (!rootnode) return;
        centerNode(rootnode);
      });
      textGrp = baseSvg
        .append("text")
        .attr("class", "nodeText")
        .attr("x", viewerWidth / 2)
        .attr("y", viewerHeight / 2)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
        .attr("fill", "#999");
      svgGroup = baseSvg.append("g");

      let onNodeClick = d => {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        if (d.data.haveChild) {
          if (!(d.children || d._children)) {
            let m = window.FileSystem._objects[d.data._server_id];
            if (m) {
              if (m instanceof window.Ptr) {
                m.load(ptr => {
                  ptr.bind(onTreeChange, false);
                  let res = {};
                  ptr_folow.push(ptr);
                  pushToJson(ptr, res, d, d.depth + 2, d.depth + 1);
                  d.children = [res];
                  d.data.children = d.children;
                  update(d);
                  centerNode(d);
                });
                return;
              } else {
                pushToJson(m, d, d.parent, d.depth + 1, d.depth, d.data.name);
              }
            }
          }
        }
        update(d);
        centerNode(d);
      };
      draw = () => {
        baseSvg.attr("width", viewerWidth).attr("height", viewerHeight);
        if (textGrp)
        {textGrp
          .attr("x", viewerWidth / 2)
          .attr("y", viewerHeight / 2)
          .text(
            'Please Drop file from "File Explorer" here to inspect them.'
          );}
        if (!rootnode) return;
        rootnode.x0 = viewerHeight / 2;
        rootnode.y0 = 0;
        update(rootnode);
      };
      let click_focus = d => {
        centerNode(d);
      };
      update = source => {
        // let _tree = tree.size([viewerHeight, viewerWidth]);
        let _tree = tree.nodeSize([18, 300]);
        let treemap = _tree(rootnode);
        let nodes = treemap.descendants();
        let links = treemap.descendants().slice(1);
        nodes.forEach(d => {
          if (!depthLength[d.depth]) {depthLength[d.depth] = d.data.name.length;}
          else
          {depthLength[d.depth] = Math.max(
            d.data.name.length,
            depthLength[d.depth]
          );}
        });
        nodes.forEach(d => {
          d.y = calc_dist_depth(d.depth, 6);
        });

        let node = svgGroup.selectAll("g.node").data(nodes, d => {
          return d.id || (d.id = ++tree_idx);
        });

        let nodeEnter = node
          .enter()
          .append("g")
          .attr("class", "node")
          .attr("transform", () => {
            return "translate(" + source.y0 + "," + source.x0 + ")";
          })
          .on("mouseover", node_mouseover)
          .on("mousemove", function(d) {
            node_mousemove(d);
          })
          .on("mouseout", node_mouseout);

        nodeEnter
          .append("circle")
          .attr("class", "nodeCircle")
          .attr("r", 1e-6)
          .on("contextmenu", d3ContextMenu(menu))
          .on("click", onNodeClick);

        nodeEnter
          .append("text")
          .attr("x", d => {
            return d.children || d._children ? -10 : 10;
          })
          .attr("dy", ".35em")
          .attr("class", "nodeText")
          .attr("text-anchor", d => {
            return d.children || d._children ? "end" : "start";
          })
          .text(d => {
            return d.data.name;
          })
          .attr("fill", "#EEE")
          .on("click", click_focus)
          .on("contextmenu", d3ContextMenu(menu));

        var nodeUpdate = nodeEnter.merge(node);
        nodeUpdate
          .transition()
          .duration(animation_duration)
          .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")";
          });

        // Update the node attributes and style
        nodeUpdate
          .select("circle.nodeCircle")
          .attr("r", 8)
          .style("fill", function(d) {
            if (d.data.obj) {
              if (d.data.haveChild && !(d.children || d._children)) {
                return style.nodefill.objClosed;
              }
              if (d.children && d.children.length > 0)
              {return style.nodefill.objEmptyOrOpen;}
              if (!(d.children || d._children))
              {return style.nodefill.objEmptyOrOpen;}
              return style.nodefill.objClosed;
            } else if (d.data.lst) {
              if (d.data.haveChild && !(d.children || d._children)) {
                return style.nodefill.lstClosed;
              }
              if (d.children && d.children.length > 0)
              {return style.nodefill.lstEmptyOrOpen;}
              if (!(d.children || d._children))
              {return style.nodefill.lstEmptyOrOpen;}
              return style.nodefill.lstClosed;
            } else if (d.data.ptr) {
              if (d.data.haveChild && !(d.children || d._children)) {
                return style.nodefill.ptrClosed;
              }
              if (d.children && d.children.length > 0)
              {return style.nodefill.ptrEmptyOrOpen;}
              if (!(d.children || d._children))
              {return style.nodefill.ptrEmptyOrOpen;}
              return style.nodefill.ptrClosed;
            }
            return style.nodefill.empty; // default
          })
          .attr("cursor", "pointer");

        nodeUpdate
          .select("text.nodeText")
          .attr("x", d => {
            return d.children ? -10 : 10;
          })
          .attr("text-anchor", d => {
            return d.children ? "end" : "start";
          })
          .text(d => {
            return d.data.name;
          });

        let nodeExit = node
          .exit()
          .transition()
          .duration(animation_duration)
          .attr("transform", () => {
            return "translate(" + source.y + "," + source.x + ")";
          })
          .remove();
        nodeExit.select("circle").attr("r", 0);
        nodeExit.select("text").style("fill-opacity", 0);
        let link = svgGroup.selectAll("path.link").data(links, d => {
          return d.id;
          // return d.target.id;
        });
        let linkEnter = link
          .enter()
          .insert("path", "g")
          .attr("class", "link")
          .attr("d", () => {
            let o = {
              x: source.x0,
              y: source.y0
            };
            return diagonal(o, o);
          });

        // UPDATE
        let linkUpdate = linkEnter.merge(link);

        // Transition back to the parent element position
        linkUpdate
          .transition()
          .duration(animation_duration)
          .attr("d", d => {
            return diagonal(d, d.parent);
          });

        // Remove any exiting links
        link
          .exit()
          .transition()
          .duration(animation_duration)
          .attr("d", () => {
            let o = {
              x: source.x,
              y: source.y
            };
            return diagonal(o, o);
          })
          .remove();

        // Store the old positions for transition.
        nodes.forEach(d => {
          d.x0 = d.x;
          d.y0 = d.y;
        });
      };

      // resize
      let check_redraw = () => {
        if (viewerWidth != elem.width() || viewerHeight != elem.height()) {
          viewerWidth = elem.width();
          viewerHeight = elem.height();
          draw();
        }
      };

      let interval_resize = setInterval(check_redraw, 600);
      // let interval_resize = $interval(check_redraw, 600);
      $scope.$on("$destroy", function() {
        // $interval.cancel(interval_resize);
        clearInterval(interval_resize);
        interval_resize = undefined;
      });
    });

    let add_table_row = (table, key, value) => {
      let tr = table.append("tr");
      tr.append("td").text(key);
      tr.append("td").text(value);
    };

    function strncmp(a, b, n) {
      return a.substring(0, n) == b.substring(0, n);
    }

    function node_mouseover(d) {
      spinalInspectUID.tooltip
        .transition()
        .duration(300)
        .style("opacity", 1);
      spinalInspectUID.tooltip.selectAll("table").remove();
      let table = spinalInspectUID.tooltip.append("table");

      add_table_row(table, "Contructor", d.data._constructor);
      add_table_row(table, "Server_id", d.data._server_id);

      let m = window.FileSystem._objects[d.data._server_id];
      if (m) {
        let apps = window.spinalDrive_Env.get_applications("Inspector", d);
        for (var i = 0; i < apps.length; i++) {
          let app = apps[i];
          if (app.action_mouseover && app.action_mouseover instanceof Function)
          {app.action_mouseover(d, m, add_table_row, table);}
        }
        if (m instanceof window.Lst) {
          add_table_row(table, "Length", m.length);
        } else if (m instanceof window.Str) {
          let data = m.get();
          add_table_row(table, "Data", data);
          add_table_row(table, "Length", m.length);
          let imgtype = "data:image/";
          if (strncmp(data, imgtype, imgtype.length)) {
            let tr = table.append("tr");
            tr.append("td").text("Preview");
            let img = tr.append("td").append("img");
            img.attr("src", data);
            img.attr("alt", "preview");
            img.style("max-height", 100);
            img.style("max-width", 100);
          }
        } else if (m instanceof window.Val) {
          add_table_row(table, "Value", m.get());
        } else if (m instanceof window.Ptr) {
          add_table_row(table, "Target Ptr", m.data.value);
          // m.load(ptr => {
          //   if (ptr)
          //     add_table_row(table, "Target Contructor", ptr.constructor.name);
          // });
        } else if (m instanceof window.TypedArray) {
          add_table_row(table, "Data", m.get());
        }
      }
    }

    function node_mousemove() {
      spinalInspectUID.tooltip
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
    }

    function node_mouseout() {
      spinalInspectUID.tooltip
        .transition()
        .duration(300)
        .style("opacity", 1e-6);
    }
    let timeout_check_node = null;
    let timeout_update_graph = null;
    let onTreeChange = () => {
      if (timeout_check_node) return;
      // rootnode;
      timeout_check_node = $timeout(() => {
        timeout_check_node = null;
        check_nodes_rec(rootnode, rootnode.data.name);
        if (timeout_update_graph) return;
        timeout_update_graph = $timeout(() => {
          timeout_update_graph = null;
          update(rootnode);
        }, 500);
      }, 500);
    };
    let check_nodes_rec = (n, name) => {
      if (!(n && n.data && n.data._server_id)) return;
      let m = window.FileSystem._objects[n.data._server_id];
      if (m) {
        // if (!m.has_been_modified()) return;
        if (!name) name = n.data.name;
        n.data._constructor = m.constructor.name;
        n.data._server_id = m._server_id;
        if (m instanceof window.Val || m instanceof window.Bool) {
          n.data.name = n.data.name.replace(/ *= [.\-\w]*/g, "");
          n.data.name += ` = ${m.get()}`;
        } else if (m instanceof window.Str) {
          let str = m.get();
          if (str.length > 25) str = str.substring(0, 25) + "...";
          n.data.name = n.data.name.replace(/ *= *"*\w*.*"*/g, "");
          n.data.data = `${name} = "${m.get()}"`;
          n.data.name += ` = "${str}"`;
        } else if (m instanceof window.TypedArray) {
          n.data.name = n.data.name.replace(/ *= [0-9.e-]*/g, "");
          n.data.name += ` = ${m._size}`;
        } else if (m instanceof window.Ptr) {
          n.data.ptr = m.data.value;
          n.data.name = n.data.name.replace(/ *= *"*\w*"*/g, "");
          n.data.name += ` = "${m.data.value}"`;
          n.data.haveChild = true;
          let children = n.children || n._children;
          if (!children) return; // children not charged yet
          m.load(ptr => {
            if (children[0].data._server_id == ptr._server_id) {
              check_nodes_rec(children[0]);
            }
          });
        } else if (m instanceof window.Lst) {
          n.data.name = n.data.name.replace(/\[[0-9]*\]/g, "");
          n.data.name += `[${m.length}]`;
          n.data.lst = true;
          if (m.length === 0) {
            n.data.haveChild = false;
          } else {n.data.haveChild = true;}
          let children = n.children || n._children;
          if (!children) {
            // children not loaded yet
            return;
          }

          for (let i = 0; i < m.length; i++) {
            if (
              children[i] &&
              children[i].data &&
              children[i].data._server_id &&
              children[i].data._server_id === m[i]._server_id
            ) {
              check_nodes_rec(children[i]);
            } else {
              // check if already exist
              let j = i;
              let found = -1;
              for (; j < children.length; j++) {
                // children[j];
                if (
                  children[j] &&
                  children[j].data &&
                  children[j].data._server_id &&
                  children[j].data._server_id === m[i]._server_id
                ) {
                  found = j;
                  break;
                }
              }
              // if exist splice to remove and add it to the right place
              if (found != -1) {
                let items = children.splice(j, 1);
                if (items.length > 0) children.splice(i, 0, items[0]);
              }
              // if not exist create it
              else {
                let res = {};
                pushToJson(m[i], res, n, n.depth + 1, n.depth + 1);
                children.splice(i, 0, res);
              }
            }
          }
          if (m.length < children.length)
          {children.splice(m.length, children.length - m.length);}
          if (children.length === 0) {
            n.children = n._children = n.data.children = n.data._children = null;
          }
        } else if (m instanceof window.Model) {
          n.data.obj = true;
          n.data.name = n.data.name.replace(/{[0-9]*}/g, "");
          n.data.name += `{${m._attribute_names.length}}`;
          let i = 0;
          let children = n.children || n._children;
          if (m._attribute_names.length === 0) {
            n.data.haveChild = false;
          } else {n.data.haveChild = true;}
          if (!children) {
            return; // children not loaded yet
          }
          for (i = 0; i < children.length; i++) {
            children[i].data.used = false;
          }
          for (i = 0; i < m._attribute_names.length; i++) {
            let model_child = m[m._attribute_names[i]];
            let found = false;
            for (let j = 0; j < children.length; j++) {
              let child = children[j];
              if (
                child &&
                child.data &&
                child.data._server_id &&
                model_child._server_id === child.data._server_id
              ) {
                child.data.used = true;
                check_nodes_rec(child);
                found = true;
              }
            }
            if (found == false) {
              let res = {};
              pushToJson(model_child, res, n, n.depth + 1, n.depth + 1);
              res.data.used = true;
              children.push(res);
            }
          }
          i = 0;
          while (i < children.length) {
            if (!children[i].data.used) {
              children.splice(i, 1);
              continue;
            }
            i++;
          }
        }
      }
    };
    $scope.onFocus = () => {
      spinalFileSystem.setlastInspector($scope);
    };
    $scope.set_model = model_id => {
      for (var i = 0; i < ptr_folow.length; i++) {
        ptr_folow[i].unbind(onTreeChange);
      }
      ptr_folow = [];
      $scope.model = spinalFileSystem.lastfileSelected;
      let m = window.FileSystem._objects[model_id];
      if (m) {
        ptr_folow.push(m);
        m.bind(onTreeChange);
        $scope.new_tree(m);
      }
    };

    let pushToJson = (m, n, parent, max_depth = 1, depth = 0, name = null) => {
      if (!m) return;
      if (!name) name = m.constructor.name;
      n.parent = parent;
      n.depth = depth;
      n.data = {};
      n.data.name = name;
      n.data._constructor = m.constructor.name;
      n.data._server_id = m._server_id;

      ++depth;
      if (m instanceof window.Lst) {
        n.data.name = n.data.name.replace(/\[[0-9]*\]/g, "");
        n.data.name += `[${m.length}]`;
        n.data.lst = true;
        if (m.length == 0) {
          n.data.haveChild = false;
          return;
        }
        n.data.haveChild = true;
        if (depth > max_depth) {
          return;
        }
        n.children = [];
        n.data.children = n.children;
        for (let i = 0; i < m.length; i++) {
          let res = {};
          pushToJson(m[i], res, n, max_depth, depth);
          n.children.push(res);
        }
      } else if (m instanceof window.Val || m instanceof window.Bool) {
        n.data.name += ` = ${m.get()}`;
      } else if (m instanceof window.Str) {
        let str = m.get();
        if (str.length > 25) str = str.substring(0, 25) + "...";
        n.data.data = `${name} = "${m.get()}"`;
        n.data.name += ` = "${str}"`;
      } else if (m instanceof window.Ptr) {
        n.data.haveChild = true;
        n.data.ptr = m.data.value;
        n.data.name += ` = "${m.data.value}"`;
      } else if (m instanceof window.TypedArray) {
        n.data.name += ` = ${m._size}`;
      } else if (m instanceof window.Model) {
        n.data.obj = true;
        n.data.name = n.data.name.replace(/{[0-9]*}/g, "");
        n.data.name += `{${m._attribute_names.length}}`;
        if (depth > max_depth) {
          if (m._attribute_names.length > 0) {
            n.data.haveChild = true;
          }
          return;
        }
        n.children = [];
        n.data.children = n.children;
        for (var i = 0; i < m._attribute_names.length; i++) {
          let res = {};
          pushToJson(
            m[m._attribute_names[i]],
            res,
            n,
            max_depth,
            depth,
            m._attribute_names[i]
          );
          n.children.push(res);
        }
      }
    };

    let toJson = (
      m,
      n,
      max_depth = 1,
      depth = 0,
      name = m.constructor.name
    ) => {
      n.name = name;
      n._constructor = m.constructor.name;
      n._server_id = m._server_id;

      ++depth;
      if (m instanceof window.Lst) {
        n.name += `[${m.length}]`;
        n.lst = true;
        if (m.length == 0) return;
        if (depth > max_depth) {
          return;
        }
        n.haveChild = true;
        n.children = [];
        for (let i = 0; i < m.length; i++) {
          let res = {};
          toJson(m[i], res, max_depth, depth);
          n.children.push(res);
        }
      } else if (m instanceof window.Val || m instanceof window.Bool) {
        n.name += ` = ${m.get()}`;
      } else if (m instanceof window.Str) {
        let str = m.get();
        if (str.length > 25) str = str.substring(0, 25) + "...";
        n.data = `${name} = "${m.get()}"`;
        n.name += ` = "${str}"`;
      } else if (m instanceof window.Ptr) {
        n.haveChild = true;
        n.ptr = m.data.value;
        n.name += ` = "${m.data.value}"`;
      } else if (m instanceof window.TypedArray) {
        n.name += ` = ${m._size}`;
      } else if (m instanceof window.Model) {
        n.obj = true;
        n.name += `{${m._attribute_names.length}}`;
        if (depth > max_depth) {
          if (m._attribute_names.length > 0) {
            n.haveChild = true;
          }
          return;
        }
        n.children = [];
        for (var i = 0; i < m._attribute_names.length; i++) {
          let res = {};
          toJson(
            m[m._attribute_names[i]],
            res,
            max_depth,
            depth,
            m._attribute_names[i]
          );
          n.children.push(res);
        }
      }
    };

    $scope.new_tree = model => {
      if (!model) return;
      if (textGrp) textGrp.remove();
      textGrp = null;
      let res = {};
      toJson(model, res);
      rootnode = d3.hierarchy(res, function(d) {
        return d.children;
      });
      if (draw) {
        draw();
        centerNode(rootnode);
      }
    };

    $scope.folderDropCfg = {
      drop: event => {
        event.stopPropagation(); // Stops some browsers from redirecting.
        event.preventDefault();
        let selected = spinalFileSystem.FE_selected_drag;
        if (selected && selected[0]) {
          // change to multiple selection later
          $scope.fs_path = Array.from(spinalFileSystem.FE_fspath_drag);
          $scope.fs_path.push({
            name: selected[0].name,
            _server_id: selected[0]._server_id
          });
          $scope.set_model(selected[0]._server_id);
        }
        return false;
      },
      dragover: event => {
        event.preventDefault();

        return false;
      },
      dragenter: event => {
        event.preventDefault();
        return false;
      }
    };
    spinalFileSystem.setlastInspector($scope);
    $scope.set_model(spinalFileSystem.lastfileSelected);
  }
]);
