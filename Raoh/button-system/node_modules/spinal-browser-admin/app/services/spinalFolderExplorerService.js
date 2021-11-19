var spinalCore = require("spinal-core-connectorjs");
var angular = require("angular");

var File = spinalCore._def["File"];
angular.module("app.spinalcom").factory("spinalFolderExplorerService", [
  "spinalModelDictionary",
  "ngSpinalCore",
  "$q",
  "spinalFileSystem",
  function(spinalModelDictionary, ngSpinalCore, $q, spinalFileSystem) {
    const factory = {};
    let uid = 0;
    function get_uid() {
      return uid++;
    }
    let initPromise = null;
    let rootDirectory = null;
    let rootFile = null;
    const setModelBinded = new Set();
    const mapWatchFrame = new Map();
    const mapCreatedItem = new Map();
    function waitModelRdy_loop(model, resolve) {
      if (
        model._server_id &&
        typeof window.FileSystem._objects[model._server_id] !== "undefined"
      ) {
        return resolve();
      }
      setTimeout(() => {
        waitModelRdy_loop(model, resolve);
      }, 200);
    }

    function waitModelRdy(model) {
      return new Promise(resolve => {
        waitModelRdy_loop(model, resolve);
      });
    }

    function getPtrTargetID(ptr) {
      if (ptr.data) {
        if (ptr.data.value) {
          return ptr.data.value;
        } else if (ptr.data.model && ptr.data.model) {
          return ptr.data.model._server_id;
        }
      }
    }
    function sendUpdateToFrames(obj) {
      for (const [, fctOnChangeModel] of mapWatchFrame) {
        fctOnChangeModel(obj);
      }
    }

    async function onChangeDirectoryModel(directoryModel, path) {
      const promises = [];
      for (let idx = 0; idx < directoryModel.length; idx++) {
        promises.push(waitModelRdy(directoryModel[idx]));
      }
      await Promise.all(promises);
      const item = mapCreatedItem.get(path);
      sendUpdateToFrames(
        createItemObjByDirectory(item.id, directoryModel, path)
      );
    }

    function createItemObjByDirectory(parentFileId, directoryModel, path) {
      const parent = mapCreatedItem.get(path);
      const res = {
        id: parentFileId.toString(),
        children: []
      };
      bindPathDirectory(directoryModel, path);
      for (let idx = 0; idx < directoryModel.length; idx++) {
        const file = directoryModel[idx];
        if (
          file &&
          file._info &&
          file._info.model_type &&
          (file._info.model_type.get() === "Directory" ||
            file._info.model_type.get() === "Synchronized Directory")
        ) {
          const childPath = [path, itemUID].join("/");
          res.children.push(
            createItem(
              childPath,
              parentFileId,
              file.name.get(),
              false,
              file._server_id,
              getPtrTargetID(file._ptr),
              parent.fileId,
              parent.dirId
            )
          );
        }
      }
      return res;
    }
    function existInSet(dir, p) {
      for (const { dirID, path } of setModelBinded) {
        if (dirID === dir._server_id && path === p) return true;
      }
      return false;
    }

    async function bindPathDirectory(dir, path) {
      await waitModelRdy(dir);
      if (existInSet(dir, path) === true) {
        return;
      }
      const o = { dirID: dir._server_id, path };
      setModelBinded.add(o);
      dir.bind(() => {
        setTimeout(() => {
          onChangeDirectoryModel(dir, path);
        }, 100);
      }, false);
    }

    function init() {
      if (initPromise !== null) return initPromise;
      initPromise = spinalModelDictionary.init().then(m => {
        rootDirectory = m;
        rootFile = new File("root", m);
        return;
      });
      // .then(usersDir => {
      //   let user = authService.get_user();
      //   for (let idx = 0; idx < usersDir.length; idx++) {
      //     const userDir = usersDir[idx];
      //     if (userDir.name.get() === user.username) {
      //       rootFile = userDir;
      //       return;
      //     }
      //   }
      // });
      return initPromise;
    }

    function getItemName(itemId) {
      return itemId;
    }

    function getChildren(id, parents) {
      let pathArr = parents.map(getItemName).reverse();
      pathArr.push(id);
      const path = pathArr.join("/");
      const parentNode = mapCreatedItem.get(path);
      if (typeof parentNode === "undefined") {
        throw new Error(`parentNode of ${id} not found. path = [${path}]`);
      }
      if (parentNode.dirId === rootDirectory._server_id) {
        return $q.resolve(createItemObjByDirectory(id, rootDirectory, path));
      } else {
        const file = window.FileSystem._objects[Number(parentNode.fileId)];
        return ngSpinalCore.loadModelPtr(file).then(directoryModel => {
          return createItemObjByDirectory(id, directoryModel, path);
        });
      }
    }
    let itemUID = 0;
    function createItem(
      path,
      parent,
      text,
      opened,
      fileId,
      dirId,
      pFileId,
      pDirId
    ) {
      if (mapCreatedItem.has(path) === true) {
        const o = mapCreatedItem.get(path);
        o.text = text;
        o.children = true;
        return o;
      }
      const obj = {
        id: (itemUID++).toString(10),
        parent: parent.toString(10),
        children: true,
        text,
        state: { opened },
        fileId,
        dirId,
        pFileId,
        pDirId
      };
      mapCreatedItem.set(path, obj);
      return obj;
    }

    function registerWatcher(uid, fctOnChangeModel) {
      const rootFilePromise = init().then(() => {
        mapWatchFrame.set(uid, fctOnChangeModel);
        const filename = `root`;
        const path = `#/${itemUID}`;
        const item = createItem(
          path,
          "#",
          filename,
          true,
          rootFile._server_id,
          getPtrTargetID(rootFile._ptr),
          undefined,
          undefined
        );
        const res = {
          id: "#",
          children: [item]
        };

        bindPathDirectory(rootDirectory, path);
        return res;
      });
      const unregisterFct = () => {
        mapWatchFrame.delete(uid);
      };
      return { rootFilePromise, unregisterFct };
    }

    function selectNode(node) {
      const nodePath = [node.id, ...node.parents]
        .reverse()
        .map(e => {
          for (const [, item] of mapCreatedItem) {
            if (item.id === e) return item;
          }
        })
        .filter(e => typeof e !== "undefined");
      spinalFileSystem.select_node(node, nodePath);
    }

    factory.get_uid = get_uid;
    factory.init = init;
    factory.registerWatcher = registerWatcher;
    factory.getChildren = getChildren;
    factory.selectNode = selectNode;
    return factory;
  }
]);
