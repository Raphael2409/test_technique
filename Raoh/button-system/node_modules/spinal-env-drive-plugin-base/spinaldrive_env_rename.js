(function () {
  var SpinalDrive_App_FileExplorer_rename = require('./base/SpinalDrive_App_renameFile.js').FileExplorerRename;
  spinalDrive_Env.add_applications('FileExplorer', new SpinalDrive_App_FileExplorer_rename());
})();