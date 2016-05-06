"use strict";

var rollup = require("rollup").rollup,
    argv   = require("minimist")(process.argv.slice(2));
    
function noop() { }

rollup({
    entry   : "./app/renderer.js",
    plugins : [
        require("rollup-plugin-node-resolve")({
            browser : true
        }),
        require("modular-css/rollup")({
            css   : "./app/gen/c-hat.css",
            namer : argv.compress ? require("modular-css-namer")() : undefined,
            done  : [
                argv.compress ? require("cssnano")() : noop
            ]
        }),
        require("rollup-plugin-buble")(),
        argv.compress ? require("mithril-objectify/rollup")() : noop,
        argv.compress ? require("rollup-plugin-uglify")() : noop
    ]
})
.then((bundle) => bundle.write({
    format : "iife",
    dest   : "./app/gen/c-hat.js"
}))
.catch((error) => console.error(error.stack));
