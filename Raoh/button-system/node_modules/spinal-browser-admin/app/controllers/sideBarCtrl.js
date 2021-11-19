var angular = require("angular");
var $ = require("jquery");

angular
  .module("app.sidebar", [
    // "jsTree.directive",
    "app.services", "app.spinalcom"])
  .controller("sideBarCtrl", [
    "$scope",
    "spinalFileSystem",
    "$mdDialog",
    "$injector",
    "spinalFolderExplorerService",
    function(
      $scope,
      spinalFileSystem,
      $mdDialog,
      $injector,
      spinalFolderExplorerService
    ) {
      $scope.injector = $injector;
      const UID = spinalFolderExplorerService.get_uid();
      $scope.jsTreeId = `spinal-js-tree-${UID}`;
      let unregisterWatcherFct;
      setTimeout(() => {
        $scope.$apply();
        const res = spinalFolderExplorerService.registerWatcher(
          UID,
          onChangeModel
        );
        res.rootFilePromise.then(updateDirectory => {
          mapData.set(updateDirectory.id, updateDirectory.children);
          init();
        });
        unregisterWatcherFct = res.unregisterFct;
      }, 100);

      /**
       * key = directoryId;
       *
       * fileDefObj : {
       *   name : string,
       *   id : number,
       *   targetDirectoryId : number,
       *   directoryParent : number
       * }
       *
       *  @type Map<string, fileDefObj[]>
       */
      const mapData = new Map();
      $scope.mapData = mapData;
      let isInit = false;
      const init = () => {
        if (isInit === true) return;
        isInit = true;
        const jstreeElem = $(`#${$scope.jsTreeId}`);
        jstreeElem.jstree({
          core: {
            themes: {
              name: "default-dark",
              responsive: true
            },
            check_callback: true,
            data: getChildren
          },
          plugins: ["contextmenu"],
          contextmenu: {
            select_node: false,
            items: getContextMenuItems
          }
        });
        jstreeElem.on("$destroy", unregisterWatcherFct);
        jstreeElem.on("select_node.jstree", onSelectNode);
      };
      function onSelectNode(e, data) {
        spinalFolderExplorerService.selectNode(data.node);
      }
      function getContextMenuItems(node) {
        let apps = window.spinalDrive_Env.get_applications(
          "FolderExplorer",
          node
        );
        let res = {};
        for (var i = 0; i < apps.length; i++) {
          let app = apps[i];
          let share_obj = {
            node: node,
            model_server_id: node.original.file,
            scope: $scope
          };
          res[app.name] = {
            label: app.label,
            icon: app.icon,
            action: app.action.bind(app, share_obj)
          };
        }
        return res;
      }

      function getChildren(node, cb) {
        if (mapData.has(node.id) === true) {
          cb(mapData.get(node.id));
        } else {
          spinalFolderExplorerService
            .getChildren(node.id, node.parents, node.text)
            .then(updateDirectory => {
              mapData.set(updateDirectory.id, updateDirectory.children);
              cb(updateDirectory.children);
            });
        }
      }

      function getArrayDiff(orig, to, comparator) {
        const toAdd = to.filter(
          x => orig.findIndex(el => comparator(el, x)) === -1
        );
        const { toRm, toUpdate } = orig.reduce(
          (res, x) => {
            const idx = to.findIndex(el => comparator(el, x));
            if (idx >= 0) {
              res.toUpdate.push([x, to[idx]]);
            } else {
              res.toRm.push(x);
            }
            return res;
          },
          { toRm: [], toUpdate: [] }
        );
        return {
          toAdd,
          toRm,
          toUpdate
        };
      }
      function onChangeModel(updateDirectory) {
        if (mapData.has(updateDirectory.id) === false) return;
        const dirChild = mapData.get(updateDirectory.id);
        mapData.set(updateDirectory.id, updateDirectory.children);

        const diff = getArrayDiff(
          dirChild,
          updateDirectory.children,
          (a, b) => a.id === b.id
        );
        const treeContainer = $(`#${$scope.jsTreeId}`);
        const tree = treeContainer.jstree(true);
        if (diff.toRm.length > 0) {
          tree.delete_node(diff.toRm.map(x => x.id));
        }
        for (const node of diff.toAdd) {
          tree.create_node(updateDirectory.id, node);
        }
        for (const [orig, to] of diff.toUpdate) {
          if (orig.text !== to.text) {
            treeContainer.jstree("rename_node", to.id, to.text);
          }
        }
      }
    }
  ]);
