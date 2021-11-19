var SpinalDrive_App_list = require("./SpinalDrive_App_list");

/** Class representing the SpinalDrive Environnement */
class SpinalDrive_Env {
  /**
   * Creates an instance of SpinalDrive_Env.
   * @memberof SpinalDrive_Env
   */
  constructor() {
    this.containerLst = {};
    this.context_file_exp_app_icon = {
      Directory: "folder",
      Session: "desktop_windows",
      default: "insert_drive_file"
    };
  }
  /**
   * add_navbar_application.
   *
   * @param {string} key key string of the layer: `FolderExplorer` or 'FileExplorer' or `Inspector` or `FileExplorerCurrDir`
   * @param {SpinalDrive_App | any} app should be an SpinalDrive_App
   * @memberof SpinalDrive_Env
   */
  add_applications(key, app) {
    if (!this.containerLst[key])
      this.containerLst[key] = new SpinalDrive_App_list();
    return this.containerLst[key].push(app);
  }

  /**
   * get_applications
   *
   * @param {string} key key string of the layer
   * @param {object} d dbject send to is_shown defined by each layout
   * @memberof SpinalDrive_Env
   */
  get_applications(key, d) {
    if (!this.containerLst[key])
      this.containerLst[key] = new SpinalDrive_App_list();
    return this.containerLst[key]._list
      .filter(app => {
        return app.is_shown(d);
      })
      .sort(function(a, b) {
        return a.order_priority < b.order_priority;
      });
  }
}
module.exports = SpinalDrive_Env;
