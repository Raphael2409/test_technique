(function () {
  var SpinalDrive_App_FileExplorer_currdir_issim = require('./base/SpinalDrive_App_issim.js').FileExplorerCurrDirIssim;
  spinalDrive_Env.add_applications('FileExplorerCurrDir', new SpinalDrive_App_FileExplorer_currdir_issim());
  var SpinalDrive_App_FileExplorer_issim = require('./base/SpinalDrive_App_issim.js').FileExplorerIssim;
  spinalDrive_Env.add_applications('FileExplorer', new SpinalDrive_App_FileExplorer_issim());
})();