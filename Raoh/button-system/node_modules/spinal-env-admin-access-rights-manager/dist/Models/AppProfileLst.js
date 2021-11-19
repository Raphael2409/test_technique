"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
class AppProfileLst extends spinal_core_connectorjs_type_1.Model {
    constructor() {
        super();
        this.add_attr({
            apps: new spinal_core_connectorjs_type_1.Lst()
        });
    }
}
exports.AppProfileLst = AppProfileLst;
spinal_core_connectorjs_type_1.spinalCore.register_models(AppProfileLst);
//# sourceMappingURL=AppProfileLst.js.map