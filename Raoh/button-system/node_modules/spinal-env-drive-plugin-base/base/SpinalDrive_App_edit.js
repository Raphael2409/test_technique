const spinalEnvDriveCore = require('spinal-env-drive-core');
const angular = require('angular');
/**
 * SpinalDrive_App_Edit
 * @extends {SpinalDrive_App}
 */
class SpinalDrive_App_Edit extends spinalEnvDriveCore.SpinalDrive_App {}
/**
 * DialogEditCtrl - controller to be added within a `$mdDialog.show` option parameter.
 *  e.g. {controller: ["$scope", "$mdDialog", "model_server_id", "spinalModelDictionary", "mdDialog", "ngSpinalCore",DialogEditCtrl], template: shareTemplate, ... , locals:
 * {model_server_id: obj,spinalModelDictionary: spinalModelDictionary, mdDialog: mdDialog, ngSpinalCore: ngSpinalCore}
 * }
 * @param {any} $scope automaticly given in the mdDialog.show
 * @param {angular} $mdDialog automaticly given in the mdDialog.show
 * @param {number} model_server_id resolved within the `local` object given to the $mdDialog.show(...)
 * @param {angularFactory} spinalModelDictionary same
 * @param {angularFactory} mdDialog same
 * @param {angularFactory} ngSpinalCore same
 */
SpinalDrive_App_Edit.DialogEditCtrl = function(
  $scope,
  $mdDialog,
  model_server_id,
) {
  let mod = window.FileSystem._objects[model_server_id];
  $scope.editModel = mod;
  $scope.modelData = mod.get();
  $scope.editModelContruct = mod.constructor.name;
  $scope.editForm = {};

  $scope.cancelDialog = function() {
    $mdDialog.hide();
  };

  $scope.submitDialog = function() {
    mod.set($scope.editForm.modelData.$modelValue);
    $mdDialog.hide();
  };
  $scope.isStr = m => {
    return m instanceof window.Str;
  };
  $scope.isVal = m => {
    return m instanceof window.Val;
  };
  $scope.isBool = m => {
    return m instanceof window.Bool;
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
          "../templates/spinal-env-drive-plugin-base/SpinalDrive_App_Edit_EditTemplate.html",
        name: "SpinalDrive_App_Edit_EditTemplate.html"
      }
    ];
    for (var i = 0; i < toload.length; i++) {
      load_template(toload[i].uri, toload[i].name);
    }
  }
]);

/**
 * SpinalDrive_App_Inspector_edit
 * @extends {SpinalDrive_App_Edit}
 */
class SpinalDrive_App_Inspector_edit extends SpinalDrive_App_Edit {
  /**
   * Creates an instance of SpinalDrive_App_Inspector_edit.
   * @memberof SpinalDrive_App_Inspector_edit
   */
  constructor() {
    super("EditInspector", "Edit...", 3, "edit", "Edit Atomic Models...");
    // super("EditInspector", "Edit...", 3, "edit", "Edit Atomic Models...", "edit", ["all"], "all");
  }
  /**
   * method to handle the selection
   *
   * @param {any} element
   * @memberof SpinalDrive_App_Inspector_edit
   */
  action(obj) {
    let spinalModelDictionary = obj.scope.injector.get("spinalModelDictionary");
    let mdDialog = obj.scope.injector.get("$mdDialog");
    let ngSpinalCore = obj.scope.injector.get("ngSpinalCore");
    let templateCache = obj.scope.injector.get("$templateCache");
    mdDialog.show({
      ariaLabel: "Edit",
      controller: [
        "$scope",
        "$mdDialog",
        "model_server_id",
        SpinalDrive_App_Edit.DialogEditCtrl
      ],
      template: templateCache.get("SpinalDrive_App_Edit_EditTemplate.html"),
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
   * @memberof SpinalDrive_App_Inspector_edit
   */
  is_shown(d) {
    if (d && d.data && d.data._server_id) {
      let m = window.FileSystem._objects[d.data._server_id];
      if (m) {
        return m instanceof window.Val || m instanceof window.Bool || m instanceof window.Str;
      }
    }
    return false;
  }
}
module.exports.InspectorEdit = SpinalDrive_App_Inspector_edit;
