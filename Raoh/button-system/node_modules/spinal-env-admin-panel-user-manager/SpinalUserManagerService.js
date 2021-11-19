const SpinalUserManager = window.SpinalUserManager;
const angular = window.angular;

angular.module("app.spinal-panel").factory("SpinalUserManagerService", [
  "authService",
  "spinalModelDictionary",
  "$q",
  function(authService, spinalModelDictionary, $q) {
    let factory = {};
    let options = location.host + "/";
    let admin = {
      id: 0,
      password: ""
    };
    spinalModelDictionary.init().then(() => {
      let user = authService.get_user();
      factory.get_admin_id(user.username, user.password).then(
        id => {
          factory.setAdminAccoount(id, user.password);
        },
        () => {}
      );
    });
    factory.setAdminAccoount = (admin_id, password) => {
      admin.id = admin_id;
      admin.password = password;
    };

    factory.get_user_id = (user_name, password) => {
      let deferred = $q.defer();
      SpinalUserManager.get_user_id(
        options,
        user_name,
        password,
        function(response) {
          let id = parseInt(response);
          deferred.resolve(id);
        },
        function(err) {
          deferred.reject(err);
        }
      );
      return deferred.promise;
    };
    factory.get_admin_id = (admin_name, password) => {
      let deferred = $q.defer();
      SpinalUserManager.get_admin_id(
        options,
        admin_name,
        password,
        function(response) {
          let id = parseInt(response);
          deferred.resolve(id);
        },
        function(err) {
          deferred.reject(err);
        }
      );
      return deferred.promise;
    };
    factory.new_account = (user_name, password) => {
      let deferred = $q.defer();
      SpinalUserManager.new_account(
        options,
        user_name,
        password,
        function() {
          deferred.resolve();
        },
        function(err) {
          deferred.reject(err);
        }
      );
      return deferred.promise;
    };
    factory.change_password = (user_id, password, new_password) => {
      let deferred = $q.defer();
      SpinalUserManager.change_password(
        options,
        user_id,
        password,
        new_password,
        function() {
          deferred.resolve();
        },
        function(err) {
          deferred.reject(err);
        }
      );
      return deferred.promise;
    };
    factory.delete_account = (user_id, password) => {
      let deferred = $q.defer();
      SpinalUserManager.delete_account(
        options,
        user_id,
        password,
        function() {
          deferred.resolve();
        },
        function(err) {
          deferred.reject(err);
        }
      );
      return deferred.promise;
    };
    factory.change_password_by_admin = (username, password) => {
      let deferred = $q.defer();
      SpinalUserManager.change_password_by_admin(
        options,
        username,
        password,
        admin.id,
        admin.password,
        function() {
          deferred.resolve();
        },
        function(err) {
          deferred.reject(err);
        }
      );
      return deferred.promise;
    };
    factory.delete_account_by_admin = username => {
      let deferred = $q.defer();
      SpinalUserManager.delete_account_by_admin(
        options,
        username,
        admin.id,
        admin.password,
        function() {
          deferred.resolve();
        },
        function(err) {
          deferred.reject(err);
        }
      );
      return deferred.promise;
    };
    factory.change_account_rights_by_admin = (username, right) => {
      let deferred = $q.defer();
      SpinalUserManager.change_account_rights_by_admin(
        options,
        username,
        right,
        admin.id,
        admin.password,
        function() {
          deferred.resolve();
        },
        function(err) {
          deferred.reject(err);
        }
      );
      return deferred.promise;
    };
    return factory;
  }
]);
