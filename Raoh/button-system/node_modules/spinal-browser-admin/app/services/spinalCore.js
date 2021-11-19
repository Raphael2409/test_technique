var angular = require("angular");
var spinalCore = require("spinal-core-connectorjs");
const FileSystem = spinalCore._def['FileSystem'];
const File = spinalCore._def['File'];
const Ptr = spinalCore._def['Ptr'];

angular.module("app.spinalcom").factory("ngSpinalCore", [
  "$q",
  function($q) {
    var service = {};
    service.conn = 0;
    const mapModelDictionary = new Map();

    service.connect = function(option) {
      service.conn = spinalCore.connect(option);
    };
    service.store = function(model, path) {
      var deferred = $q.defer();
      spinalCore.store(
        service.conn,
        model,
        path,
        function(model) {
          deferred.resolve(model);
        },
        function() {
          deferred.reject();
        }
      );
      return deferred.promise;
    };
    service.load = function(path) {
      var deferred = $q.defer();
      spinalCore.load(
        service.conn,
        path,
        function(model) {
          deferred.resolve(model);
        },
        function() {
          deferred.reject();
        }
      );
      return deferred.promise;
    };
    service.load_type = function(modelName, callback_success, callback_error) {
      // var deferred = $q.defer();
      spinalCore.load_type(
        service.conn,
        modelName,
        function(model) {
          callback_success(model);
          // deferred.resolve(model);
        },
        function() {
          callback_error();
          // deferred.reject();
        }
      );
      // return deferred.promise;
    };
    service.load_right = function(ptr) {
      var deferred = $q.defer();
      spinalCore.load_right(
        service.conn,
        ptr,
        function(model) {
          deferred.resolve(model);
        },
        function() {
          deferred.reject();
        }
      );
      return deferred.promise;
    };
    service.share_model = function(data, filename, flag, target_username) {
      return spinalCore.share_model(
        service.conn,
        data,
        filename,
        flag,
        target_username
      );
    };
    service.load_root = function() {
      var deferred = $q.defer();

      service.conn.load_or_make_dir("/", (model, err) => {
        if (err) deferred.reject();
        else deferred.resolve(model);
      });
      return deferred.promise;
    };
    service.loadModelPtr = function loadModelPtr(model) {
      if (model instanceof File) {
        return loadModelPtr(model._ptr);
      }
      if (!(model instanceof Ptr)) {
        throw new Error("loadModelPtr must take Ptr as parameter");
      }
      if (!model.data.value && model.data.model) {
        return Promise.resolve(model.data.model);
      } else if (!model.data.value) {
        throw new Error("Trying to load a Ptr to 0");
      }

      if (mapModelDictionary.has(model.data.value)) {
        return mapModelDictionary.get(model.data.value);
      }
      if (typeof FileSystem._objects[model.data.value] !== "undefined") {
        const promise = Promise.resolve(FileSystem._objects[model.data.value]);
        mapModelDictionary.set(model.data.value, promise);
        return promise;
      }
      const promise = new Promise((resolve, reject) => {
        model.load(m => {
          if (!m) {
            mapModelDictionary.delete(model.data.value);
            reject(new Error("Error in load Ptr"));
          } else {
            resolve(m);
          }
        });
      });
      mapModelDictionary.set(model.data.value, promise);
      return promise;
    };
    return service;
  }
]);
