var inject = function (data) {
  var core = {
    "log": false,
    "hostname": function (url) {
      if ("blob:" === url.substring(0, 5)) {
        url = url.replace("blob:", '');
        url = unescape(url);
      }
      //
      var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
      var flag = (match !== null) && (match.length > 2) && (typeof match[2] === "string") && (match[2].length > 0);
      return flag ? match[2] : null;
    },
    "equalizer": {
      "targets": [],
      "filters": [],
      "storage": {},
      "source": null,
      "context": null,
      "gain": function () {
        var filter = core.equalizer.context.createGain();
        filter.channelCountMode = "explicit";
        filter.gain.value = 1;
        return filter;
      },
      "biquad": function (e) {
        var filter = core.equalizer.context.createBiquadFilter();
        filter.type = e.type || core.equalizer.storage.FT.LOWPASS;
        filter.frequency.value = e.f || 0;
        filter.gain.value = e.gain || 0;
        filter.Q.value = 1;
        return filter;
      },
      "set": function (o) {
        if (o) {
          if (o.eq && o.ch) {
            if (core.equalizer.filters.length > 0) {
              if (core.equalizer.filters[0]) {
                core.equalizer.filters[0].channelCount = o.ch.mono ? 1 : (core.equalizer.filters[0]._defaultChannelCount ? core.equalizer.filters[0]._defaultChannelCount : 2);
                core.equalizer.filters.forEach(function (f, i) {
                  f.gain.value = o.eq[i].gain;
                });
              }
            }
          }
        }
      },
      "toggle": function (state) {
        if (state) core.equalizer.storage.state = state;
        //
        if (core.equalizer.source && core.equalizer.context) {
          if (core.equalizer.filters && core.equalizer.filters.length) {
            if (core.equalizer.storage.state === "ON") {
              core.equalizer.source.disconnect(core.equalizer.context.destination);
              core.equalizer.source.connect(core.equalizer.filters[0]);
            }
            //
            if (core.equalizer.storage.state === "OFF") {
              core.equalizer.source.disconnect(core.equalizer.filters[0]);
              core.equalizer.source.connect(core.equalizer.context.destination);
            }
          }
        }
      },
      "load": function () {
        if (core.log) console.error(" >> Searching for video/audio elements...");
        core.equalizer.filters = [];
        delete core.equalizer.context;
        //
        core.equalizer.context = new AudioContext();
        for (var i = 0; i < core.equalizer.storage.eq.length; i++) {
          var node = core.equalizer.storage.eq[i];
          var filter = node.f ? core.equalizer.biquad(node) : core.equalizer.gain();
          if (filter) {
            core.equalizer.filters.push(filter);
          }
        }
        //
        if (core.log) console.error(" >> Equalizer is loaded!");
        core.equalizer.attach(2);
      },
      "attach": function (w) {
        if (!core.equalizer.context) core.equalizer.load();
        else {
          core.equalizer.targets.forEach(function (t, k) {
            if (t.getAttribute("equalizer-state") !== "attached") {
              var src = t.src ? t.src : t.currentSrc;
              if (src) {
                t.setAttribute("equalizer-state", "attached");
                if (core.log) console.error(" >> Equalizer is attached, loc", w, t.className);
                if (document.location.hostname !== core.hostname(src)) {
                  var crossorigin = t.getAttribute("crossorigin");
                  if (!crossorigin) {
                    if (src.substring(0, 5) !== "blob:") {
                      t.setAttribute("crossorigin", (crossorigin ? crossorigin : "anonymous"));
                      if (t.src) t.src = t.src + '';
                      else if (t.currentSrc) t.load();
                    }
                  }
                }
                //
                try {
                  core.equalizer.source = core.equalizer.context.createMediaElementSource(t);
                  core.equalizer.filters[0]._defaultChannelCount = core.equalizer.source.channelCount ? core.equalizer.source.channelCount : 2;
                  var target = core.equalizer.storage.state === "OFF" ? core.equalizer.context.destination : core.equalizer.filters[0];
                  core.equalizer.source.connect(target);
                  //
                  for (var i = 0; i < core.equalizer.filters.length; i++) {
                    var current = core.equalizer.filters[i];
                    var next = core.equalizer.filters[i + 1];
                    //
                    current.gain.value = core.equalizer.storage.eq[i].gain;
                    if (next) current.connect(next);
                  }
                  //
                  var last = core.equalizer.filters[core.equalizer.filters.length - 1];
                  last.connect(core.equalizer.context.destination);
                  window.top.postMessage({"app": "audio-equalizer", "action": "app-icon-normal"}, '*');
                } catch (e) {
                  window.top.postMessage({"app": "audio-equalizer", "action": "app-icon-error"}, '*');
                }
              }
            }
          });
        }
      }
    }
  };
  //
  core.equalizer.storage = data;
  //
  window.addEventListener("play", function (e) {
    core.equalizer.targets.push(e.target);
    core.equalizer.attach(0);
  }, true);
  //
  window.addEventListener("message", function (e) {
    if (e.data.app === "audio-equalizer") {
      if (e.data.action === "app-set") core.equalizer.set(e.data.value);
      if (e.data.action === "app-toggle") core.equalizer.toggle(e.data.state);
    }
  }, false);
  //
  if (Audio) {
    if (Audio.prototype) {
      if (Audio.prototype.play) {
        const play = Audio.prototype.play;
        Audio.prototype.play = function () {
          core.equalizer.targets.push(this);
          core.equalizer.attach(1);
          //
          return play.apply(this, arguments);
        };
      }
    }
  }
};

window.addEventListener("message", function (e) {
  if (e.data.app === "audio-equalizer") {
    if (e.data.action === "app-icon-error") {
      chrome.runtime.sendMessage({"action": "app-icon-error"});
    }
    /*  */
    if (e.data.action === "app-icon-normal") {
      chrome.runtime.sendMessage({"action": "app-icon-normal"});
    }
  }
}, false);

chrome.runtime.sendMessage({"action": "page-load"}, function (url) {
  if (url) {
    chrome.storage.local.get(null, function (data) {
      var hostname = (new URL(url)).hostname;
      var valid = data.whitelist.indexOf(hostname) === -1;
      if (valid) {
        var script = document.createElement("script");
        script.textContent = "(" + inject + ")(" + JSON.stringify(data) + ")";
        document.documentElement.appendChild(script);
      }
    });
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "app-toggle") {
    window.postMessage({
      "app": "audio-equalizer",
      "action": "app-toggle",
      "state": request.state
    }, '*');
  }
  /*  */
  if (request.action === "app-set") {
    window.postMessage({
      "app": "audio-equalizer",
      "action": "app-set",
      "value": {
        "eq": request.eq,
        "ch": request.ch
      }
    }, '*');
  }
});
