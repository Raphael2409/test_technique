#!/usr/bin/env node

const path = require("path");
const fs = require("fs-extra");
const Q = require("q");

var program = require("commander");
program
  .version("1.0.0")
  .option("-n, --node-organ", "register a node module deamon")
  .option(
    "-b, --browser [prefixToRemove]",
    "register a browser module, add a prefix to remove"
  )
  .option("-s, --spinalhub", "register a spinalhub")
  .option("-l, --launch-system", "register a system")
  .parse(process.argv);

const full_module_path = path.resolve(".");
let test_is_in_node_modules = /node_modules/g.exec(full_module_path);
if (test_is_in_node_modules === null) {
  process.exit(0);
}
const rootFolder = path.resolve(full_module_path + "/../..");

var program_type = "";
if (program.hasOwnProperty("nodeOrgan")) program_type = "NODE";
if (program.hasOwnProperty("browser")) program_type = "BROWSER";
if (program.hasOwnProperty("spinalhub")) program_type = "HUB";
if (program.hasOwnProperty("launchSystem")) {
  handle_system().then(() => {
    process.exit(0);
  });
}
if (program_type === "") {
  program_type = "NODE";
}
const browser_folder_path = path.resolve(rootFolder + "/.browser_organs");
const global_config_file_path = path.resolve(rootFolder + "/.config.json");
const global_app_config_file_path = path.resolve(rootFolder + "/.apps.json");
const nerve_center_path = path.resolve(rootFolder + "/nerve-center");

function init_folders() {
  return Q.all([
    create_folder_if_not_exist(browser_folder_path),
    create_folder_if_not_exist(nerve_center_path)
  ]);
}

function init_config() {
  return Q.all([
    create_json_if_not_exist(global_config_file_path),
    create_json_if_not_exist(global_app_config_file_path)
  ]);
}

function handle_program_type() {
  switch (program_type) {
    case "NODE":
      return handle_node();
    case "BROWSER":
      return handle_browser();
    case "HUB":
      return handle_hub();
    default:
  }
}

function handle_node() {
  extract_default_config();
  add_global_app_config(path.relative(rootFolder, full_module_path));
}

function handle_hub() {
  // create nerve-center
  create_folder_if_not_exist(nerve_center_path).then(() => {
    extract_default_config();
    add_global_app_config("./nerve-center/");

    // copy spinalhub binaries
    const spinalhubjs_path = path.resolve(full_module_path + "/spinalhub.js");
    const spinalhubjs_dest = path.resolve(nerve_center_path + "/spinalhub.js");
    const spinalhub_path = path.resolve(full_module_path + "/spinalhub");
    const spinalhub_dest = path.resolve(nerve_center_path + "/spinalhub");

    fs.copy(spinalhubjs_path, spinalhubjs_dest, {
      overwrite: true
    });
    fs.copy(spinalhub_path, spinalhub_dest, {
      overwrite: true
    });
  });
}

function handle_browser() {
  const config_env_folder_path = path.resolve(rootFolder + "/.config_env");

  create_folder_if_not_exist(config_env_folder_path).then(() => {
    const browser_path = path.resolve(full_module_path + "/www");
    const package_path = path.resolve(full_module_path + "/package.json");
    let browserPrefix =
      typeof program.browser == "boolean" ? "spinal-browser-" : program.browser;
    let reg = new RegExp(browserPrefix, "gi");
    fs
      .readJson(package_path)
      .then(package_cfg => {
        let name = package_cfg.name;
        if (name) {
          name = name.replace(reg, "");
        } else {
          name = "undef";
        }

        const config_env_path = path.resolve(
          config_env_folder_path + "/" + name + ".json"
        );

        return create_json_if_not_exist(config_env_path).then(() => {
          const browser_dest = path.resolve(browser_folder_path + "/" + name);
          const browser_dest_relatif = path.relative(
            browser_folder_path,
            browser_path
          );
          return fs.pathExists(browser_dest).then(exists => {
            if (exists === false) {
              fs.symlink(browser_dest_relatif, browser_dest, "dir", () => {});
            }
          });
        });
      })
      .catch(err => {
        console.error(err);
      });
  });
}

function handle_system() {
  const launchCfg_src = path.resolve(full_module_path + "/launch.config.js");
  const launchCfg_dest = path.resolve(rootFolder + "/launch.config.js");

  return fs
    .copy(launchCfg_src, launchCfg_dest, {
      overwrite: true
    })
    .then(() => {
      console.log("done");
    })
    .catch(err => {
      console.error(err);
    });
}

// START THE SCRIPT
init_folders()
  .then(init_config)
  .then(handle_program_type);

// UTILITIES

function merge_config_rec(default_config, dest) {
  for (var key in default_config) {
    if (!dest.hasOwnProperty(key)) {
      dest[key] = default_config[key];
    } else if (typeof default_config[key] == "object") {
      merge_config_rec(default_config[key], dest[key]);
    }
  }
}

function extract_default_config() {
  const config_file_path = path.resolve(
    full_module_path + "/default_config.json"
  );
  const package_path = path.resolve(full_module_path + "/package.json");
  let default_config = require(config_file_path);
  const package_cfg = require(package_path);
  let global_config = require(global_config_file_path);
  if (package_cfg && package_cfg.name) {
    if (typeof global_config[package_cfg.name] == "undefined") {
      global_config[package_cfg.name] = default_config;
    } else {
      // don't replace exiting config merge it with existing as priority
      merge_config_rec(default_config, global_config[package_cfg.name]);
    }
    save_json(global_config, global_config_file_path);
  }
}

function add_global_app_config(cwd) {
  const package_path = path.resolve(full_module_path + "/package.json");
  const package_cfg = require(package_path);

  let global_apps = require(global_app_config_file_path);
  if (global_apps) {
    if (!global_apps.apps) global_apps.apps = [];
    let apps = global_apps.apps;
    for (var i = 0; i < apps.length; i++) {
      if (apps[i].name === package_cfg.name) {
        apps.splice(i, 1, {
          name: package_cfg.name,
          script: package_cfg.main ? package_cfg.main : "main.js",
          cwd: cwd
        });
        return save_json(global_apps, global_app_config_file_path);
      }
    }
    apps.push({
      name: package_cfg.name,
      script: package_cfg.main ? package_cfg.main : "main.js",
      cwd: cwd
    });
    return save_json(global_apps, global_app_config_file_path);
  }
}

function save_json(json_obj, path) {
  var content = JSON.stringify(json_obj, null, 2);
  fs.writeFile(path, content, {
    flag: "w"
  });
}

function test_exist(path) {
  let defer = Q.defer();
  fs.lstat(path, (err, stats) => {
    if (err) {
      defer.reject();
      return;
    }
    defer.resolve(stats);
  });
  return defer.promise;
}

function create_json_if_not_exist(path) {
  let defer = Q.defer();
  test_exist(path).then(
    () => {
      defer.resolve();
    },
    () => {
      fs.writeFile(path, "{}", err => {
        if (err) defer.reject(err);
        defer.resolve();
      });
    }
  );
  return defer.promise;
}

function create_folder_if_not_exist(path) {
  let defer = Q.defer();
  test_exist(path).then(
    () => {
      defer.resolve();
    },
    () => {
      fs.mkdirSync(path);
      defer.resolve();
    }
  );
  return defer.promise;
}
