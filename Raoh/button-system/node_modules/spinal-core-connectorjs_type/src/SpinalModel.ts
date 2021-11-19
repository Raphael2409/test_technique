/*
 * Copyright 2018 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import './connectorTS';

import * as spinalCore from 'spinal-core-connectorjs';
/// <reference types="typescript" />

/* tslint:disable:variable-name  class-name */

const Model: typeof spinal.Model = spinalCore._def.Model;
const Str: typeof spinal.Str = spinalCore._def.Str;
const Bool: typeof spinal.Bool = spinalCore._def.Bool;
const Val: typeof spinal.Val = spinalCore._def.Val;
const Lst: typeof spinal.Lst = spinalCore._def.Lst;
const Directory: typeof spinal.Directory = spinalCore._def.Directory;
const Vec: typeof spinal.Vec = spinalCore._def.Vec;
const Path: typeof spinal.Path = spinalCore._def.Path;
const File: typeof spinal.File = spinalCore._def.File;
const Ptr: typeof spinal.Ptr = spinalCore._def.Ptr;
const Choice: typeof spinal.Choice = spinalCore._def.Choice;
const TypedArray: typeof spinal.TypedArray = spinalCore._def.TypedArray;
const TypedArray_Int32: typeof spinal.TypedArray_Int32 =
    spinalCore._def.TypedArray_Int32;
const TypedArray_Float64: typeof spinal.TypedArray_Float64 =
    spinalCore._def.TypedArray_Float64;
const Process: typeof spinal.Process = spinalCore._def.Process;
const BindProcess: typeof spinal.BindProcess = spinalCore._def.BindProcess;
const globalAny: any = typeof window === 'undefined' ? global : window;
const FileSystem: typeof spinal.FileSystem = globalAny.FileSystem;
const Pbr: typeof  spinal.Pbr = spinalCore._def.Pbr;
export default spinalCore;
export {Pbr};
export { spinalCore };
export { Model };
export { Str };
export { Bool };
export { Val };
export { Lst };
export { Directory };
export { Vec };
export { Path };
export { File };
export { Ptr };
export { Choice };
export { TypedArray };
export { TypedArray_Int32 };
export { TypedArray_Float64 };
export { Process };
export { BindProcess };
export { FileSystem };
