var app = {};

app.popup = {
  "message": {},
  "receive": function (id, callback) {
    app.popup.message[id] = callback;
  },
  "send": function (id, data) {
    chrome.runtime.sendMessage({
      "data": data,
      "method": id,
      "path": "background-to-popup"
    });
  }
};

app.on = {
  "management": function (callback) {
    chrome.management.getSelf(callback);
  },
  "uninstalled": function (url) {
    chrome.runtime.setUninstallURL(url, function () {});
  },
  "installed": function (callback) {
    chrome.runtime.onInstalled.addListener(function (e) {
      app.storage.load(function () {
        callback(e);
      });
    });
  },
  "startup": function (callback) {
    chrome.runtime.onStartup.addListener(function (e) {
      app.storage.load(function () {
        callback(e);
      });
    });
  },
  "message": function (callback) {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      app.storage.load(function () {
        callback(message, sender, sendResponse);
      });
      /*  */
      return true;
    });
  }
};

app.page = {
  "message": {},
  "receive": function (id, callback) {
    app.page.message[id] = callback;
  },
  "send": function (id, data, tabId, frameId) {
    chrome.tabs.query({}, function (tabs) {
      if (tabs && tabs.length) {
        var options = {
          "method": id, 
          "data": data,
          "path": "background-to-page"
        };
        /*  */
        tabs.forEach(function (tab) {
          if (tab) {
            if (tabId !== null) {
              if (tabId === tab.id) {
                if (frameId !== null) {
                  chrome.tabs.sendMessage(tab.id, options, {"frameId": frameId});
                } else {
                  chrome.tabs.sendMessage(tab.id, options);
                }
              }
            } else {
              chrome.tabs.sendMessage(tab.id, options);
            }
          }
        });
      }
    });
  }
};

app.storage = (function () {
  chrome.storage.onChanged.addListener(function () {
    chrome.storage.local.get(null, function (e) {
      app.storage.local = e;
      if (app.storage.callback) {
        if (typeof app.storage.callback === "function") {
          app.storage.callback(true);
        }
      }
    });
  });
  /*  */
  return {
    "local": {},
    "callback": null,
    "read": function (id) {
      return app.storage.local[id];
    },
    "on": {
      "changed": function (callback) {
        if (callback) {
          app.storage.callback = callback;
        }
      }
    },
    "write": function (id, data, callback) {
      var tmp = {};
      tmp[id] = data;
      app.storage.local[id] = data;
      chrome.storage.local.set(tmp, function (e) {
        if (callback) callback(e);
      });
    },
    "load": function (callback) {
      var keys = Object.keys(app.storage.local);
      if (keys && keys.length) {
        if (callback) callback("cache");
      } else {
        chrome.storage.local.get(null, function (e) {
          app.storage.local = e;
          if (callback) callback("disk");
        });
      }
    }
  }
})();

app.tab = {
  "open": function (url, index, active, callback) {
    var properties = {
      "url": url, 
      "active": active !== undefined ? active : true
    };
    /*  */
    if (index !== undefined) {
      if (typeof index === "number") {
        properties.index = index + 1;
      }
    }
    /*  */
    chrome.tabs.create(properties, function (tab) {
      if (callback) callback(tab);
    }); 
  },
  "query": {
    "index": function (callback) {
      chrome.tabs.query({"active": true, "currentWindow": true}, function (tabs) {
        if (tabs && tabs.length) {
          callback(tabs[0].index);
        } else callback(undefined);
      });
    },
    "active": function (callback) {
      chrome.tabs.query({"active": true, "currentWindow": true}, function (tabs) {
        if (tabs && tabs.length) {
          app.tab.check.url(tabs[0], function (tab) {
            callback(tab);
          });
        }
      });
    } 
  },
  "check": {
    "url": function (tab, callback) {
      if (tab.url) callback(tab);
      else {
        chrome.tabs.executeScript(tab.id, {
          "runAt": "document_start",
          "code": "document.location.href"
        }, function (result) {
          var error = chrome.runtime.lastError;
          if (result && result.length) {
            tab.url = result[0];
          }
          /*  */
          callback(tab);
        });
      }
    }
  }
};