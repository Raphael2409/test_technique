const spinalCore = require("spinal-core-connectorjs");
const spinalEnvDriveCore = require("spinal-env-drive-core");
const SpinalDrive_App = spinalEnvDriveCore.SpinalDrive_App;
const angular = require("angular");

const FileSystem = spinalCore._def["FileSystem"];
const Ptr = spinalCore._def["Ptr"];

/**
 * SpinalDrive_App_share
 * @extends {SpinalDrive_App}
 */
class SpinalDrive_App_share extends SpinalDrive_App {}
/**
 * DialogShareCtrl - controller to be added within a `$mdDialog.show` option parameter.
 *  e.g. {controller: ["$scope", "$mdDialog", "model_server_id", "spinalModelDictionary", "mdDialog", "ngSpinalCore",DialogShareCtrl], template: shareTemplate, ... , locals:
 * {model_server_id: obj,spinalModelDictionary: spinalModelDictionary, mdDialog: mdDialog, ngSpinalCore: ngSpinalCore}
 * }
 * @param {any} $scope automaticly given in the mdDialog.show
 * @param {angular} $mdDialog automaticly given in the mdDialog.show
 * @param {number} model_server_id resolved within the `local` object given to the $mdDialog.show(...)
 * @param {angularFactory} spinalModelDictionary same
 * @param {angularFactory} mdDialog same
 * @param {angularFactory} ngSpinalCore same
 */
SpinalDrive_App_share.DialogShareCtrl = function(
  $scope,
  $mdDialog,
  model_server_id,
  spinalModelDictionary,
  mdDialog,
  ngSpinalCore
) {
  spinalModelDictionary.init().then(function() {
    $scope.users = spinalModelDictionary.users.get();
    $scope.rightRead = false;
    $scope.rightWrite = false;
    $scope.rightShare = false;
    $scope.users.forEach(element => {
      element.share_selected = false;
      element._lowername = element.name.toLowerCase();
    });
    let mod = FileSystem._objects[model_server_id];
    let _data = 0;
    if (mod instanceof File) _data = mod._ptr.data.value;
    else if (mod instanceof Ptr) _data = mod.data.value;
    else _data = mod._server_id;
    ngSpinalCore.load_right(_data).then(
      res => {
        create_rightList(res);
      },
      () => {
        console.error(
          "load_right: couldn't load the right of the model " + model_server_id
        );
      }
    );
  });

  function create_right_col(flag, flagType) {
    if (flag & flagType) return "Yes";
    return "No";
  }

  function create_rightList(model) {
    $scope.selectedModelShared_to_user = [];
    for (var i = 0; i < model.length; i++) {
      let ur = model[i];
      $scope.selectedModelShared_to_user.push({
        id: ur.user.id.get(),
        name: ur.user.name.get(),
        rd: create_right_col(ur.flag.get(), spinalCore.right_flag.RD),
        wr: create_right_col(ur.flag.get(), spinalCore.right_flag.WR),
        ad: create_right_col(ur.flag.get(), spinalCore.right_flag.AD)
      });
    }
  }

  /**
   * Return the proper object when the append is called.
   */
  $scope.transformChip = function(chip) {
    // If it is an object, it's already a known chip
    if (angular.isObject(chip)) {
      return chip;
    }
    // Otherwise, create a new one
    return {
      name: chip,
      type: "new"
    };
  };
  $scope.error_msgs = [];
  $scope.chip_users = [];
  $scope.selectedItem = null;
  $scope.searchText = null;
  function createFilterFor(query) {
    var lowercaseQuery = query.toLowerCase();

    return function filterFn(user) {
      return (
        (user._lowername.indexOf(lowercaseQuery) === 0 ||
          user.id.toString().indexOf(lowercaseQuery) === 0) &&
        $scope.chip_users.some(c => {
          return c.id === user.id;
        }) === false
      );
    };
  }

  $scope.querySearch = query => {
    var results = query
      ? $scope.users.filter(createFilterFor(query))
      : $scope.users.filter(user => {
        return (
          $scope.chip_users.some(c => {
            return c.id === user.id;
          }) === false
        );
      });
    return results;
  };
  $scope.cancelDialog = function() {
    $mdDialog.hide();
  };

  $scope.submitDialog = function() {
    let flag = 0;
    $scope.error_msgs = [];
    if ($scope.rightRead == true) flag |= spinalCore.right_flag.RD;
    if ($scope.rightWrite == true) flag |= spinalCore.right_flag.WR;
    if ($scope.rightShare == true) flag |= spinalCore.right_flag.AD;

    if ($scope.chip_users.length == 0) {
      $scope.error_msgs.push("Add some user(s) to share.");
    }
    if (flag == 0) {
      $scope.error_msgs.push("Please select access rights level.");
    }
    if ($scope.error_msgs.length != 0) {
      return;
    }

    let data = FileSystem._objects[model_server_id];
    let file_name = "";
    if (data.name) file_name = data.name.get();
    else file_name = data.constructor.name + "_" + data._server_id;
    for (var i = 0; i < $scope.chip_users.length; i++) {
      ngSpinalCore.share_model(
        data,
        file_name,
        flag,
        $scope.chip_users[i].name
      );
    }
    $mdDialog.hide();
  };
};

angular.module("app.spinal-panel").run([
  "$templateCache",
  "$http",
  function($templateCache, $http) {
    let load_template = (uri, name) => {
      $http.get(uri).then(
        response => {
          $templateCache.put(name, response.data);
        },
        () => {
          console.log("Cannot load the file " + uri);
        }
      );
    };
    let toload = [
      {
        uri:
          "../templates/spinal-env-drive-plugin-base/Spinal_App_ShareTemplate.html",
        name: "Spinal_App_ShareTemplate.html"
      }
    ];
    for (var i = 0; i < toload.length; i++) {
      load_template(toload[i].uri, toload[i].name);
    }
  }
]);

/**
 * SpinalDrive_App_FileExplorer_share
 * @extends {SpinalDrive_App_share}
 */
class SpinalDrive_App_FileExplorer_share extends SpinalDrive_App_share {
  /**
   * Creates an instance of SpinalDrive_App_FileExplorer_share.
   * @memberof SpinalDrive_App_FileExplorer_share
   */
  constructor() {
    super(
      "ShareFileExplorer",
      "Share...",
      2,
      "share",
      "Share Models with other Users"
    );
    // super("ShareFileExplorer", "Share...", 2, "share", "Share Models with other Users", "share", ["all"], "all");
  }
  /**
   * method to handle the selection
   *
   * @param {any} element
   * @memberof SpinalDrive_App_FileExplorer_share
   */
  action(obj) {
    console.log(obj);
    let templateCache = obj.scope.injector.get("$templateCache");
    let spinalModelDictionary = obj.scope.injector.get("spinalModelDictionary");
    let mdDialog = obj.scope.injector.get("$mdDialog");
    let ngSpinalCore = obj.scope.injector.get("ngSpinalCore");
    mdDialog.show({
      controller: [
        "$scope",
        "$mdDialog",
        "model_server_id",
        "spinalModelDictionary",
        "mdDialog",
        "ngSpinalCore",
        SpinalDrive_App_share.DialogShareCtrl
      ],
      template: templateCache.get("Spinal_App_ShareTemplate.html"),
      parent: angular.element(document.body),
      targetEvent: obj.evt,
      clickOutsideToClose: true,
      locals: {
        model_server_id: obj.file._server_id,
        spinalModelDictionary: spinalModelDictionary,
        mdDialog: mdDialog,
        ngSpinalCore: ngSpinalCore
      }
    });
  }
}

module.exports.FileExplorerShare = SpinalDrive_App_FileExplorer_share;

/**
 * SpinalDrive_App_FolderExplorer_share
 * @extends {SpinalDrive_App_share}
 */
class SpinalDrive_App_FolderExplorer_share extends SpinalDrive_App_share {
  /**
   * Creates an instance of SpinalDrive_App_FolderExplorer_share.
   * @memberof SpinalDrive_App_FolderExplorer_share
   */
  constructor() {
    super(
      "ShareFolderExplorer",
      "Share...",
      3,
      "fa fa-share-alt",
      "Share Models with other Users"
    );
    // super("ShareFolderExplorer", "Share...", 3, "fa fa-share-alt", "Share Models with other Users", "share", ["all"], "all");
  }
  /**
   * method to handle the selection
   *
   * @param {any} element
   * @memberof SpinalDrive_App_FolderExplorer_share
   */
  action(obj) {
    let templateCache = obj.scope.injector.get("$templateCache");
    let spinalModelDictionary = obj.scope.injector.get("spinalModelDictionary");
    let mdDialog = obj.scope.injector.get("$mdDialog");
    let ngSpinalCore = obj.scope.injector.get("ngSpinalCore");
    // let spinalFileSystem = obj.scope.injector.get("spinalFileSystem");

    // let node = obj.node;
    // let n_par = spinalFileSystem.folderExplorer_dir[node.original.parent];
    // if (!n_par) {
    //   console.error("Error : Can't share your home / root");
    //   return;
    // }
    // let n_parent = FileSystem._objects[n_par.model];
    // if (!n_parent) {
    //   console.error("Error : Can't share your home / root");
    //   return;
    // }
    // let m_node;
    // for (var i = 0; i < n_parent.length; i++) {
    //   if (n_parent[i]._ptr.data.value == node.original.model) {
    //     m_node = n_parent[i];
    //     break;
    //   }
    // }
    mdDialog.show({
      controller: [
        "$scope",
        "$mdDialog",
        "model_server_id",
        "spinalModelDictionary",
        "mdDialog",
        "ngSpinalCore",
        SpinalDrive_App_share.DialogShareCtrl
      ],
      template: templateCache.get("Spinal_App_ShareTemplate.html"),
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      locals: {
        model_server_id: Number(obj.node.original.fileId),
        spinalModelDictionary: spinalModelDictionary,
        mdDialog: mdDialog,
        ngSpinalCore: ngSpinalCore
      }
    });
  }
  is_shown(d) {
    if (d.parent === "#") return false;
    return true;
  }
}
module.exports.FolderExplorerShare = SpinalDrive_App_FolderExplorer_share;

/**
 * SpinalDrive_App_Inspector_share
 * @extends {SpinalDrive_App_share}
 */
class SpinalDrive_App_Inspector_share extends SpinalDrive_App_share {
  /**
   * Creates an instance of SpinalDrive_App_Inspector_share.
   * @memberof SpinalDrive_App_Inspector_share
   */
  constructor() {
    super(
      "ShareInspector",
      "Share...",
      3,
      "share",
      "Share Models with other Users"
    );
    // super("ShareInspector", "Share...", 3, "share", "Share Models with other Users", "share", ["all"], "all");
  }
  /**
   * method to handle the selection
   *
   * @param {any} element
   * @memberof SpinalDrive_App_Inspector_share
   */
  action(obj) {
    let templateCache = obj.scope.injector.get("$templateCache");
    let spinalModelDictionary = obj.scope.injector.get("spinalModelDictionary");
    let mdDialog = obj.scope.injector.get("$mdDialog");
    let ngSpinalCore = obj.scope.injector.get("ngSpinalCore");
    mdDialog.show({
      controller: [
        "$scope",
        "$mdDialog",
        "model_server_id",
        "spinalModelDictionary",
        "mdDialog",
        "ngSpinalCore",
        SpinalDrive_App_share.DialogShareCtrl
      ],
      template: templateCache.get("Spinal_App_ShareTemplate.html"),
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      locals: {
        model_server_id: obj.model_server_id,
        spinalModelDictionary: spinalModelDictionary,
        mdDialog: mdDialog,
        ngSpinalCore: ngSpinalCore
      }
    });
  }

  /**
   * method to know if the app is needed to be shown.
   * if the method is not defined then the model is shown by default
   * @param {Object} d node of the tree selectionned
   * @returns {boolean}
   * @memberof SpinalDrive_App_Inspector_share
   */
  is_shown() {
    return true;
  }
}
module.exports.InspectorShare = SpinalDrive_App_Inspector_share;
