(function() {
  window.angular.module("app.spinal-panel").controller("UserManagerCtrl", [
    "$scope",
    "$injector",
    "$mdToast",
    "$interval",
    "$timeout",
    "spinalModelDictionary",
    "$mdDialog",
    "$templateCache",
    "$q",
    "SpinalUserManagerService",
    function(
      $scope,
      $injector,
      $mdToast,
      $interval,
      $timeout,
      spinalModelDictionary,
      $mdDialog,
      $templateCache,
      $q,
      SpinalUserManagerService
    ) {
      $scope.injector = $injector;
      $scope.users = [];
      $scope.mainMenuClick = btn => {
        btn.action(btn);
      };

      spinalModelDictionary.init().then(function() {
        spinalModelDictionary.users.bind(onUsersChange);
      });

      function onUsersChange() {
        $scope.merge_users(spinalModelDictionary.users.get(), $scope.users);
      }

      $scope.getUserTypeString = () => {
        return "";
        // switch (person.type) {
        //   case 0:
        //     return "Admin";
        //   case 1:
        //     return "User";
        //   case 2:
        //     return "Suspended";
        //   default:
        //     return "undef";
        // }
      };

      function findUserId(arr, id) {
        return arr.findIndex(obj => {
          return obj.id === id;
        });
      }

      $scope.merge_users = (origin, dest) => {
        var i;
        for (i = 0; i < dest.length; i++) {
          let idx = findUserId(origin, dest[i].id);
          if (idx === -1) {
            dest.splice(i, 1);
            --i;
          }
        }
        for (i = 0; i < origin.length; i++) {
          let idx = findUserId(dest, origin[i].id);
          if (idx === -1) {
            var u = {
              name: origin[i].name,
              type: origin[i].type || 1,
              id: origin[i].id,
              selected: false
            };
            dest.splice(i, 0, u);
          } else {
            dest[idx].name = origin[i].name;
            dest[idx].type = origin[i].type || 1;
            dest[idx].id = origin[i].id;
          }
        }
        $scope.$apply();
      };
      $scope.onUserTypeChange = person => {
        console.log("onUserTypeChange");
        console.log(person);
      };

      $scope.addUser = () => {
        $mdDialog.show({
          ariaLabel: "NewUser",
          template: $templateCache.get("user-manager-create-user.html"),
          parent: window.angular.element(document.body),
          clickOutsideToClose: true,
          fullscreen: true,
          controller: [
            "$scope",
            "$mdDialog",
            "$copyToClipboard",
            "$mdToast",
            "$window",
            "SpinalUserManagerService",
            NewUserCtrl
          ],
          locals: {
            spinalModelDictionary: spinalModelDictionary
          }
        });
      };

      $scope.editUser = user => {
        $mdDialog.show({
          ariaLabel: "EditUser",
          template: $templateCache.get("user-manager-edit.html"),
          // parent: angular.element(document.body),
          clickOutsideToClose: true,
          fullscreen: true,
          controller: [
            "$scope",
            "$mdDialog",
            "$copyToClipboard",
            "$mdToast",
            "$window",
            "user",
            "SpinalUserManagerService",
            EditUserCtrl
          ],
          locals: {
            user: user,
            spinalModelDictionary: spinalModelDictionary
          }
        });
      };

      $scope.getUserIcon = user => {
        if (user.selected === true) return "done";
        return "person";
      };
      $scope.clickUserIcon = user => {
        user.selected = !user.selected;
      };
      $scope.selectedStyle = user => {
        if (user && user.selected) return "background-color: #4185f4";
        return "";
      };
      $scope.clearSelect = () => {
        for (var i = 0; i < $scope.users.length; i++) {
          $scope.users[i].selected = false;
        }
      };
      $scope.haveSelectedUsers = () => {
        for (var i = 0; i < $scope.users.length; i++) {
          if ($scope.users[i].selected === true) return true;
        }
        return false;
      };
      $scope.showMainBtn = btn => {
        if (btn.show_only_if_selected === true) {
          if ($scope.haveSelectedUsers()) return true;
          return false;
        }
        return true;
      };
      $scope.deleteSelected = () => {
        var selected = [];
        for (var i = 0; i < $scope.users.length; i++) {
          if ($scope.users[i].selected === true)
            selected.push($scope.users[i].name);
        }

        $mdDialog
          .show(
            $mdDialog
              .confirm()
              .title("Confirm the supression of " + selected.join(", "))
              .ok("Yes")
              .cancel("No")
          )
          .then(
            function name() {
              return $q
                .all(
                  selected.map(function(name) {
                    return SpinalUserManagerService.delete_account_by_admin(
                      name
                    );
                  })
                )
                .then(
                  function() {
                    $mdToast.showSimple(
                      "Delete User " + selected.join(", ") + " success."
                    );
                    $mdDialog.hide();
                  },
                  function() {
                    $mdToast.showSimple(
                      "Error: Delete User " +
                        selected.join(", ") +
                        " unsuccessful."
                    );
                    console.error(selected.join(", "));
                  }
                );
            },
            function() {}
          );
      };

      $scope.mainMenuBtn = [
        {
          label: "addUsers",
          action: $scope.addUser,
          icon: "person_add",
          show_only_if_selected: false
        },
        {
          label: "deleteSelectedUsers",
          action: $scope.deleteSelected,
          icon: "delete",
          show_only_if_selected: true
        },
        {
          label: "clearSelect",
          action: $scope.clearSelect,
          icon: "block",
          show_only_if_selected: true
        }
      ];
    }
  ]);

  var EditUserCtrl = function(
    $scope,
    $mdDialog,
    $copyToClipboard,
    $mdToast,
    $window,
    user,
    SpinalUserManagerService
  ) {
    $scope.userEdit = user;
    $scope.change_password = {
      password: "",
      confirm_password: ""
    };
    $scope.password_generator = len => {
      var length = len ? len : 10;
      var string = "abcdefghijklmnopqrstuvwxyz";
      var numeric = "0123456789";
      var password = "";
      var character = "";
      while (password.length < length) {
        if (Math.floor(Math.random() * 2)) {
          let entity1 = Math.ceil(
            string.length * Math.random() * Math.random()
          );
          let hold = string.charAt(entity1);
          hold = entity1 % 2 == 0 ? hold.toUpperCase() : hold;
          character += hold;
        } else {
          let entity2 = Math.ceil(
            numeric.length * Math.random() * Math.random()
          );
          character += numeric.charAt(entity2);
        }
        password = character;
      }
      return password;
    };
    // Set the default value of inputType
    $scope.passwordInputType = "password";

    $scope.showPassword = function() {
      $scope.passwordInputType = "text";
    };
    $scope.hidePassword = function() {
      $scope.passwordInputType = "password";
    };

    $scope.delete_account = () => {
      // $mdDialog.show($mdDialog.confirm()
      //     .title("Confirm the supression of " + user.name).multiple(true)
      //     .parent(angular.element(document.body))
      let result = confirm("Confirm the supression of " + user.name);
      if (result)
        return SpinalUserManagerService.delete_account_by_admin(user.name).then(
          function() {
            $mdToast.showSimple("Delete User " + user.name + " success.");
            $mdDialog.hide();
          },
          function(err) {
            $mdToast.showSimple(
              "Error: Delete User " + user.name + " unsuccessful."
            );
            console.error(err);
          }
        );
    };

    $scope.changeType = userType => {
      let result = confirm(
        "Confirm the change of permissions level for " + user.name
      );
      if (result)
        return SpinalUserManagerService.change_account_rights_by_admin(
          user.name,
          userType
        ).then(
          function() {
            $mdToast.showSimple("Change permissions success.");
          },
          function(err) {
            $mdToast.showSimple("Change permissions error.");
            console.error(err);
          }
        );
    };

    $scope.sendMail = function(myWindow, emailId, subject, message) {
      myWindow.document.location =
        "mailto:" + emailId + "?subject=" + subject + "&body=" + message;
      // myWindow.focus();
    };

    $scope.onError = function(err) {
      $mdToast.showSimple("Error : " + err);
    };

    $scope.changePasswordSubmit = (
      newpasswordForm,
      change_password,
      mailto
    ) => {
      let myWindow = null;
      newpasswordForm.$setDirty();
      if (newpasswordForm.$valid) {
        if (mailto) {
          myWindow = window.open("", "");
        }
        SpinalUserManagerService.change_password_by_admin(
          user.name,
          change_password.password
        ).then(
          function() {
            if (mailto) {
              $scope.sendMail(
                myWindow,
                user.name,
                "Réinitialisation mot de passe SpinalBIM",
                encodeURIComponent(
                  `Bonjour - vous recevez ce message suite à la réinitialisation de votre mot de passe par votre administrateur de la plateforme SpinalBIM.

Votre nouveau mot de passe est le : ${change_password.password}

Bonne journée.`
                )
              );
            }
            $mdToast.showSimple("Password has been successfully modified.");
          },
          err => {
            if (mailto) {
              myWindow.close();
            }
            $scope.onError(err);
          }
        );
        return;
      }
    };
    $scope.changePasswordGenerate = change_password => {
      change_password.password = $scope.password_generator();
      change_password.confirm_password = change_password.password;
      $mdToast.showSimple("Password generated.");
    };

    var toast_clipboard_error = $mdToast
      .simple()
      .textContent("Error: couldn't copy the password to clipboard")
      .action("Open native prompt")
      .capsule(true)
      .highlightClass("md-warn");
    $scope.changePasswordCopyToClipboard = change_password => {
      if (change_password && change_password.password) {
        $copyToClipboard.copy(change_password.password).then(
          function() {
            $mdToast.showSimple("Password copied to clipboard.");
          },
          function() {
            console.error("copy error");
            $mdToast.show(toast_clipboard_error).then(
              function(res) {
                if (res === "ok")
                  window.prompt(
                    "Copy to clipboard: Ctrl+C",
                    change_password.password
                  );
              },
              function() {}
            );
          }
        );
      } else {
        console.error("copy error");
      }
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  };

  var NewUserCtrl = function(
    $scope,
    $mdDialog,
    $copyToClipboard,
    $mdToast,
    $window,
    SpinalUserManagerService
  ) {
    $scope.password_generator = len => {
      var length = len ? len : 10;
      var string = "abcdefghijklmnopqrstuvwxyz";
      var numeric = "0123456789";
      var password = "";
      var character = "";
      while (password.length < length) {
        if (Math.floor(Math.random() * 2)) {
          let entity1 = Math.ceil(
            string.length * Math.random() * Math.random()
          );
          let hold = string.charAt(entity1);
          hold = entity1 % 2 == 0 ? hold.toUpperCase() : hold;
          character += hold;
        } else {
          let entity2 = Math.ceil(
            numeric.length * Math.random() * Math.random()
          );
          character += numeric.charAt(entity2);
        }
        password = character;
      }
      return password;
    };
    $scope.doSendMail = false;
    $scope.user = {
      name: "",
      password: "",
      confirm_password: "",
      type: "1"
    };
    $scope.newUserCancel = () => {
      $mdDialog.cancel();
    };
    // Set the default value of inputType
    $scope.passwordInputType = "password";

    $scope.showPassword = function() {
      $scope.passwordInputType = "text";
    };
    $scope.hidePassword = function() {
      $scope.passwordInputType = "password";
    };

    $scope.sendMail = function(myWindow, emailId, subject, message) {
      myWindow.document.location =
        "mailto:" + emailId + "?subject=" + subject + "&body=" + message;
      // myWindow.focus();
    };

    $scope.onError = function(err) {
      $mdToast.showSimple("Error : " + err);
    };
    $scope.newUserOK = (usrForm, usr, doSendMail) => {
      let myWindow = null;
      usrForm.$setDirty();
      if (usrForm.$valid) {
        if (usr.password === usr.confirm_password) {
          if (doSendMail) {
            myWindow = window.open("", "");
          }
          SpinalUserManagerService.new_account(usr.name, usr.password).then(
            function() {
              return SpinalUserManagerService.change_account_rights_by_admin(
                usr.name,
                usr.type
              ).then(
                function() {
                  if (doSendMail) {
                    $scope.sendMail(
                      myWindow,
                      usr.name,
                      "Votre compte SpinalBIM a été créé",
                      encodeURIComponent(
                        `Bonjour - vous recevez ce message suite à la création de votre compte sur la plateforme SpinalBIM par votre administrateur.

Votre login est le : ${usr.name}
Votre mot de passe est le : ${usr.password}

Nous vous invitons à modifier votre mot de passe dès que possible pour des raisons de sécurité. Pour cela, veuillez aller au menu « user » en haut a droite puis cliquer sur « Change Password ».`
                      )
                    );
                  }
                  $mdToast.showSimple("Account successfully created.");
                  $mdDialog.hide(usr);
                },
                err => {
                  if (doSendMail) {
                    myWindow.close();
                  }
                  $scope.onError(err);
                }
              );
            },
            err => {
              if (doSendMail) {
                myWindow.close();
              }
              $scope.onError(err);
            }
          );
          return;
        }
      }
    };

    $scope.passwordGenerate = change_password => {
      change_password.password = $scope.password_generator();
      change_password.confirm_password = change_password.password;
      $mdToast.showSimple("Password generated.");
    };

    var toast_clipboard_error = $mdToast
      .simple()
      .textContent("Error: couldn't copy the password to clipboard")
      .action("Open native prompt")
      .capsule(true)
      .highlightClass("md-warn");
    $scope.copyToClipboard = password => {
      if (password) {
        $copyToClipboard.copy(password).then(
          function() {
            $mdToast.showSimple("Password copied to clipboard.");
          },
          function() {
            console.error("copy error");
            $mdToast.show(toast_clipboard_error).then(
              function(res) {
                if (res === "ok")
                  window.prompt("Copy to clipboard: Ctrl+C", password);
              },
              function() {}
            );
          }
        );
      } else {
        console.error("copy error");
      }
    };
  };
})();
