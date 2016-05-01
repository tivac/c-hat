const remote = require("remote");
const m = require("mithril");

import app from "./app.js";

let settings = remote.getGlobal("settings");

// TODO: someday this may need to be an m.route invocation...
m.mount(document.body, app);
