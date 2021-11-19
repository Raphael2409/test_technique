const fs = require("fs");
const browserify = require("browserify");
const exorcist = require("exorcist");
const externalLibs = require("../ExternalLibs");
var b = browserify({
  debug: true,
  entries: ["./app/main.js"],
  cache: {},
  packageCache: {}
});
externalLibs.forEach(element => {
  if (typeof element === "string") {
    b.external(element);
  } else {
    b.external(element.name);
  }
});

b.transform("uglifyify", {
  global: true,
  mangle: {
    keep_fnames: true
  }
})
  .bundle()
  .pipe(exorcist("www/js/app.compile.min.js.map"))
  .pipe(fs.createWriteStream("www/js/app.compile.min.js"));

var bLibs = browserify({
  debug: true,
  cache: {},
  packageCache: {}
});
externalLibs.forEach(element => {
  if (typeof element === "string") {
    bLibs.require(element);
  } else {
    bLibs.require(element.name, {
      expose: element.expose
    });
  }
});

bLibs
  .transform("uglifyify", {
    global: true,
    mangle: {
      keep_fnames: true
    }
  })
  .bundle()
  .pipe(exorcist("www/js/lib.compile.min.js.map"))
  .pipe(fs.createWriteStream("www/js/lib.compile.min.js"));
