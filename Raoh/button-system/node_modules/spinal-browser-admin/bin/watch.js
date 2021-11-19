const fs = require("fs");
const browserify = require("browserify");
const watchify = require("watchify");
const hmr = require("browserify-hmr");
const externalLibs = require("../ExternalLibs");

var b = browserify({
  entries: ["app/main.js"],
  cache: {},
  debug: true,
  packageCache: {},
  plugin: [watchify, hmr]
});
// .external(externalLibs);
externalLibs.forEach(element => {
  if (typeof element === "string") {
    b.external(element);
  } else b.external(element.name);
});

b.on("update", bundle);
bundle();

function bundle() {
  console.log("bundle");
  let output = fs.createWriteStream("www/js/app.compile.min.js");
  b
    // .transform("browserify-css", {
    //   minify: true,
    //   output: "www/css/build.css"
    // })
    .bundle()
    .pipe(output);
  output.on("finish", function() {
    console.log("build done.");
  });
}

var bLibs = browserify({
  debug: true,
  cache: {},
  packageCache: {}
});
externalLibs.forEach(element => {
  if (typeof element === "string") {
    bLibs.require(element);
  } else
    bLibs.require(element.name, {
      expose: element.expose
    });
});

bLibs.bundle().pipe(fs.createWriteStream("./www/js/lib.compile.min.js"));
