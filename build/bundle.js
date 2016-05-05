"use strict";

var rollup = require("rollup").rollup;

rollup({
    entry   : "./app/renderer.js",
    plugins : [
        require("modular-css/rollup")({
            css : "./app/gen/c-hat.css"
        })
    ]
})
.then((bundle) => bundle.write({
    format : "iife",
    dest   : "./app/gen/c-hat.js"
}))
.catch(console.error.bind(console));
