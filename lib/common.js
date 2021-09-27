var core = {
  "start": function () {
    core.load();
  },
  "install": function () {
    core.load();
  },
  "load": function () {
    core.init(function (items) {
      chrome.storage.local.set(items, function () {
        config.icon.update(items.eq, 2);
      });
    });
  },
  "init": function (callback) {
    chrome.storage.local.get(null, function (e) {
      var items = {};
      /*  */
      items.eq = e.eq ? e.eq : config.setting.EQ;
      items.ch = e.ch ? e.ch : config.setting.CH;
      items.presets = e.presets ? e.presets : config.setting.PRESETS;
      items.whitelist = e.whitelist ? e.whitelist : config.setting.WHITELIST;
      /*  */
      callback(items);
    });
  }
};

app.on.startup(core.start);
app.on.installed(core.install);