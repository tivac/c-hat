const url = require("url");
const path = require("path");

const electron = require("electron");
const remote = require("remote");

const m = require("mithril");

import * as setup from "./setup.js";

import css from "./app.css";

const settings = remote.getGlobal("settings");

export function view() {
    // Default to settings if no tabs
    if(!settings.tabs.length) {
        settings.active = "setup";
    }
    
    return m("div", { class : css.bd },
        m("div", { class : css.nav },
            m("div", { class : css.tabs },
                settings.tabs.map((tab, idx) => m("a", {
                        title   : tab.title || tab.type || tab.url,
                        class   : css[settings.active === idx ? "activelink" : "link"],
                        
                        onclick : (e) => {
                            e.preventDefault();
                            settings.active = idx;
                        }
                    },
                    m("svg", { class : css.logo },
                        m("use", {
                            href : `./logos.svg#${tab.type}`
                        })
                    )
                ))
            ),
            m("div", { class : css.config },
                m("a", {
                        title : "Configure",
                        class : css[settings.active === "setup" ? "activeSetup" : "setup"],
                    
                        onclick : (e) => {
                            e.preventDefault();
                            
                            settings.active = "setup";
                        }
                    },
                    m("svg", { class : css.icon },
                        m("use", {
                            href : "./icons.svg#gear"
                        })
                    )
                )
            )
        ),
        m("div", { class : css.content },
            settings.tabs.map((tab, idx) => m("webview", {
                key   : idx,
                
                src   : tab.url,
                class : css[settings.active === idx ? "activetab" : "tab"],
                
                config : function(el, initialized) {
                    if(initialized) {
                        return;
                    }
                    
                    var session = remote.session.fromPartition(el.partition);
                    
                    session.setPermissionRequestHandler((contents, permission, cb) => {
                        cb((tab.permissions && tab.permissions.includes(permission)) === true);
                    });
                    
                    // Listen for attempts to open a new window and open them
                    // in the system default browser
                    el.addEventListener('new-window', (e) => {
                        // Work around https://github.com/electron/electron/issues/5217
                        if(e.disposition !== "foreground-tab") {
                            return;
                        }
                        
                        electron.shell.openExternal(e.url);
                    });
                    
                    el.addEventListener("page-title-updated", (e) => {
                        settings.tabs[idx].title = e.title;
                        
                        m.redraw();
                    });
                }
            })),
            settings.active === "setup" ? m(setup) : null
        )
    );
}
