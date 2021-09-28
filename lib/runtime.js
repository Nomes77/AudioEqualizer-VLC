app.version = function () {return chrome.runtime.getManifest().version};

app.on.message(function (request, sender, sendResponse) {
  var url = sender.tab && sender.tab.url ? sender.tab.url : (sender.url ? sender.url : '');
  /*  */
  if (request) {
    if (request.action === "page-load") sendResponse(url);
    /*  */
    if (request.action === "app-icon-error") {
      var hostname = url ? (new URL(url)).hostname : '';
      if (hostname) {
        config.blacklist.domains.push(hostname);
        config.blacklist.domains = config.blacklist.domains.filter(function(item, index, input) {return input.indexOf(item) === index});
      }
      /*  */
      core.init(function (items) {config.icon.update(items.eq, 3)});
    }
    /*  */
    if (request.action === "app-icon-normal") {
      var hostname = url ? (new URL(url)).hostname : '';
      /*  */
      core.init(function (items) {config.icon.update(items.eq, 4)});
    }
    /*  */
    if (request.action === "app-toggle") {
      config.addon.state = config.addon.state === "ON" ? "OFF" : "ON";
      chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; i++) {
          request.state = config.addon.state;
          chrome.tabs.sendMessage(tabs[i].id, request);
        }
      });
      /*  */
      sendResponse(config.addon.state);
      core.init(function (items) {config.icon.update(items.eq, 5)});
    }
    /*  */
    if (request.action === "app-set") {
      var items = {};
      items.eq = request.eq;
      items.ch = request.ch;
      items.presets = request.presets;
      items.selected = request.selected;
      chrome.storage.local.set(items, function () {
        chrome.tabs.query({}, function (tabs) {
          for (var i = 0; i < tabs.length; i++) {
            chrome.tabs.sendMessage(tabs[i].id, request);
          }
        });
        /*  */
        sendResponse(null);
        config.icon.update(items.eq, 6);
     });
    }
  }
});