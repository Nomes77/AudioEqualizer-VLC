config.selectedpreset = null;

config.sliderinputs = document.querySelectorAll('input[type="range"]');

config.setvalue = function (id, val) {
	document.getElementById(id).value = val;
};

config.elementvalue = function (id) {
	return document.getElementById(id).value;
};

config.setequalizer = function () {
	for (var i = 0; i < config.storage.eq.length; i++) {
		config.setvalue(("ch-eq-slider-" + i), config.storage.eq[i].gain);
	}
};

config.updateequalizer = function () {
	for (var i = 0; i < 10; i++) config.storage.eq[i + 1].gain = config.selectedpreset.gains[i];
	config.setequalizer();
	chart.prepareChart(config.storage.eq);
	config.save();
};

config.getequalizer = function (t) {
	if (t.id) {
		var id = t.id.replace("ch-eq-slider-", '');
		if (id) return parseInt(id);
	}
	/*  */
	return 0;
};

config.save = function () {
	chrome.runtime.sendMessage({
		"action": "app-set",
		"presets": config.list,
		"eq": config.storage.eq,
		"ch": config.storage.ch,
		"selected": config.getselected()
	}, config.update);
};

config.update = function () {
	var lastError = chrome.runtime.lastError;
	chrome.storage.local.get(null, function (data) {
		if (data) {
			config.storage.eq = data.eq;
			config.storage.ch = data.ch;
			config.storage.presets = data.presets;
			if (data.presets) config.list = data.presets;
			if (data.selected) config.setselected(data.selected.name);
			/*  */
			config.setequalizer();
			config.loadsettings();
			document.getElementById('channels').checked = config.storage.ch.mono;
		}
	});
};

config.loadsettings = function () {
	var appendpreset = function (elm, presets, section) {
		var option = document.createElement("option");
		/*  */
		option.textContent = elm.name;
		option.setAttribute("value", ["preset", section, option.text].join('::'));
		if (config.isselected(elm)) option.setAttribute("selected", "selected");
		presets.appendChild(option, null);
	};
	/*  */
	var userpresets = config.getusers();
	var predefinedpresets = config.getpredefined();
	var flag = config.getselected().default === true;
	var presetdelete = document.getElementById("preset-delete");
	var userpresetsselect = document.getElementById("presets-select-user");
	var predefinedpresetsselect = document.getElementById("presets-select-predefined");
	/*  */
	if (flag) presetdelete.setAttribute("disabled", "disabled");
	else presetdelete.removeAttribute("disabled");
	/*  */
	userpresetsselect.textContent = '';
	predefinedpresetsselect.textContent = '';
	for (var i = 0; i < predefinedpresets.length; i++) appendpreset(predefinedpresets[i], predefinedpresetsselect, 'default')
	for (var i = 0; i < userpresets.length; i++) if (!userpresets[i].default) appendpreset(userpresets[i], userpresetsselect, 'my');
};

config.tab = {
  "query": {
    "active": function (callback) {
      chrome.tabs.query({"active": true, "currentWindow": true}, function (tabs) {
        if (tabs && tabs.length) {
          config.tab.check.url(tabs[0], function (tab) {
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

config.init = function (e) {
	config.storage.eq = e.eq;
	config.storage.ch = e.ch;
	config.storage.state = e.state;
	config.storage.presets = e.presets;
	/*  */
	var reset = document.getElementById("reset");
	var toggle = document.getElementById("toggle");
	var reload = document.getElementById("reload");
	var refresh = document.getElementById("refresh");
	var channels = document.getElementById("channels");
	var presets = document.getElementById("presets-select");
	/*  */
	var snapsliders = function (index, diff) {
		for (var i = 1; i < 10; i++) {
			diff = diff / 2;
			if (config.storage.eq[index - i] && config.storage.eq[index - i].f) config.storage.eq[index - i].gain = parseFloat(config.storage.eq[index - i].gain, 10) + diff;
			if (config.storage.eq[index + i] && config.storage.eq[index + i].f !== undefined) config.storage.eq[index + i].gain = parseFloat(config.storage.eq[index + i].gain, 10) + diff;
		}
	};
	/*  */
	var onsliderchange = function (evt) {
		var slider = evt.target.getAttribute("eq");
		if (slider === "master") config.storage.eq[0].gain = config.elementvalue("ch-eq-slider-0");
		else {
			var index = config.getequalizer(evt.target);
			var diff = evt.target.value - config.storage.eq[index].gain;
			config.storage.eq[index].gain = evt.target.value;
			if (config.storage.ch.snap) snapsliders(index, diff);
			config.setequalizer();
			chart.prepareChart(config.storage.eq);
		}
		/*  */
		config.save();
	};
	/*  */
	for (var i = 0; i < config.sliderinputs.length; i++) {
		config.sliderinputs[i].onchange = onsliderchange;
		config.sliderinputs[i].oninput = onsliderchange;
	}
	/*  */
	channels.onchange = function (e) {
		config.storage.ch.mono = e.target.checked;
		config.save();
	};
	/*  */
	toggle.setAttribute("state", config.storage.state);
	toggle.onclick = function () {
		chrome.runtime.sendMessage({"action": "app-toggle"}, function (state) {
			config.storage.state = state;
			toggle.setAttribute("state", config.storage.state);
		});
	};
	/*  */
	reload.onclick = function () {
		config.tab.query.active(function (tab) {
			if (tab && tab.url) {
				if (tab.url.indexOf("http") === 0) {
					chrome.tabs.reload(tab.id, {"bypassCache": true}, function () {});
				}
			}
		});
	};
	/*  */
	presets.onchange = function (e) {
		config.selectedpreset = config.getselected();
		/*  */
		switch (e.target.value) {
			case "action::save":
				modal.confirm('Do you want to save "' + config.selectedpreset.name + '" preset?', function () {
					for (var i = 0; i < config.selectedpreset.gains.length; i++) config.selectedpreset.gains[i] = config.elementvalue('ch-eq-slider-' + (i + 1));
					config.setpreset(config.selectedpreset);
					config.save();
				});
			break;
			case "action::save-as":
				modal.prompt("New preset name", function (name) {
					if (name && name.length > 0) {
						var preset = JSON.parse(JSON.stringify(config.selectedpreset));
						for (var i = 0; i < preset.gains.length; i++) preset.gains[i] = config.elementvalue('ch-eq-slider-' + (i + 1));
						preset.name = name;
						config.setnewpreset(preset);
						config.setselected(name);
						config.save();
					}
				}, function () {});
			break;
			case "action::delete":
				modal.confirm('Do you want to delete "' + config.selectedpreset.name + '" preset?', function () {
					config.removebyname(config.selectedpreset.name);
					config.save();
				});
			break;
			case "action::reset":
				modal.confirm('Do you want to reset "' + config.selectedpreset.name + '" preset?', function () {
					config.reset(config.storage, config.selectedpreset.name);
					config.setselected();
					config.updateequalizer();
					config.save();
				});
			break;
			case "action::reset-all":
				modal.confirm("Do you want to reset all presets to the default state?", function () {
					config.resetall(config.storage);
					config.setselected();
					config.updateequalizer();
					config.save();
				});
			break;
			default:
				var val = (e.target.value).split("::");
				config.setselected(val[2]);
				config.selectedpreset = config.getselected();
				config.updateequalizer();
				config.loadsettings();
				config.save();
		}
	};
	/*  */
	config.setequalizer();
	config.loadsettings();
	sliders.prepareSliders();
	chart.prepareChart(config.storage.eq);
	channels.checked = config.storage.ch.mono;
};

config.load = function () {
  window.removeEventListener("load", config.load, false);
  chrome.storage.local.get(null, function (data) {
		if (data) {
			if (data.presets) config.list = data.presets;
			if (data.selected) config.setselected(data.selected.name);
			/*  */
			config.init(data);
		}
  });
};

window.addEventListener("load", config.load, false);
