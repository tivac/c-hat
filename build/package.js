/* eslint no-console:0 */
"use strict";

var packager = require("electron-packager"),
    humanize = require("humanize-duration"),
    zipdir   = require("zip-dir"),
    size     = require("filesize"),
    
    pkg = require("../package.json"),
    
    start = Date.now();
    
packager({
    platform  : "win32,linux",
    arch      : "all",
    asar      : true,
    dir       : "./app",
    icon      : "./logo/hat",
    out       : "./packages",
    overwrite : true,
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
    
    console.log(`\nBuilt ${paths.length} package(s) in ${humanize(Date.now() - start)}:\n\t${paths.join("\n\t")}\n`);
    
    start = Date.now();
    
    console.log("Zipping packages...");
    
    return Promise.all(paths.map((dir) => {
        var out = `${dir}.zip`;
        
        return new Promise((resolve, reject) => {
            zipdir(dir, {
                saveTo : out
            }, (err, buffer) => {
                if(err) {
                    return reject(err);
                }
                
                console.log(`Zipped ${out} (${size(buffer.length)}) in ${humanize(Date.now() - start)}`);
                
                return resolve(out);
            });
        });
    }))
    .catch((err) => {
        console.error(err);
        
        return process.exit(1);
    });
});
