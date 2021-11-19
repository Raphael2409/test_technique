"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
require("./connectorTS");
const spinalCore = require("spinal-core-connectorjs");
exports.spinalCore = spinalCore;
/// <reference types="typescript" />
/* tslint:disable:variable-name  class-name */
const Model = spinalCore._def.Model;
exports.Model = Model;
const Str = spinalCore._def.Str;
exports.Str = Str;
const Bool = spinalCore._def.Bool;
exports.Bool = Bool;
const Val = spinalCore._def.Val;
exports.Val = Val;
const Lst = spinalCore._def.Lst;
exports.Lst = Lst;
const Directory = spinalCore._def.Directory;
exports.Directory = Directory;
const Vec = spinalCore._def.Vec;
exports.Vec = Vec;
const Path = spinalCore._def.Path;
exports.Path = Path;
const File = spinalCore._def.File;
exports.File = File;
const Ptr = spinalCore._def.Ptr;
exports.Ptr = Ptr;
const Choice = spinalCore._def.Choice;
exports.Choice = Choice;
const TypedArray = spinalCore._def.TypedArray;
exports.TypedArray = TypedArray;
const TypedArray_Int32 = spinalCore._def.TypedArray_Int32;
exports.TypedArray_Int32 = TypedArray_Int32;
const TypedArray_Float64 = spinalCore._def.TypedArray_Float64;
exports.TypedArray_Float64 = TypedArray_Float64;
const Process = spinalCore._def.Process;
exports.Process = Process;
const BindProcess = spinalCore._def.BindProcess;
exports.BindProcess = BindProcess;
const globalAny = typeof window === 'undefined' ? global : window;
const FileSystem = globalAny.FileSystem;
exports.FileSystem = FileSystem;
const Pbr = spinalCore._def.Pbr;
exports.Pbr = Pbr;
exports.default = spinalCore;
//# sourceMappingURL=SpinalModel.js.map