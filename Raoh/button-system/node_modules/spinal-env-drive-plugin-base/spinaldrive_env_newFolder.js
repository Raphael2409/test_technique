(function () {
  var SpinalDrive_App_FolderExplorer_newFolder = require('./base/SpinalDrive_App_newFolder.js').FolderExplorerNewFolder;
  spinalDrive_Env.add_applications('FolderExplorer', new SpinalDrive_App_FolderExplorer_newFolder());
  var SpinalDrive_App_FileExplorer_currdir_newFolder = require('./base/SpinalDrive_App_newFolder.js').FileExplorerCurrDirNewFolder;
  spinalDrive_Env.add_applications('FileExplorerCurrDir', new SpinalDrive_App_FileExplorer_currdir_newFolder());
})();