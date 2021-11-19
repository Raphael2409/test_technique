/**
 * Copyright 2015 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

module.extends = {};
require("spinal-env-drive-core");
const spinalDrive_Env = window.spinalDrive_Env;

function concat_lib(lib) {
  for (var key in lib) {
    module.exports[key] = lib[key];
  }
}
concat_lib(require("./base/SpinalDrive_App_delete"));
concat_lib(require("./base/SpinalDrive_App_edit"));
concat_lib(require("./base/SpinalDrive_App_newFolder"));
concat_lib(require("./base/SpinalDrive_App_renameFile"));
concat_lib(require("./base/SpinalDrive_App_share"));
concat_lib(require("./base/SpinalDrive_App_download"));

spinalDrive_Env.add_applications(
  "FileExplorer",
  new module.exports.SpinalDrive_App_FileExplorer_delete()
);
spinalDrive_Env.add_applications(
  "FileExplorerCurrDir",
  new module.exports.SpinalDrive_App_FileExplorer_currdir_delete()
);
spinalDrive_Env.add_applications(
  "FolderExplorer",
  new module.exports.SpinalDrive_App_FolderExplorer_delete()
);
spinalDrive_Env.add_applications(
  "Inspector",
  new module.exports.InspectorEdit()
);
spinalDrive_Env.add_applications(
  "FolderExplorer",
  new module.exports.FolderExplorerNewFolder()
);
spinalDrive_Env.add_applications(
  "FileExplorerCurrDir",
  new module.exports.FileExplorerCurrDirNewFolder()
);
spinalDrive_Env.add_applications(
  "FileExplorer",
  new module.exports.FileExplorerRename()
);
spinalDrive_Env.add_applications(
  "FileExplorer",
  new module.exports.FileExplorerShare()
);
spinalDrive_Env.add_applications(
  "FolderExplorer",
  new module.exports.FolderExplorerShare()
);
spinalDrive_Env.add_applications(
  "Inspector",
  new module.exports.InspectorShare()
);
spinalDrive_Env.add_applications(
  "FileExplorer",
  new module.exports.FileExplorerDownload()
);
