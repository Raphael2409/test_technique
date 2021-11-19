export declare class SpinalAdminInit {
    static wait(): Promise<{}>;
    static init(authService: any, ngSpinalCore: any): Promise<void>;
    static initRoleLst(ngSpinalCore: any): Promise<void>;
    static initAppProfileLst(ngSpinalCore: any): Promise<void>;
    static initPublicDir(ngSpinalCore: any): Promise<void>;
    static getFileTargetServerId(file: any): any;
    static getOrCreatePublicDir(userDir: any): any;
    static onInitPublicDir(userDir: any): any;
    static onRoleLstLoadSuccessful(): Promise<void>;
    static onRoleLstLoadFail(ngSpinalCore: any): Promise<void>;
    static onAppProfileLstLoadSuccessful(): Promise<void>;
    static onAppProfileLstLoadFail(ngSpinalCore: any): Promise<void>;
    static getUserProfileDir(ngSpinalCore: any): any;
    static initDefaultUser(ngSpinalCore: any): any;
}
