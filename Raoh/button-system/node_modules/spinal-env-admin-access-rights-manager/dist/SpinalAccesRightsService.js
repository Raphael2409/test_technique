"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RoleLst_1 = require("./Models/RoleLst");
const Role_1 = require("./Models/Role");
const UserProfile_1 = require("./Models/UserProfile");
const AppProfileLst_1 = require("./Models/AppProfileLst");
const AppProfile_1 = require("./Models/AppProfile");
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const loadModelPtr_1 = require("./loadModelPtr");
const CONFIG_PATH = "/etc/config/";
const USERS_FILE_PATH = "/etc/users";
const USERS_PROFILE_DIR_NAME = "UserProfileDir";
const ROLE_LST_PATH = CONFIG_PATH + "UserProfileLst";
const APP_PROFILE_LST_PATH = CONFIG_PATH + "AppProfileLst";
const ADMIN_NAME = 'Admin';
const ADMIN_DESCRIPTION = 'Administrator of the spinal platform';
const INTEGRATOR_NAME = 'Intégrateur';
const INTEGRATOR_DESCRIPTION = 'Intégrateur description';
const MAINTAINER_NAME = "Mainteneur";
const MAINTAINER_DESCRIPTION = 'Mainteneur description';
const ASSET_MANAGER_NAME = 'Asset Manager';
const DEFAULT_USER_NAME = 'Basic Utilisateur';
const DEFAULT_USER_DESCRIPTION = 'Defaut utilisateur description';
const USERS_DIR = '__users__';
const PUBLIC_DIR = 'public';
const PUBLIC_DIR_PATH = `${USERS_DIR}/${PUBLIC_DIR}`;
const USERS = [
    { name: ADMIN_NAME, description: ADMIN_DESCRIPTION },
    { name: INTEGRATOR_NAME, description: INTEGRATOR_DESCRIPTION },
    { name: MAINTAINER_NAME, description: MAINTAINER_DESCRIPTION },
    { name: ASSET_MANAGER_NAME, description: ASSET_MANAGER_NAME },
    { name: DEFAULT_USER_NAME, description: DEFAULT_USER_DESCRIPTION }
];
class SpinalAdminInit {
    static wait() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    }
    static init(authService, ngSpinalCore) {
        return authService
            .wait_connect()
            .then(SpinalAdminInit.wait)
            .then(() => {
            return SpinalAdminInit.initRoleLst(ngSpinalCore)
                .then(SpinalAdminInit.initAppProfileLst.bind(this, ngSpinalCore))
                .then(SpinalAdminInit.initDefaultUser.bind(this, ngSpinalCore))
                .then(SpinalAdminInit.initPublicDir.bind(this, ngSpinalCore));
        });
    }
    ;
    static initRoleLst(ngSpinalCore) {
        return ngSpinalCore.load(ROLE_LST_PATH)
            .then(SpinalAdminInit.onRoleLstLoadSuccessful)
            .catch(SpinalAdminInit.onRoleLstLoadFail.bind(this, ngSpinalCore));
    }
    static initAppProfileLst(ngSpinalCore) {
        return ngSpinalCore.load(APP_PROFILE_LST_PATH)
            .then(SpinalAdminInit.onAppProfileLstLoadSuccessful)
            .catch(SpinalAdminInit.onAppProfileLstLoadFail.bind(this, ngSpinalCore));
    }
    static initPublicDir(ngSpinalCore) {
        return ngSpinalCore.load(USERS_DIR)
            .then(SpinalAdminInit.onInitPublicDir);
    }
    static getFileTargetServerId(file) {
        const ptr = file._ptr;
        if (ptr.data.value)
            return ptr.data.value;
        return ptr.data.model._server_id;
    }
    static getOrCreatePublicDir(userDir) {
        const file = userDir.detect((x) => x.name.get() === PUBLIC_DIR);
        if (!file) {
            // file doesn't exist
            const dir = new spinal_core_connectorjs_type_1.Directory();
            userDir.add_file(PUBLIC_DIR, dir);
            return Promise.resolve(dir);
        }
        return loadModelPtr_1.loadModelPtr(file);
    }
    static onInitPublicDir(userDir) {
        return SpinalAdminInit.getOrCreatePublicDir(userDir).then((publicDir) => {
            for (let i = 0; i < userDir.length; i++) {
                if (userDir[i].name.get() !== PUBLIC_DIR &&
                    userDir[i]._info &&
                    !userDir[i]._info.publicDir) {
                    userDir[i]._info.add_attr('publicDir', new spinal_core_connectorjs_type_1.Ptr(publicDir));
                }
            }
        });
    }
    static onRoleLstLoadSuccessful() {
        return Promise.resolve();
    }
    static onRoleLstLoadFail(ngSpinalCore) {
        const userProfileLst = new RoleLst_1.RoleLst();
        for (let i = 0; i < USERS.length; i++) {
            const user = USERS[i];
            //start id = 1
            userProfileLst.users.push(new Role_1.Role(i, user.name, user.description));
        }
        return ngSpinalCore.store(userProfileLst, ROLE_LST_PATH)
            .then(SpinalAdminInit.onRoleLstLoadSuccessful)
            .catch(() => {
            console.log('store rejection from onUserProfileLstLoadFail');
            return Promise.resolve();
        });
    }
    static onAppProfileLstLoadSuccessful() {
        return Promise.resolve();
    }
    static onAppProfileLstLoadFail(ngSpinalCore) {
        const appProfileLst = new AppProfileLst_1.AppProfileLst();
        for (let i = 0; i < 32; i++) {
            appProfileLst.apps
                .push(new AppProfile_1.AppProfile(i + 1, 'id des profile utilisateur en binair inverser'));
        }
        return ngSpinalCore.store(appProfileLst, APP_PROFILE_LST_PATH)
            .then(SpinalAdminInit.onAppProfileLstLoadSuccessful)
            .catch(() => {
            console.log('store rejection from onAppProfileLstLoadFail');
            return Promise.resolve();
        });
    }
    static getUserProfileDir(ngSpinalCore) {
        return ngSpinalCore.load('/etc')
            .then(etcDir => {
            for (let i = 0; i < etcDir.length; i++) {
                const file = etcDir[i];
                if (file.name === USERS_PROFILE_DIR_NAME)
                    return file;
            }
            const Dir = new spinal_core_connectorjs_type_1.Directory();
            etcDir.add_file(USERS_PROFILE_DIR_NAME, Dir);
            return Dir;
        });
    }
    static initDefaultUser(ngSpinalCore) {
        return SpinalAdminInit.getUserProfileDir(ngSpinalCore)
            .then((dir) => {
            return ngSpinalCore.load(USERS_FILE_PATH)
                .then((users) => {
                const promises = [];
                for (let i = 0; i < users.length; i++) {
                    const user = users[i];
                    if (!dir.has(user.name)) {
                        //4 is the id of default user role. 0 is admin role
                        const type = (user.type == 0) ? 0 : 4;
                        const userProfile = new UserProfile_1.UserProfile([type]);
                        dir.add_file(user.name, userProfile);
                    }
                }
            });
        });
    }
}
exports.SpinalAdminInit = SpinalAdminInit;
//# sourceMappingURL=SpinalAccesRightsService.js.map