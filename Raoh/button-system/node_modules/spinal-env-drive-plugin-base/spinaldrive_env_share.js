(function () {
  var SpinalDrive_App_FileExplorer_share = require('./base/SpinalDrive_App_share').FileExplorerShare;
  spinalDrive_Env.add_applications('FileExplorer', new SpinalDrive_App_FileExplorer_share());
  var SpinalDrive_App_FolderExplorer_share = require('./base/SpinalDrive_App_share').FolderExplorerShare;
  spinalDrive_Env.add_applications('FolderExplorer', new SpinalDrive_App_FolderExplorer_share());
  var SpinalDrive_App_Inspector_share = require('./base/SpinalDrive_App_share').InspectorShare;
  spinalDrive_Env.add_applications('Inspector', new SpinalDrive_App_Inspector_share());

})();