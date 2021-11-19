require("spinal-core-connectorjs");
const spinalEnvDriveCore = require("spinal-env-drive-core");
const angular = require("angular");
/**
 * SpinalDrive_App_FileExplorer_delete
 * @extends {SpinalDrive_App}
 */
class SpinalDrive_App_FileExplorer_delete extends spinalEnvDriveCore.SpinalDrive_App {
  /**
   * Creates an instance of SpinalDrive_App_FileExplorer_delete.
   * @memberof SpinalDrive_App_FileExplorer_delete
   */
  constructor() {
    super("DeleleFileExplorer", "Delete", 1, "delete", "Delete the file");
    this.order_priority = -1;
    // super("DeleleFileExplorer", "Delete", 1, "delete", "Delete the file",
    // "delete", ["all"], "all");
  }
  /**
   * method to handle the selection
   *
   * @param {any} element
   * @memberof SpinalDrive_App_FileExplorer_delete
   */
  action(obj) {
    let mdDialog = obj.scope.injector.get("$mdDialog");
    let content = "Are you sure to delete the file / folder";
    if (obj && obj.file && obj.file.name) content += " : " + obj.file.name;
    let newFolder_prompt = mdDialog
      .confirm()
      .title("Delete")
      .textContent(content)
      .ariaLabel("Delete Directory file")
      .clickOutsideToClose(true)
      .ok("Confirm")
      .cancel("Cancel");

    mdDialog.show(newFolder_prompt).then(
      function() {
        if (
          !(
            obj &&
            obj.scope &&
            obj.scope.curr_dir &&
            obj.file &&
            obj.file._server_id
          )
        ) {
          return;
        }
        let f = window.FileSystem._objects[obj.file._server_id];
        if (f) {
          let m_parent = obj.scope.curr_dir;
          for (var i = 0; i < m_parent.length; i++) {
            if (
              m_parent[i]._server_id == f._server_id &&
              obj.file.name == m_parent[i].name.get()
            ) {
              m_parent.remove_ref(m_parent[i]);
              break;
            }
          }
        }
      },
      function() {}
    );
  }

  is_shown(d) {
    if (d && d.file && d.file._server_id) {
      let file = window.FileSystem._objects[d.file._server_id];
      if (file && file._info && file._info.model_type) {
        if (
          file._info.model_type.get() === "Synchronized Directory" ||
          file._info.model_type.get() === "HttpPath"
        ) {
          return false;
        }
        return true;
      }
    }
    return false;
  }
}

module.exports.SpinalDrive_App_FileExplorer_delete = SpinalDrive_App_FileExplorer_delete;

/**
 * SpinalDrive_App_FolderExplorer_delete
 * @extends {SpinalDrive_App}
 */
class SpinalDrive_App_FolderExplorer_delete extends spinalEnvDriveCore.SpinalDrive_App {
  /**
   * Creates an instance of SpinalDrive_App_FolderExplorer_delete.
   * @memberof SpinalDrive_App_FolderExplorer_delete
   */
  constructor() {
    super(
      "DeleleFolderExplorer",
      "Delete",
      0,
      "fa fa-trash text-danger",
      "Delete the file"
    );
    // super("DeleleFolderExplorer", "Delete", 0, "fa fa-trash text-danger",
    // "Delete the file", "delete", ["all"], "all");
  }

  is_shown(d) {
    if (d.parent === "#") return false;
    if (d && d.original && d.original.fileId) {
      const file = window.FileSystem._objects[d.original.fileId];
      if (file && file._info && file._info.model_type) {
        if (
          file._info.model_type.get() === "Synchronized Directory" ||
          file._info.model_type.get() === "HttpPath"
        ) {
          return false;
        }
        return true;
      }
    }
    return false;
  }

  /**
   * method to handle the selection
   *
   * @param {any} element
   * @memberof SpinalDrive_App_FolderExplorer_delete
   */
  action(obj) {
    let mdDialog = obj.scope.injector.get("$mdDialog");
    const file = window.FileSystem._objects[obj.node.original.fileId];
    if (file && file._info && file._info.visaValidation) {
      mdDialog.show(
        mdDialog
          .alert()
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title("Sorry")
          .textContent(
            "Sorry this file has already been sent for validation !!!"
          )
          .ariaLabel("Alert")
          .ok("OK")
          .targetEvent(obj.evt)
      );
      return;
    }

    // let spinalFileSystem = obj.scope.injector.get("spinalFileSystem");
    let content = "Are you sure to delete the folder";
    if (obj && obj.node && obj.node.text) content += " : " + obj.node.text;
    let newFolder_prompt = mdDialog
      .confirm()
      .title("Delete")
      .textContent(content)
      .ariaLabel("Delete Directory file")
      .clickOutsideToClose(true)
      .ok("Confirm")
      .cancel("Cancel");

    mdDialog.show(newFolder_prompt).then(
      function() {
        const parentDir =
          window.FileSystem._objects[
            obj.node.original.pDirId
          ];
        if (parentDir) {
          parentDir.remove_ref(file);
        }
      },
      function() {}
    );
  }
}
module.exports.SpinalDrive_App_FolderExplorer_delete = SpinalDrive_App_FolderExplorer_delete;

/**
 * SpinalDrive_App_FileExplorer_currdir_delete
 * @extends {SpinalDrive_App}
 */
class SpinalDrive_App_FileExplorer_currdir_delete extends spinalEnvDriveCore.SpinalDrive_App {
  /**
   * Creates an instance of SpinalDrive_App_FileExplorer_currdir_delete.
   * @memberof SpinalDrive_App_FileExplorer_currdir_delete
   */
  constructor() {
    super(
      "DeleleFileExplorer_currdir",
      "Delete Selected",
      1,
      "delete",
      "Delete the selected file(s)"
    );
    this.order_priority = -1;
  }
  /**
   * method to handle the selection
   *
   * @param {any} element
   * @memberof SpinalDrive_App_FileExplorer_currdir_delete
   */
  action(obj) {
    let mdDialog = obj.scope.injector.get("$mdDialog");
    let content = "Are you sure to delete the file(s) / folder(s)";
    let files = [];
    let filesIgnore = [];
    for (var i = 0; i < obj.scope.directory.length; i++) {
      if (obj.scope.directory[i].selected === true) {
        if (
          obj.scope.directory[i].model_type !== "HttpPath" ||
          obj.scope.directory[i].model_type !== "Synchronized Directory"
        ) {
          filesIgnore.push(obj.scope.directory[i]);
        } else {
          files.push(obj.scope.directory[i]);
        }
      }
    }

    if (files.length > 0) {
      content += " : " + files.map(x => x.name).join(", ");
    }
    if (filesIgnore.length > 0) {
      content += " \n ignored: " + filesIgnore.map(x => x.name).join(", ");
    }
    let newFolder_prompt = mdDialog
      .confirm()
      .title("Delete")
      .textContent(content)
      .ariaLabel("Delete Directory file")
      .clickOutsideToClose(true)
      .ok("Confirm")
      .cancel("Cancel");

    mdDialog.show(newFolder_prompt).then(
      function() {
        let m_parent = obj.model;
        for (var y = 0; y < files.length; y++) {
          let f = window.FileSystem._objects[files[y]._server_id];
          if (f) {
            for (var i = 0; i < m_parent.length; i++) {
              if (
                m_parent[i]._server_id == f._server_id &&
                files[y].name == m_parent[i].name.get()
              ) {
                m_parent.remove_ref(m_parent[i]);
                break;
              }
            }
          }
        }
      },
      function() {}
    );
  }

  is_shown(d) {
    for (var i = 0; i < d.scope.directory.length; i++) {
      if (d.scope.directory[i].selected === true) return true;
    }
    return false;
  }
}
module.exports.SpinalDrive_App_FileExplorer_currdir_delete = SpinalDrive_App_FileExplorer_currdir_delete;
