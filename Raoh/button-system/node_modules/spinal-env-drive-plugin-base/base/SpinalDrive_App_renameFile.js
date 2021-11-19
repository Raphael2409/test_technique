const spinalEnvDriveCore = require("spinal-env-drive-core");
const SpinalDrive_App = spinalEnvDriveCore.SpinalDrive_App;

const spinalCore = require("spinal-core-connectorjs");
const FileSystem = spinalCore._def['FileSystem'];

/**
 * SpinalDrive_App_FileExplorer_rename
 * @extends {SpinalDrive_App}
 */
class SpinalDrive_App_FileExplorer_rename extends SpinalDrive_App {
  /**
   * Creates an instance of SpinalDrive_App_FileExplorer_rename.
   * @memberof SpinalDrive_App_FileExplorer_rename
   */
  constructor() {
    super("RenameFileExplorer", "Rename...", 1, "edit", "Rename a File");
  }
  /**
   * method to handle the selection
   *
   * @param {any} element
   * @memberof SpinalDrive_App_FileExplorer_rename
   */
  action(obj) {
    let mdDialog = obj.scope.injector.get("$mdDialog");
    let f = FileSystem._objects[obj.file._server_id];
    var confirm = mdDialog
      .prompt()
      .title("Rename")
      .placeholder("File Name")
      .ariaLabel("Rename")
      .clickOutsideToClose(true)
      .required(true)
      .ok("Rename!")
      .cancel("Cancel");
    if (f && f.name && f.name.get()) {
      confirm.initialValue(f.name.get());
    }

    mdDialog.show(confirm).then(
      function(result) {
        if (f.name.get() === result) return;
        let regex = /^[a-z0-9 ._-]+(\.[a-z0-9_-]+)?$/gim;
        if (regex.test(result) === false) {
          let mdToast = obj.scope.injector.get("$mdToast");
          mdToast.show(
            mdToast
              .simple()
              .theme("error-toast")
              .textContent(`The name "${result}" is not a valid name.`)
          );
          return;
        }
        for (let i = 0; i < obj.scope.curr_dir.length; i++) {
          if (obj.scope.curr_dir[i].name.get() === result) {
            let mdToast = obj.scope.injector.get("$mdToast");

            mdToast.show(
              mdToast
                .simple()
                .theme("error-toast")
                .textContent("Error rename: File with this name already exist.")
            );
            // mdToast.showSimple();
            return;
          }
        }
        f.name.set(result);
        // .newFolder(null, obj, result);
      },
      function() {}
    );
  }
}

module.exports.FileExplorerRename = SpinalDrive_App_FileExplorer_rename;

// /**
//  * SpinalDrive_App_FolderExplorer_rename
//  * @extends {SpinalDrive_App}
//  */
// class SpinalDrive_App_FolderExplorer_rename extends SpinalDrive_App {

//   /**
//    * Creates an instance of SpinalDrive_App_FolderExplorer_rename.
//    * @memberof SpinalDrive_App_FolderExplorer_rename
//    */
//   constructor() {
//     super("RenameFolderExplorer", "Rename...", 1, "fa fa-pencil", "Rename a File");
//   }
//   /**
//    * method to handle the selection
//    *
//    * @param {any} element
//    * @memberof SpinalDrive_App_FolderExplorer_rename
//    */
//   action(obj) {
//     let mdDialog = obj.scope.injector.get('$mdDialog');
//     let  = obj.scope.injector.get('');
//     console.log(obj);
//     let f = FileSystem._objects[obj.model_server_id];
//     var confirm = mdDialog.prompt()
//       .title('Rename')
//       .placeholder('File Name')
//       .ariaLabel('Rename')
//       .clickOutsideToClose(true)
//       .required(true)
//       .ok('Rename!')
//       .cancel('Cancel');
//     console.log(f);
//     if (f && f.name && f.name.get()) {
//       confirm.initialValue(f.name.get());
//     }

//     mdDialog.show(confirm).then(function (result) {
//       f.name.set(result);
//     }, function () {});
//   }
// }

// module.exports.FolderExplorerRename = SpinalDrive_App_FolderExplorer_rename;
