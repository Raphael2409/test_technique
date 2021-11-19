let SpinalDrive_App = require("./SpinalDrive_App");

/** Class representing a list of applications unique */
class SpinalDrive_App_list {
  constructor() {
    this._list = [];
  }

  is_valid_obj(obj) {
    return (
      typeof obj.name != "undefined" &&
      typeof obj.label != "undefined" &&
      typeof obj.id != "undefined" &&
      typeof obj.icon != "undefined" &&
      typeof obj.description != "undefined"
    );
    // && typeof obj.appGroup != 'undefined' &&
    // typeof obj.extensions != 'undefined' && typeof obj.types != 'undefined'
  }
  /**
   *
   *
   * @param {(SpinalDrive_App|any)} obj
   * @memberof SpinalDrive_App_list
   */
  push(obj) {
    if (obj instanceof SpinalDrive_App || this.is_valid_obj(obj)) {
      for (var i = 0; i < this._list.length; i++) {
        if (this._list[i].name === obj.name) {
          this._list[i] = obj;
          return;
        }
      }
      this._list.push(obj);
    } else
      console.error(
        "Error trying to Push not a SpinalDrive_App Object or equivalent."
      );
  }
  /**
   *
   *
   * @param {string} name
   * @returns {boolean} false if nothing to delete
   * @memberof SpinalDrive_App_list
   */
  remove_by_name(name) {
    if (typeof name != "undefined") {
      for (var i = 0; i < this._list.length; i++) {
        if (name === this._list[i].name) {
          this._list.splice(i, 1);
          return true;
        }
      }
    }
    return false;
  }
  /**
   *
   *
   * @param {number} id
   * @returns {SpinalDrive_App}
   * @memberof SpinalDrive_App_list
   */
  remove_by_id(id) {
    if (typeof id != "undefined") {
      for (var i = 0; i < this._list.length; i++) {
        if (id === this._list[i].id) {
          this._list.splice(i, 1);
          return true;
        }
      }
    }
    return false;
  }
  /**
   *
   *
   * @param {number} idx
   * @returns {SpinalDrive_App}
   * @memberof SpinalDrive_App_list
   */
  get(idx) {
    if (typeof idx === "undefined") return this._list[idx];
    return this._list;
  }
  /**
   *
   *
   * @returns {number}
   * @memberof SpinalDrive_App_list
   */
  length() {
    return this._list.length;
  }
  /**
   *
   *
   * @param {string} name
   * @returns {SpinalDrive_App} returns 0 on notfound.
   * @memberof SpinalDrive_App_list
   */
  get_by_name(name) {
    for (var i = 0; i < this._list.length; i++) {
      if (name === this._list[i].name) {
        return this._list[i];
      }
    }
    return 0;
  }
}

module.exports = SpinalDrive_App_list;
