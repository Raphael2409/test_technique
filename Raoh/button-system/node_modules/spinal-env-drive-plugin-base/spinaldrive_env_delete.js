(function () {
  var SpinalDrive_App_FileExplorer_delete = require('./base/SpinalDrive_App_delete').FileExplorerDelete;
  var SpinalDrive_App_FolderExplorer_delete = require('./base/SpinalDrive_App_delete').FolderExplorerDelete;
  spinalDrive_Env.add_applications('FileExplorer', new SpinalDrive_App_FileExplorer_delete());
  spinalDrive_Env.add_applications('FolderExplorer', new SpinalDrive_App_FolderExplorer_delete());
})();