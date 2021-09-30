var core = {
  "start": function () {
    core.load();
  },
  "install": function () {
    core.load();
  },
  "load": function () {
    config.contextmenu.load();
    /*  */
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

config.contextmenu.on.clicked(function (e) {
  if (e.menuItemId === "equalizer-status-enable") {
    app.tab.query.active(function (tab) {
      var domains = config.whitelist.domains;
      var hostname = (new URL(tab.url)).hostname;
      domains.push(hostname);
      domains = domains.filter(function(item, index, input) {return input.indexOf(item) === index});
      config.whitelist.domains = domains;
      chrome.contextMenus.update("equalizer-status-enable", {"enabled": false});
      chrome.contextMenus.update("equalizer-status-disable", {"enabled": true});
      /*  */
      chrome.tabs.reload(tab.id);
    });
  }
  /*  */
  if (e.menuItemId === "equalizer-status-disable") {
    app.tab.query.active(function (tab) {
      var domains = config.whitelist.domains;
      var hostname = (new URL(tab.url)).hostname;
      var index = domains.indexOf(hostname);
      if (index !== -1) domains.splice(index, 1);
      config.whitelist.domains = domains;
      chrome.contextMenus.update("equalizer-status-enable", {"enabled": true});
      chrome.contextMenus.update("equalizer-status-disable", {"enabled": false});
      /*  */
      chrome.tabs.reload(tab.id);
    });
  }
});

app.on.startup(core.start);
app.on.installed(core.install);