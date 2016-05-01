"use strict";

var rollup = require("rollup").rollup;

rollup({
    entry   : "./app/index.js",
    plugins : [
        require("modular-css/rollup")({
            css : "./gen/c-hat.css"
        })
    ]
})
.then((bundle) => bundle.write({
    format : "iife",
    dest   : "./gen/c-hat.js"
}))
.catch(console.error.bind(console));
