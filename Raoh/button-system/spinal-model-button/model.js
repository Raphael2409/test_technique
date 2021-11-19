class ButtonModel extends Model { // 1
    constructor() {
      super(); // 2
      this.add_attr({ // 3
        pressed: false
      });
    }
  }
  module.exports.ButtonModel = ButtonModel;
  