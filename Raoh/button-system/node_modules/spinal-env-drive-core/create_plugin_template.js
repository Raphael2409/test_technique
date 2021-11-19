#!/usr/bin/env node

/**
 * Copyright 2015 SpinalCom - www.spinalcom.com
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

var fs = require("fs");
var path = require("path");
var package_path, rootPath;

package_path = path.resolve("./package.json");
rootPath = path.resolve("../..");
let modulePath = path.resolve(".");

package_path = path.resolve(modulePath + "/package.json");
var templatePath = path.resolve(modulePath + "/templates");

var browserPath = path.resolve(rootPath + "/.browser_organs");
var templatesOutputPath = path.resolve(browserPath + "/templates");

function main() {
  create_folder_if_not_exit(browserPath);
  create_folder_if_not_exit(templatesOutputPath);
  if (fs.existsSync(templatePath)) {
    var name = JSON.parse(fs.readFileSync(package_path, "utf8")).name;
    var src = path.resolve(templatePath + "/" + name);
    var dst = path.resolve(templatesOutputPath + "/" + name);
    copyRecursiveSync(src, dst);
  }
}

function create_folder_if_not_exit(params) {
  if (!fs.existsSync(params)) {
    fs.mkdirSync(params);
  }
}

function copyRecursiveSync(src, dest) {
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);

  var destExists = fs.existsSync(dest);
  var destStats = destExists && fs.statSync(dest);
  var destIsDirectory = destExists && destStats.isDirectory();

  var isDirectory = exists && stats.isDirectory();
  if (exists && isDirectory) {
    if (!destIsDirectory) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    if (destExists) fs.unlinkSync(dest);
    fs.linkSync(src, dest);
  }
}
main();
