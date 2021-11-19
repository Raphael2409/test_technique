declare module 'spinal-core-connectorjs' {
    class spinalCore {
        static _def: {
            Model: typeof spinal.Model;
            Str: typeof spinal.Str;
            Bool: typeof spinal.Bool;
            Val: typeof spinal.Val;
            Lst: typeof spinal.Lst;
            Directory: typeof spinal.Directory;
            Vec: typeof spinal.Vec;
            Path: typeof spinal.Path;
            File: typeof spinal.File;
            Ptr: typeof spinal.Ptr;
            Choice: typeof spinal.Choice;
            TypedArray: typeof spinal.TypedArray;
            TypedArray_Int32: typeof spinal.TypedArray_Int32;
            TypedArray_Float64: typeof spinal.TypedArray_Float64;
            Process: typeof spinal.Process;
            BindProcess: typeof spinal.BindProcess;
            Pbr: typeof spinal.Pbr;
        };
        /**
         * Function to intialize the session to SpinalHub
         * ex: `http://168:JHGgcz45JKilmzknzelf65ddDadggftIO98P@localhost:7777/`
         * @static
         * @param {string} connectOpt URI to connect to the hub
         * @returns {spinal.FileSystem}
         * @memberof spinalCore
         */
        static connect(connectOpt: string): spinal.FileSystem;
        /**
         * Store a model in the virtual filesystem in SpinalHub,
         * **Store on an existing path does replace it (if the user have the rights)**
         * @static
         * @param {spinal.FileSystem} fs
         * @param {spinal.Model} model
         * @param {string} path
         * @param {spinal.SpinalStoreCallBackSucess} callback_success
         * @param {spinal.SpinalCallBackError} [callback_error]
         * @memberof spinalCore
         */
        static store(fs: spinal.FileSystem, model: spinal.Model, path: string, callback_success: spinal.SpinalStoreCallBackSucess, callback_error?: spinal.SpinalCallBackError): void;
        /**
         * register models, required when ussing modules require/import
         * @static
         * @param {(typeof spinal.Model|typeof spinal.Model[])} modelList
         * @memberof spinalCore
         */
        static register_models(modelList: any): void;
        /**
         * loads a model from the file system
         * @static
         * @param {spinal.FileSystem} fs
         * @param {string} path
         * @param {spinal.SpinalLoadCallBackSucess} callback_success
         * @param {spinal.SpinalCallBackError} [callback_error]
         * @memberof spinalCore
         */
        static load(fs: spinal.FileSystem, path: string, callback_success: spinal.SpinalLoadCallBackSucess, callback_error?: spinal.SpinalCallBackError): void;
        /**
         * loads all the models of a specific type
         * @static
         * @param {spinal.FileSystem} fs
         * @param {string} type
         * @param {spinal.SpinalLoadTypeCallBackSucess} callback_success is called for each Model found
         * @param {spinal.SpinalCallBackError} [callback_error]
         * @memberof spinalCore
         */
        static load_type(fs: spinal.FileSystem, type: string, callback_success: spinal.SpinalLoadTypeCallBackSucess, callback_error?: spinal.SpinalCallBackError): void;
        /**
         * get the right of a model
         * @static
         * @param {spinal.FileSystem} fs
         * @param {number} ptr
         * @param {spinal.SpinalLoadCallBackSucess} callback_success
         * @param {spinal.SpinalCallBackError} [callback_error]
         * @memberof spinalCore
         */
        static load_right(fs: spinal.FileSystem, ptr: number, callback_success: spinal.SpinalLoadCallBackSucess, callback_error?: spinal.SpinalCallBackError): void;
        /**
         * share a Model/File to another user
         * @static
         * @param {spinal.FileSystem} fs
         * @param {number} ptr
         * @param {string} file_name
         * @param {number} right_flag
         * @param {string} targetName
         * @memberof spinalCore
         */
        static share_model(fs: spinal.FileSystem, ptr: number, file_name: string, right_flag: number, targetName: string): void;
        static right_flag: {
            AD: 1;
            WR: 2;
            RD: 4;
        };
        /**
         * extend one object as a class, using the same 'class' concept as coffeescript
         * @static
         * @param {Function} child
         * @param {Function} parent
         * @memberof spinalCore
         */
        static extend(child: Function, parent: Function): void;
    }
    namespace spinalCore { }
    export = spinalCore;
}
declare namespace spinal {
    type SpinalOnChangeBindModel = () => void;
    type SpinalStoreCallBackSucess = () => void;
    type SpinalCallBackError = () => void;
    type SpinalLoadCallBackSucess = (model: Model) => void;
    type SpinalLoadCallBack<T extends Model> = (model: T, error: boolean) => void;
    type SpinalLoadTypeCallBackSucess = (model: Model) => void;
    type SpinalFilterFunction<T extends Model> = (item: T) => boolean;
    type SpinalSortFunction = (item1: Model, item2: Model) => number;
    class Model {
        [nameAttr: string]: any;
        /**
         *Creates an instance of Model.
         * @param {{[nameAttr: string]: any}} [object]
         * must be in a form `{ [nameAttr: string]: typeof Model, ... }`
         * @memberof Model
         */
        constructor(object?: {
            [nameAttr: string]: any;
        });
        /**
         * ### return a copy of data in a "standard JS" representation
         * (e.g. string, number, objects, ...).
         *
         * Users are encouraged to use Models as much as possible
         * (meaning that get should not be called for every manipulation),
         * adding methods for manipulation of data if necessary
         * (e.g. toggle, find, ... in Lst, Str, ...).
         *
         * _May be redefined for specific types (e.g. Str, Lst, ...)_
         * @memberof Model
         * @returns {*}
         */
        get(): any;
        /**
         * modify data, using another values, or Model instances.
         * Should not be redefined (but _set should be)
         *
         * @param {*} opt
         * @memberof Model
         * @returns {boolean} returns true if the object is modified
         */
        set(opt: any): boolean;
        /**
         * add attribute
         * @param {{[nameAttr: string]: any}} object
         * must be in a form `{ [nameAttr: string]: typeof Model, ... }`
         * @memberof Model
         */
        add_attr(object: {
            [nameAttr: string]: any;
        }): void;
        /**
         * add attribute
         * @param {string} name
         * @param {*} [instanceOfModel]
         * @param {boolean} [signal_change=true]
         * @memberof Model
         */
        add_attr(name: string, instanceOfModel?: any, signal_change?: boolean): void;
        /**
         * change attribute named `name` to `opt` (use references for comparison)
         * @param {string} name
         * @param {*} opt
         * @memberof Model
         */
        mod_attr(name: string, opt: any): void;
        /**
         * remove attribute named name
         * @param {string} name
         * @param {boolean} [signal_change=true]
         * @memberof Model
         */
        rem_attr(name: string, signal_change?: boolean): void;
        /**
         * `add / mod / rem attr` to get the same data than `opt`
         *  (assumed to be something like `{ key: val, ... }`)
         * @param {object} opt
         * @memberof Model
         */
        set_attr(opt: object): void;
        /**
         *  if this has been modified during the preceding round, f will be called
         *
         * @param {(Process|BindProcess|SpinalOnChangeBindModel)} f If f is a
        process:
          - process.onchange will be called each time this (or a child of this) will
        be modified.
          - process.destructor will be called if this is destroyed.
         * @param {boolean} [onchange_construction=true] true means that onchange
        will be automatically
         * @returns {BindProcess}
         * @memberof Model
         */
        bind(f: Process | BindProcess | SpinalOnChangeBindModel, onchange_construction?: boolean): BindProcess;
        unbind(f: Process | BindProcess | SpinalOnChangeBindModel): void;
        /**
         * return true if this (or a child of this) has changed since the previous
         * synchronisation
         * @returns {boolean}
         * @memberof Model
         */
        has_been_modified(): boolean;
        /**
         * return true if this has changed since previous synchronisation due to
         * a direct modification (not from a child one)
         * @returns {boolean}
         * @memberof Model
         */
        has_been_directly_modified(): boolean;
        /**
         * create and returns a deep copy
         * @returns {Model}
         * @memberof Model
         */
        deep_copy(): Model;
    }
    class Obj extends Model {
    }
    class Str extends Obj {
        constructor(data?: Str | string);
        length: number;
        get(): string;
        contains(str: string): boolean;
        equals(str: Str | string): boolean;
    }
    class Bool extends Obj {
        constructor(data?: boolean);
        get(): boolean;
        toggle(): void;
        toBoolean(): boolean;
    }
    class Val extends Obj {
        constructor(value?: number | Val | string | boolean);
        get(): number;
    }
    /**
     * vector of objects inherited from Model
     * @class Lst
     * @extends {Model}
     */
    class Lst<T extends Model> extends Model {
        constructor(data?: any[]);
        length: number;
        get(): any[];
        /**
         * append value at the end of the list.
         * @param {any} value
         * @memberof Lst
         */
        push(value: any): void;
        /**
         * remove and return the last element
         * @memberof Lst
         * @returns {*}
         */
        pop(): any;
        /**
         * empty the Lst
         * @memberof Lst
         */
        clear(): void;
        /**
         * add an element to the beginning of an array, return the new length
         * @param {*} element
         * @returns {number}
         * @memberof Lst
         */
        unshift(element: any): number;
        /**
         * remove and return the first element
         * @type null
         * @memberof Lst
         * @returns {*}
         */
        shift(): any;
        /**
         * remove item from the list id present
         * @param {*} item
         * @returns {*}
         * @memberof Lst
         */
        remove(item: any): any;
        /**
         * remove item from the list id present, based on ref comparison
         * @param {*} item
         * @returns {*}
         * @memberof Lst
         */
        remove_ref(item: any): any;
        /**
         * return a list with item such as f( item ) is true
         * @param {SpinalFilterFunction} f
         * @returns {T[]}
         * @memberof Lst
         */
        filter(f: SpinalFilterFunction<T>): T[];
        /**
         * return the first item such as f( item ) is true. If not item, return
         * undefined
         * @param {SpinalFilterFunction} f
         * @memberof Lst
         */
        detect(f: SpinalSortFunction): T;
        /**
         * sort item depending function and return a new Array
         * @param {SpinalSortFunction} fun_sort
         * @returns {any[]}
         * @memberof Lst
         */
        sorted(fun_sort: SpinalSortFunction): any[];
        /**
         * return true if there is an item that checks f( item )
         * @param {SpinalFilterFunction} func
         * @returns {boolean}
         * @memberof Lst
         */
        has(func: SpinalFilterFunction<T>): boolean;
        /**
         * returns index of v if v is present in the list. Else, return -1
         * @param {*} value
         * @returns {number}
         * @memberof Lst
         */
        indexOf(value: any): number;
        /**
         * returns index of v if v is present in the list, based on ref comparison.
         * Else, return -1
         * @param {*} value
         * @memberof Lst
         * @returns {number}
         */
        indexOf_ref(value: any): number;
        /**
         * @param {*} value
         * @returns {boolean}
         * @memberof Lst
         */
        contains(value: any): boolean;
        /**
         * @param {*} value
         * @returns {boolean}
         * @memberof Lst
         */
        contains_ref(value: any): boolean;
        /**
         * toggle presence of v. return true if added
         * @param {*} value
         * @returns {boolean}
         * @memberof Lst
         */
        toggle(value: any): boolean;
        /**
         * toggle presence of v, base on ref comparison
         * @param {*} value
         * @returns {boolean}
         * @memberof Lst
         */
        toggle_ref(value: any): boolean;
        /**
         * return a new lst between begin and end index
         * @param {number} begin
         * @param {number} [end]
         * @returns {Lst}
         * @memberof Lst
         */
        slice(begin: number, end?: number): Lst<T>;
        /**
         * return list with new_tab after
         * @param {Lst} new_lst
         * @param {boolean} [force]
         * @returns {Lst}
         * @memberof Lst
         */
        concat(new_lst: Lst<T> | T[], force?: boolean): Lst<T>;
        /**
         * remove n items from index
         * @param {number} index
         * @param {number} [n=1]
         * @memberof Lst
         */
        splice(index: number, n?: number): void;
        /**
         * Insert a Lst in the index
         * @param {number} index
         * @param {(T[]|Lst<T>|any[]|Lst<any>)} list
         * @memberof Lst
         */
        insert(index: number, list: T[] | Lst<T> | any[] | Lst<any>): void;
        /**
         * permits to set an item or to grow the list if index == length
         * @param {number} index
         * @param {*} value
         * @memberof Lst
         */
        set_or_push(index: number, value: any): void;
        /**
         * reduce the size
         * @param {number} size
         * @memberof Lst
         */
        trim(size: number): void;
        /**
         * return a string with representation of items, separated by separator
         * @param {string} separator
         * @returns {string}
         * @memberof Lst
         */
        join(separator: string): string;
        /**
         * last element
         * @returns {any}
         * @memberof Lst
         */
        back(): any;
    }
    class Vec extends Lst<Val> {
    }
    class Directory<T extends Model> extends Lst<File<T>> {
        find(name: string): File<T> | undefined;
        load(name: string, callBack: SpinalLoadCallBack<Model>): void;
        add_file(name: string, obj: Model, params?: object): File<T>;
        force_add_file(name: string, obj: Model, params?: object): File<T>;
    }
    class Path extends Model {
        /**
         *Creates an instance of Path.
         * @param {File} file A real File
         * @memberof Path
         */
        constructor(file?: any);
        remaining: number;
        to_upload: number;
    }
    class File<T extends Model> extends Model {
        name: Str;
        _ptr: Ptr<T>;
        _info: Model;
        constructor(name: string, ptr_or_model: number | Model | Ptr<any>, info: Model | Object);
        load(callback: SpinalLoadCallBack<T>): void;
    }
    class Ptr<T extends Model> extends Model {
        constructor(model?: T | number);
        data: {
            model?: T;
            value?: number;
        };
        load(callback: SpinalLoadCallBack<T>): void;
    }
    class Pbr<T extends Model> extends Ptr<T> {
    }
    class Choice extends Model {
        num: Val;
        lst: Lst<Str>;
        constructor(InitIdx?: Val | number, stringChoises?: (string | Str)[]);
    }
    class TypedArray<T extends Int32Array | Float32Array | Float64Array> extends Model {
        constructor(size?: number, data?: any[]);
        dim(): number;
        size(d?: number): number;
        set_val(index: number[] | number, value: any): void;
        nb_items(): number;
        equals(obj: any): boolean;
        resize(new_size: number[]): void;
        base_type(): void;
        get(): T;
        get(index: number | number[]): number;
        base_type(): T;
        toString(): void;
    }
    class TypedArray_Int32 extends TypedArray<Int32Array> {
        base_type(): Int32Array;
    }
    class TypedArray_Float32 extends TypedArray<Float32Array> {
        base_type(): Float32Array;
    }
    class TypedArray_Float64 extends TypedArray<Float64Array> {
        base_type(): Float64Array;
    }
    class Process {
        constructor(m: Model, onchange_construction?: boolean);
        destructor(): void;
        onchange(): void;
    }
    class BindProcess extends Process {
        constructor(m: Model, onchange_construction: boolean, f: SpinalOnChangeBindModel);
    }
    /**
     * handle the connection between the SpinalHub and the Organ
     * @class FileSystem
     */
    class FileSystem {
        constructor();
        load<T extends Model>(path: string, callback: SpinalLoadCallBack<T>): void;
        load_type<T extends Model>(type: string, callback: SpinalLoadCallBack<Model>): void;
        load_or_make_dir<T extends Model>(dir: string, callback: SpinalLoadCallBack<Directory<T>>): void;
        load_ptr<T extends Model>(ptr: number, callback: SpinalLoadCallBack<T>): void;
        load_right<T extends Model>(ptr: number, callback: SpinalLoadCallBack<T>): void;
        share_model(ptr: number, file_name: string, share_type: number, targetName: string): void;
        static get_inst(): FileSystem;
        static extend(child: any, parent: any): void;
        static debug: boolean;
        static _sig_server: boolean;
        static _disp: boolean;
        static CONNECTOR_TYPE: 'Node' | 'Browser';
        static _objects: {
            [key: number]: Model;
        };
        static _tmp_objects: {
            [key: number]: Model;
        };
    }
}
