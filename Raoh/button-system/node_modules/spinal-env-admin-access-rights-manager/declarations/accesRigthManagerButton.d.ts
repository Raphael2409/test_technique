export declare class SpinalAdminInit {
    static init(authService: any, ngSpinalCore: any): void;
    static initRoleLst(ngSpinalCore: any): Promise<void>;
    static initAppProfileLst(ngSpinalCore: any): Promise<void>;
    static onRoleLstLoadSuccessful(): Promise<void>;
    static onRoleLstLoadFail(ngSpinalCore: any): Promise<void>;
    static onAppProfileLstLoadSuccessful(): Promise<void>;
    static onAppProfileLstLoadFail(ngSpinalCore: any): Promise<void>;
    static getUserProfileDir(ngSpinalCore: any): any;
    static initDefaultUser(ngSpinalCore: any): any;
}
