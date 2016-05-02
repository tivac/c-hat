const url = require("url");
const path = require("path");

const electron = require("electron");
const remote = require("remote");

const m = require("mithril");

import css from "./app.css";

const settings = remote.getGlobal("settings");

export default {
    view : () => {
        if(!settings.tabs.length) {
            return m("div", { class : css.bd },
                m("p", `You'll need to add some tabs to ${path.join(remote.app.getPath("userData"), "settings.json")}`),
                m("p", m("strong", "CLOSE C-HAT BEFORE EDITING THAT FILE")),
                m("p", "The ", m("code", `"tabs"`), " key in your ", m("code", "settings.json"), " file should look like this:"),
                m("pre", JSON.stringify([ {
                            "type": "flowdock",
                            "url": "https://flowdock.com"
                        },
                        {
                            "type": "discord",
                            "url": "https://discordapp.com/channels/@me"
                        },
                        {
                            "type": "slack",
                            "url": "https://hangzone.slack.com"
                        },
                        {
                            "type": "gitter",
                            "url": "https://gitter.im/arenanet/api-cdi"
                        }
                    ], null, 4)
                ),
                m("p", "Though obviously any other type won't have an icon yet.")
            );
        }
        
        return m("div", { class : css.bd },
            m("div", { class : css.nav },
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
            m("div", { class : css.content },
                settings.tabs.map((tab, idx) => m("webview", {
                    key   : idx,
                    
                    src   : tab.url,
                    class : css[settings.active === idx ? "activetab" : "tab"],
                    
                    config : function(el, initialized) {
                        if(initialized) {
                            return;
                        }
                        
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
                }))
            )
        );
    }
}
