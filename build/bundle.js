"use strict";

var rollup = require("rollup").rollup;

rollup({
    entry   : "./app/app.js",
    plugins : [
        require("modular-css/rollup")({
            css : "./gen/c-hat.css"
        })
    ]
})
.then((bundle) => bundle.write({
    format : "cjs",
    dest   : "./gen/c-hat.js"
}))
