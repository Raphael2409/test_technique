var angular = require("angular");
angular.module("app.spinalcom").service("spinalFileSystem", [
  "$q",
  "spinalModelDictionary",
  "ngSpinalCore",
  function($q, spinalModelDictionary, ngSpinalCore) {
    let initPromise = null;
    this.current_dir = 0;
    this.model = 0;
    this.id = 1;
    this.folderExplorer_dir = {};
    let listener_list = {};
    this.curr_window = 0;

    this.emit_subcriber = (name, arg) => {
      let listeners = listener_list[name];
      if (listeners) {
        for (var i = 0; i < listeners.length; i++) {
          if (listeners[i]) listeners[i](arg);
        }
      }
    };
    this.subcribe = (name, listener) => {
      let listeners = listener_list[name];
      if (!listeners) {
        listener_list[name] = [];
        listeners = listener_list[name];
      }
      listeners.push(listener);
      return () => {
        let indexOfListener = listeners.indexOf(listener);
        if (indexOfListener !== -1) {
          listeners[indexOfListener] = null;
        }
      };
    };
    this.unsubcribe = (name, listener) => {
      let listeners = listener_list[name];
      let indexOfListener = listeners.indexOf(listener);
      if (indexOfListener !== -1) {
        listeners[indexOfListener] = null;
      }
    };
    this.init = () => {
      if (initPromise !== null) return initPromise;
      initPromise = spinalModelDictionary.init().then(
        m => {
          this.model = m;
          this.current_dir = m;
          this.model.bind(() => {
            this.emit_subcriber("SPINAL_FS_ONCHANGE");
          });
        },
        () => {
          initPromise = null;
        }
      );
      return initPromise;
    };

    function createDirProcessObj(uid, process, dir) {
      return { uid, process, dir };
    }
    let dirMap = new Map();
    this.currDirModified = (newDir, uid) => {
      if (dirMap.has(uid) === true) {
        const dirProc = dirMap.get(uid);
        dirProc.dir.unbind(dirProc.process);
        dirMap.delete(uid);
      }
      const dirProc = createDirProcessObj(
        uid,
        newDir.bind(() => {
          this.emit_subcriber("SPINAL_FS_ONCHANGE");
        }),
        newDir
      );
      dirMap.set(uid, dirProc);
    };

    this.openFolder = (all_dir, node) => {
      if (this.curr_window && window.FileSystem._objects[node.original.model]) {
        this.curr_window.change_curr_dir(
          window.FileSystem._objects[node.original.model],
          this.create_path_with_node(node)
        );
      }
    };

    this.newFolder = (all_dir, data, name) => {
      let f = window.FileSystem._objects[data.original.model];
      if (f) {
        let folder_name = name;
        let base_folder_name = folder_name.replace(/\([\d]*\)/g, "");
        let x = 0;
        while (f.has(folder_name)) {
          folder_name = base_folder_name + "(" + x + ")";
          x++;
        }
        f.add_file(folder_name, new window.Directory());
      }
    };
    this.FileExplorer_focus = scope => {
      this.curr_window = scope;
    };

    this.create_path_with_node = data => {
      return [data, ...data.parents].reverse().map(item => {
        return {
          name: item.text,
          _server_id: item.model
        };
      });
    };

    this.select_node = (node, path) => {
      if (node.original.dirId === this.model._server_id) {
        this.curr_window.change_curr_dir(this.model, [
          {
            name: "root",
            _server_id: this.model._server_id
          }
        ]);
      } else {
        const file = window.FileSystem._objects[node.original.fileId];
        if (this.curr_window && file) {
          ngSpinalCore.loadModelPtr(file).then(directory => {
            this.curr_window.change_curr_dir(
              directory,
              path.map(e => {
                if (e.dirId === this.model._server_id) {
                  return {
                    name: "root",
                    _server_id: this.model._server_id
                  };
                }
                return {
                  name: e.text,
                  _server_id: e.fileId
                };
              })
            );
          });
        }
      }
    };

    this.deleteFolder = (all_dir, node) => {
      let f = window.FileSystem._objects[node.original.model];
      if (f) {
        let parent = all_dir[node.original.parent];
        if (window.FileSystem._objects[parent.model]) {
          let m_parent = window.FileSystem._objects[parent.model];
          for (var i = 0; i < m_parent.length; i++) {
            if (
              m_parent[i]._ptr.data.value == f._server_id &&
              node.original.text == m_parent[i].name.get()
            ) {
              m_parent.remove_ref(m_parent[i]);
              break;
            }
          }
        }
      }
    };

    this.handle_FE_progressBar = (model, item) => {
      if (model._info.model_type.get() === "Path") {
        if (model._info.remaining.get() != 0) {
          let percent =
            (model._info.to_upload.get() - model._info.remaining.get()) /
            model._info.to_upload.get();
          item.upload_pecent = percent * 100;
        }
      } else if (
        model._info.model_type.get() === "BIM Project" ||
        model._info.model_type.get() === "Digital twin"
      ) {
        if (model._info.state) {
          switch (model._info.state.num.get()) {
            case 0:
              item.upload_pecent = 10;
              break;
            case 1:
              item.upload_pecent = 18;
              break;
            case 2:
              item.upload_pecent = 36;
              break;
            case 3:
              item.upload_pecent = 54;
              break;
            case 4:
              item.upload_pecent = 72;
              break;
            case 5:
              item.upload_pecent = 80;
              break;
            case 6:
              item.upload_pecent = 90;
              break;
            case 7:
              break;
            case 8:
              item.upload_pecent = 100;
              item.error = true;
              break;
            // no default
          }
        }
      }
    };
    let wait_tmp_serverid_loop = (scope, deferred, model) => {
      if (
        !model._server_id ||
        window.FileSystem._tmp_objects[model._server_id]
      ) {
        setTimeout(() => {
          wait_tmp_serverid_loop(scope, deferred, model);
        }, 100);
      } else {
        let item = {
          name: model.name.get(),
          model_type: model._info.model_type.get(),
          _server_id: model._server_id,
          owner: scope.user.username,
          visa: model._info.visaValidation
            ? model._info.visaValidation.isValid.get()
            : -1
        };
        try {
          window.SpinalDrive_App._getOrCreate_log(model).then(
            logs => {
              if (logs.length === 0) {
                let tab = {
                  date: Date.now(),
                  name: scope.user.username,
                  action: "1st visit"
                };
                window.SpinalDrive_App._pushLog(logs, tab);
              }

              item.created_at = logs[0].date;
              item.log = logs;

              this.handle_FE_progressBar(model, item);
              deferred.resolve(item);
            },
            () => {
              wait_tmp_serverid_loop(scope, deferred, model);
            }
          );
        } catch (e) {
          try {
            this.handle_FE_progressBar(model, item);
            deferred.resolve(item);
          } catch (e) {
            deferred.resolve(item);
          }
        }
      }
    };
    let create_file_explorer_obj = (scope, model) => {
      let deferred = $q.defer();
      wait_tmp_serverid_loop(scope, deferred, model);
      return deferred.promise;
    };

    this.getFolderFiles = scope => {
      return this.init().then(() => {
        if (!scope.curr_dir) {
          scope.curr_dir = this.model;
          scope.fs_path.push({
            name: "root",
            _server_id: this.model._server_id
          });
        }

        let q = [];
        for (var i = 0; i < scope.curr_dir.length; i++) {
          let f = scope.curr_dir[i];
          q.push(create_file_explorer_obj(scope, f));
        }
        return $q.all(q);
      });
    };

    this.FE_selected_drag = [];
    this.FE_init_dir_drag = 0;
    this.FE_fspath_drag = [];
    this.FE_visited_scope = [];
    this.addScopeVisted = scope => {
      for (var i = 0; i < this.FE_visited_scope.length; i++) {
        if (this.FE_visited_scope[i] == scope) return;
      }
      this.FE_visited_scope.push(scope);
    };

    this.fileSelected = model_id => {
      this.lastfileSelected = model_id;
      if (this.lastinspector) {
        this.lastinspector.set_model(this.lastfileSelected);
      }
    };
    this.setlastInspector = scope => {
      this.lastinspector = scope;
    };

    return this;
  }
]);
