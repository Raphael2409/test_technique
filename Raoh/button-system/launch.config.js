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

const fs = require("fs");
const path = require("path");
var apps_keys;
const module_config_path = path.resolve("./default_config.json");
let actu_env = "";
var apps, configStr, config;
switch (process.env.NODE_ENV) {
  case "production":
    actu_env = "env_production";
    break;
  case "test":
    actu_env = "env_test";
    break;
  default:
    actu_env = "env";
}

if (fs.existsSync(module_config_path)) {
  // in module
  const module_path = path.resolve(".");
  const package_path = path.resolve(module_path + "/package.json");
  let packageStr = fs.readFileSync(package_path, {
    flag: "r",
    ecoding: "utf8"
  });
  let _package = JSON.parse(packageStr.toString());
  let curr_app = {
    name: _package.name,
    script: _package.main,
    cwd: module_path
  };

  apps = {
    apps: [curr_app]
  };

  configStr = fs.readFileSync(module_config_path, {
    flag: "r",
    ecoding: "utf8"
  });
  config = JSON.parse(configStr.toString());
  for (var key in config) {
    if (config.hasOwnProperty(key)) {
      curr_app[key] = config[key];
    }
  }
  let port = extract_port(curr_app);
  if (port != null) {
    curr_app.name = curr_app.name + "-" + port;
  }
  curr_app.restart_delay = "3000";
} else {
  const appsPath = path.resolve("./.apps.json"),
    configPath = path.resolve("./.config.json");

  let appsStr = fs.readFileSync(appsPath, {
    flag: "r",
    ecoding: "utf8"
  });
  configStr = fs.readFileSync(configPath, {
    flag: "r",
    ecoding: "utf8"
  });

  apps = JSON.parse(appsStr.toString());
  config = JSON.parse(configStr.toString());

  for (apps_keys in apps.apps) {
    if (apps.apps.hasOwnProperty(apps_keys)) {
      let name = apps.apps[apps_keys].name;
      apps.apps[apps_keys] = Object.assign(apps.apps[apps_keys], config[name]);
    }
  }

  let hub_cfg = get_hub_cfg(config);

  if (hub_cfg) {
    for (apps_keys in apps.apps) {
      if (apps.apps.hasOwnProperty(apps_keys)) {
        if ("spinal-core-hub" === apps.apps[apps_keys].name) continue;
        merge_config_rec(hub_cfg, apps.apps[apps_keys]);
      }
    }
  }

  for (apps_keys in apps.apps) {
    if (apps.apps.hasOwnProperty(apps_keys)) {
      let port = extract_port(apps.apps[apps_keys]);
      if (port != null) {
        apps.apps[apps_keys].name = apps.apps[apps_keys].name + "-" + port;
      }
      apps.apps[apps_keys].restart_delay = "3000";
    }
  }
}

function get_hub_cfg(config) {
  if (config.hasOwnProperty("spinal-core-hub")) {
    return config["spinal-core-hub"];
  }
  return null;
}

function merge_config_rec(default_config, dest) {
  for (var key in default_config) {
    if (!dest.hasOwnProperty(key)) {
      dest[key] = default_config[key];
    } else if (typeof default_config[key] == "object") {
      merge_config_rec(default_config[key], dest[key]);
    }
  }
}

function extract_port(cfg) {
  if (
    cfg.hasOwnProperty(actu_env) &&
    cfg[actu_env].hasOwnProperty("SPINALHUB_PORT")
  ) {
    return cfg[actu_env].SPINALHUB_PORT;
  }
  return null;
}

module.exports = apps;
