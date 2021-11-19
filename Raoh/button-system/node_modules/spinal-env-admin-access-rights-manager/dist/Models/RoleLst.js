"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
class RoleLst extends spinal_core_connectorjs_type_1.Model {
    constructor() {
        super();
        this.add_attr({
            users: new spinal_core_connectorjs_type_1.Lst()
        });
    }
}
exports.RoleLst = RoleLst;
spinal_core_connectorjs_type_1.spinalCore.register_models(RoleLst);
//# sourceMappingURL=RoleLst.js.map