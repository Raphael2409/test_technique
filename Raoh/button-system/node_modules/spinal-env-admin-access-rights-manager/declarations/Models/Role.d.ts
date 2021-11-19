import { Model } from 'spinal-core-connectorjs_type';
export declare class Role extends Model {
    id: spinal.Str;
    name: spinal.Str;
    description: spinal.Str;
    constructor(id: number, name: string, description: string);
}
