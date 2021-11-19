(function () {
  var SpinalDrive_App_Inspector_edit = require('./base/SpinalDrive_App_edit').InspectorEdit;
  spinalDrive_Env.add_applications('Inspector', new SpinalDrive_App_Inspector_edit());
})();