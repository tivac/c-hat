const electron = require("electron");
const ipc = electron.ipcRenderer;

const remote = require("remote");
const settings = remote.getGlobal("settings");

import css from "./setup.css";

const types = [
    "discord",
    "flowdock",
    "gitter",
    "slack",
    "twitter",
];

// Redraw on tab changes
ipc.on("tab-update", () => m.redraw);

const editor = {
    controller : function(args) {
        var ctrl = this;
        
        ctrl.tab = {};
        
        ctrl.url = (url) => { ctrl.tab.url = url; };
        ctrl.type = (pos) => { ctrl.tab.type = types[pos]; };
        
        ctrl.add = () => {
            ipc.send("tab-add", ctrl.tab);
            
            ctrl.tab = {};
        };
        
        ctrl.remove = (pos) => ipc.send("tab-del", pos);
    },
    
    view : (ctrl, args) => m("div", { class : css.tab },
        m("div", { class : css.type },
            m("label", "Type ",
                m("select", {
                        value : args.tab.type || ctrl.tab.type,
                        
                        onchange : m.withAttr("selectedIndex", ctrl.type)
                    },
                    types.map((type) => m("option", { value : type }, type))
                )
            )
        ),
        m("div", { class : css.url },
            m("label", "URL ",
                m("input", {
                    type  : "url",
                    class : css.urlinput,
                    value : args.tab.url || ctrl.tab.url || "",
                    
                    oninput : m.withAttr("value", ctrl.url)
                })
            )
        ),
        m("div", { class : css.actions },
            args.tab.url ?
                m("button", {
                    onclick : ctrl.remove.bind(ctrl, args.idx)
                }, "Remove") :
                m("button", {
                    onclick : ctrl.add
                }, "Add")
        )
    )
};

export function view() {
    return m("div", { class : css.content },
        settings.tabs.map((tab, idx) => m(editor, { tab, idx })),
        m(editor, { tab : false })
    );
}
