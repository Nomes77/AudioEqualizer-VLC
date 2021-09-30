var config = {};

config.blacklist = {"domains": []};

config.addon = {
  set state (val) {app.storage.write("state", val)},
  get state () {return app.storage.read("state") !== undefined ? app.storage.read("state") : "ON"}
};

config.whitelist = {
  set domains (val) {app.storage.write("whitelist", val)},
  get domains () {return app.storage.read("whitelist") ? app.storage.read("whitelist") : []}
};

config.setting = {
  "CH": {"mono": false},
  "EQ": [
    {"label": "master", "gain": 1},
    {"label": "64", "f": 64, "gain": 0, "type": "peaking"},
    {"label": "32", "f": 32, "gain": 0, "type": "lowshelf"},
    {"label": "125", "f": 125, "gain": 0, "type": "peaking"},
    {"label": "250", "f": 250, "gain": 0, "type": "peaking"},
    {"label": "500", "f": 500, "gain": 0, "type": "peaking"},
    {"label": "1k", "f": 1000, "gain": 0, "type": "peaking"},
    {"label": "2k", "f": 2000, "gain": 0, "type": "peaking"},
    {"label": "4k", "f": 4000, "gain": 0, "type": "peaking"},
    {"label": "8k", "f": 8000, "gain": 0, "type": "peaking"},
    {"label": "16k", "f": 16000, "gain": 0, "type": "highshelf"}
  ],
  "PRESETS": [
    {"name": "Default", "default": true, "gains": [0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000]},
    {"name": "Club", "default": true, "gains": [0.0000, 0.0000, 4.8000, 3.3600, 3.3600, 3.3600, 1.9200, 0.0000, 0.0000, 0.0000]},
    {"name": "Live", "default": true, "gains": [-2.8800, 0.0000, 2.4000, 3.3600, 3.3600, 3.3600, 2.4000, 1.4400, 1.4400, 1.4400]},
    {"name": "Party", "default": true, "gains": [4.3200, 4.3200, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 4.3200, 4.3200]},
    {"name": "Dance", "default": true, "gains": [5.7600, 4.3200, 1.4400, 0.0000, 0.0000, -3.3600, -4.3200, -4.3200, 0.0000, 0.0000]},
    {"name": "Pop", "default": true, "gains": [-0.9600, 2.8800, 4.3200, 4.8000, 3.3600, 0.0000, -1.4400, -1.4400, -0.9600, -0.9600]},
    {"name": "Soft", "default": true, "gains": [2.8800, 0.9600, 0.0000, -1.4400, 0.0000, 2.4000, 4.8000, 5.7600, 6.7200, 7.2000]},
    {"name": "Ska", "default": true, "gains": [-1.4400, -2.8800, -2.4000, 0.0000, 2.4000, 3.3600, 5.2800, 5.7600, 6.7200, 5.7600]},
    {"name": "Reggae", "default": true, "gains": [0.0000, 0.0000, 0.0000, -3.3600, 0.0000, 3.8400, 3.8400, 0.0000, 0.0000, 0.0000]},
    {"name": "Rock", "default": true, "gains": [4.8000, 2.8800, -3.3600, -4.8000, -1.9200, 2.4000, 5.2800, 6.7200, 6.7200, 6.7200]},
    {"name": "Techno", "default": true, "gains": [4.8000, 3.3600, 0.0000, -3.3600, -2.8800, 0.0000, 4.8000, 5.7600, 5.7600, 5.2800]},
    {"name": "Soft rock", "default": true, "gains": [2.4000, 2.4000, 1.4400, 0.0000, -2.4000, -3.3600, -1.9200, 0.0000, 1.4400, 5.2800]},
    {"name": "Classical", "default": true, "gains": [0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, -4.3200, -4.3200, -4.3200, -5.7600]},
    {"name": "Large Hall", "default": true, "gains": [6.2400, 6.2400, 3.3600, 3.3600, 0.0000, -2.8800, -2.8800, -2.8800, 0.0000, 0.0000]},
    {"name": "Full Bass", "default": true, "gains": [-3.8000, 5.7600, 5.7600, 3.3600, 0.9600, -2.4000, -4.8000, -6.2400, -6.7200, -6.7200]},
    {"name": "Full Treble", "default": true, "gains": [-5.7600, -5.7600, -5.7600, -2.4000, 1.4400, 6.7200, 9.6000, 9.6000, 9.6000, 10.0800]},
    {"name": "Full Bass & Treble", "default": true, "gains": [4.3200, 3.3600, 0.0000, -4.3200, -2.8800, 0.9600, 4.8000, 6.7200, 7.2000, 7.2000]},
    {"name": "Headphones", "default": true, "gains": [2.8800, 6.7200, 3.3600, -1.9200, -1.4400, 0.9600, 2.8800, 5.7600, 7.6800, 8.6400]}
  ]
};

config.icon = (function () {
	var px = window.devicePixelRatio > 1 ? 2 : 1;
	var canvas = document.createElement("canvas");
	var w = px * 19;
	var h = px * 19;
	canvas.width = w;
	canvas.height = h;
	var context = canvas.getContext("2d");
	var size = function (e) {return Math.round((e / 4) * (w / 8))};
	/*  */
	return {
		"update": function (eq, loc) {
      app.tab.query.active(function (tab) {
        if (tab && tab.url) {
          if (tab.url.indexOf("http") === 0) {
            var values = [], lines = [5, 15, 25];
            var hostname = (new URL(tab.url)).hostname;
            /*  */
            for (var i = 0; i < 3; i++) {
              var val = (parseFloat(eq[i * 3 + 1].gain, 10) + parseFloat(eq[i * 3 + 2].gain, 10) + parseFloat(eq[i * 3 + 3].gain, 10));
              val = (val !== 0) ? val / 3 : 0;
              val = Math.floor((val / 12) * 10);
              values.push(val);
            }
            /*  */
            context.beginPath();
            context.clearRect(0, 0, size(32), size(32));
            context.closePath();
            for (var i = 0; i < values.length; i++) {
              var val = values[i];
              context.beginPath();
              context.fillStyle = status === "error" ? "rgb(160, 160, 160)" : (status === "disable" ? "rgb(160, 160, 160)" : "#C22A13");
              context.fillRect(size(lines[i]), size(0), size(3), size(11 - val));
              context.fill();
              context.closePath();
              /*  */
              context.beginPath();
              context.fillStyle = status === "error" ? "rgb(160, 160, 160)" : (status === "disable" ? "rgb(160, 160, 160)" : "#BAA206");
              context.fillRect(size(lines[i]), size(22 - val), size(3), size(10 + val));
              context.fill();
              context.closePath();
              /*  */
              context.beginPath();
              context.fillStyle = status === "error" ? "rgb(255, 25, 25)" : (status === "disable" ? "rgb(140, 140, 140)" : "#3C9103");
              context.fillRect(size(lines[i] - 2), size(13 - val), size(7), size(7));
              context.fill();
              context.closePath();
            }
            /*  */
            chrome.storage.local.get({"selected": {"name": "Default"}}, function (e) {
              var path = canvas.toDataURL("image/png");
              var title = "AE(VLC)" + (status === "error" ? " :: Error" : (status === "disable" ? " :: Disabled" : " :: " + e.selected.name));
              /*  */
              chrome.browserAction.setIcon({"tabId": tab.id, "path": path});
              chrome.browserAction.setTitle({"tabId": tab.id, "title": title});
            });
          }
        }
      });
		}
	};
})();

config.contextmenu = {
  "id": "equalizer-contextmenu-id",
  "on": {
    "clicked": function (callback) {
      if (chrome.contextMenus) {
        chrome.contextMenus.onClicked.addListener(function (e) {
          app.storage.load(function () {
            callback(e);
          });
        });
      }
    }
  },
  "create": {
    "parent": function () {
      chrome.contextMenus.create({
        "contexts": ["page"], 
        "title": "Audio Equalizer (VLC)",
        "id": config.contextmenu.id,
        "documentUrlPatterns": ["http://*/*", "https://*/*"]
      });
    },
    "enable": function () {
      chrome.contextMenus.create({
        "enabled": false,
        "contexts": ["page"],
        "title": "Add to whitelist",
        "id": "equalizer-status-enable",
        "parentId": config.contextmenu.id,
        "documentUrlPatterns": ["http://*/*", "https://*/*"]
      });
    },
    "disable": function () {
      chrome.contextMenus.create({
        "enabled": true,
        "contexts": ["page"],
        "id": "equalizer-status-disable",
        "title": "Remove from whitelist",
        "parentId": config.contextmenu.id,
        "documentUrlPatterns": ["http://*/*", "https://*/*"]
      });
    }
  },
  "load": function () {
    var toggle = function () {
      chrome.storage.local.get(null, function (data) {
        app.tab.query.active(function (tab) {
          if (tab && tab.url && tab.url.indexOf("http") === 0) {
            config.icon.update(data.eq, 1);
            var domains = config.whitelist.domains;
            var hostname = (new URL(tab.url)).hostname;
            chrome.contextMenus.update("equalizer-status-enable", {"enabled": domains.indexOf(hostname) === -1});
            chrome.contextMenus.update("equalizer-status-disable", {"enabled": domains.indexOf(hostname) !== -1});
          }
        });
      });
    };
    /*  */
    config.contextmenu.create.parent();
    config.contextmenu.create.enable();
    config.contextmenu.create.disable();
    /*  */
    chrome.tabs.onUpdated.addListener(toggle);
    chrome.tabs.onActivated.addListener(toggle);
  }
};
