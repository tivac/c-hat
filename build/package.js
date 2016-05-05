"use strict";

var packager = require("electron-packager"),
    
    pkg = require("../package.json");
    
packager({
    arch      : "all",
    asar      : true,
    dir       : "./app",
    icon      : "./logo/hat",
    out       : "./packages",
    overwrite : true,
    platform  : "win32,linux",
    prune     : true,
    
    download : {
        cache : "./packages/cache"
    },
    
    "app-copyright" : "Copyright (C) 2016 Patrick Cavit. All rights reserved.",
    "app-version"   : pkg.version,
    
    "version-string" : {
        CompanyName     : "Patrick Cavit",
        FileDescription : "Tabbed web chat clients are fun.",
        ProductName     : pkg.productName
    }
}, (error, paths) => {
    if(error) {
        console.error(error);
        
        return process.exit(1);
    }
    
    console.log(`Wrote:\n${paths.join("\n")}`);
});
