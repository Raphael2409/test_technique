"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("spinal-env-drive-core");
const SpinalAccesRightsService_1 = require("./SpinalAccesRightsService");
const angular = require("angular");
// const interval = setInterval(() => {
//   if (angular.element("body > div").injector()) {
//     const authService = angular
//       .element("body > div")
//       .injector()
//       .get("authService");
//     const ngSpinalCore = angular
//       .element("body > div")
//       .injector()
//       .get("ngSpinalCore");
//     SpinalAdminInit.init(authService, ngSpinalCore).then(
//       () => {
//         clearInterval(interval);
//       },
//       () => {
//       }
//     );
//   }
// }, 2000);
angular
    .module('app.services')
    .run([
    'authService', 'ngSpinalCore',
    function (authService, ngSpinalCore) {
        SpinalAccesRightsService_1.SpinalAdminInit.init(authService, ngSpinalCore);
    }
]);
//# sourceMappingURL=index.js.map