"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
class AppProfile extends spinal_core_connectorjs_type_1.Model {
    constructor(id, description) {
        super();
        this.add_attr({
            id: id,
            description: description,
        });
    }
}
exports.AppProfile = AppProfile;
spinal_core_connectorjs_type_1.spinalCore.register_models(AppProfile);
//# sourceMappingURL=AppProfile.js.map