import { Model } from 'spinal-core-connectorjs_type';
import { UserProfile } from "./UserProfile";
export declare class RoleLst extends Model {
    users: spinal.Lst<UserProfile>;
    constructor();
}
