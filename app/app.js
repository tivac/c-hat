const remote = require("remote");
const m = require("mithril");
const url = require("url");

import css from "./app.css";

let settings = remote.getGlobal("settings");

m.mount(document.body, {
    view : () => m("div", { class : css.bd },
        m("div", { class : css.nav },
            (settings.tabs || []).map((tab, idx) => m("a", {
                    title   : tab,
                    class   : css.link,
                    onclick : (e) => {
                        e.preventDefault();
                        settings.active = idx;
                    }
                },
                idx
            ))
        ),
        m("div", { class : css.content },
            (settings.tabs || []).map((tab, idx) => m("webview", {
                key   : idx,
                
                src   : tab,
                class : css[settings.active === idx ? "active" : "tab"],
                
                config : function(el, initialized) {
                    if(initialized) {
                        return;
                    }
                    
                    // Listen for attempts to open a new window and open them
                    // in the system default browser
                    el.addEventListener('new-window', function(e) {
                        let protocol = url.parse(e.url).protocol;
                        
                        if(protocol.indexOf("http") !== 0) {
                            return;
                        }
                        
                        require('electron').shell.openExternal(e.url);
                    });
                }
            }))
        )
    )
});
