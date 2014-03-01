(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("example", function(exports, require, module) {
"The Rivets adaptor for Backbone models. \nSee docs on adaptors here: http://www.rivetsjs.com/docs/#adapters\nThis is a very simple Backbone adaptor. \nFor more advanced binding check out: \nhttps://github.com/azproduction/rivets-backbone-adapter";
var BoundView, ContactFormView, ContactModel, ContactView, ModelJSONView, sampleData, _ref, _ref1, _ref2, _ref3, _ref4,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

rivets.adapters[':'] = {
  subscribe: function(obj, keypath, callback) {
    return obj.on("change:" + keypath, callback);
  },
  unsubscribe: function(obj, keypath, callback) {
    return obj.off("change:" + keypath, callback);
  },
  read: function(obj, keypath) {
    return obj.get(keypath);
  },
  publish: function(obj, keypath, value) {
    return obj.set(keypath, value);
  }
};

"The Backbone Model and Views for our example.\nNormally these would be split into their own files but\nfor examples sake we're combinding everything here.";

ContactModel = (function(_super) {
  __extends(ContactModel, _super);

  function ContactModel() {
    _ref = ContactModel.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ContactModel.prototype.defaults = function() {
    return {
      first_name: "",
      last_name: "",
      short_bio: "",
      github: "",
      twitter: "",
      website: ""
    };
  };

  ContactModel.prototype.getGravatar = function() {
    if (!this.get("email")) {
      return "";
    }
    return "http://www.gravatar.com/avatar/" + (hex_md5(this.get('email')));
  };

  ContactModel.prototype.getFullName = function() {
    return "" + (this.get('first_name')) + " " + (this.get('last_name'));
  };

  return ContactModel;

})(Backbone.Model);

sampleData = require('sample-data');

BoundView = (function(_super) {
  __extends(BoundView, _super);

  function BoundView() {
    _ref1 = BoundView.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  BoundView.prototype.render = function() {
    BoundView.__super__.render.call(this);
    this.bindingView = rivets.bind(this.el, {
      model: this.model,
      view: this
    });
    return this;
  };

  BoundView.prototype.remove = function() {
    this.bindingView.unbind();
    return BoundView.__super__.remove.call(this);
  };

  return BoundView;

})(Backbone.View);

ContactFormView = (function(_super) {
  __extends(ContactFormView, _super);

  function ContactFormView() {
    _ref2 = ContactFormView.__super__.constructor.apply(this, arguments);
    return _ref2;
  }

  ContactFormView.prototype.el = "#contact-form-view";

  return ContactFormView;

})(BoundView);

ContactView = (function(_super) {
  __extends(ContactView, _super);

  function ContactView() {
    _ref3 = ContactView.__super__.constructor.apply(this, arguments);
    return _ref3;
  }

  ContactView.prototype.el = "#contact-view";

  return ContactView;

})(BoundView);

ModelJSONView = (function(_super) {
  __extends(ModelJSONView, _super);

  function ModelJSONView() {
    _ref4 = ModelJSONView.__super__.constructor.apply(this, arguments);
    return _ref4;
  }

  ModelJSONView.prototype.el = "#model-json-view";

  ModelJSONView.prototype.sampleData = require("sample-data");

  ModelJSONView.prototype.events = {
    "click a": function(e) {
      var sample;
      sampleData = sample = $(e.currentTarget).data().sample;
      this.watched.clear({
        silent: true
      });
      return this.watched.set(this.sampleData[sample]);
    }
  };

  ModelJSONView.prototype.initialize = function(options) {
    if (this.model == null) {
      this.model = new Backbone.Model();
    }
    this.watched = options.watch;
    this._setWatchedModelJSON();
    return this.listenTo(this.watched, "change", this._setWatchedModelJSON);
  };

  ModelJSONView.prototype._setWatchedModelJSON = function() {
    var json;
    json = JSON.stringify(this.watched.toJSON(), null, '  ');
    return this.model.set("modelJSON", json);
  };

  return ModelJSONView;

})(BoundView);

"Custom Rivets formatter to replace text line breaks with <br>s\nSee formatter docs here: http://www.rivetsjs.com/docs/#formatters";

rivets.formatters.linebreaksbr = function(value) {
  return value.replace(/\n/g, '<br>');
};

"Custom Rivets binder to update value bindings \"live\" (onkeyup)\nBindings documentation here: http://www.rivetsjs.com/docs/#binders";

rivets.binders['live-value'] = {
  publishes: true,
  bind: function(el) {
    return $(el).on('keyup', this.publish);
  },
  unbind: function(el) {
    return $(el).off('keyup', this.publish);
  },
  routine: function(el, value) {
    return rivets.binders.value.routine(el, value);
  }
};

$(function() {
  var contactModel;
  contactModel = new ContactModel();
  contactModel.set(sampleData.michael);
  new ContactFormView({
    model: contactModel
  }).render();
  new ContactView({
    model: contactModel
  }).render();
  return new ModelJSONView({
    watch: contactModel
  }).render();
});

});

;require.register("sample-data", function(exports, require, module) {
module.exports = {
  michael: {
    first_name: "Michael",
    last_name: "Richards",
    short_bio: "Ruby/JavaScript developer. Author of Rivets.js.",
    email: "mike22e@gmail.com",
    twitter: "https://twitter.com/mikeric",
    github: "http://github.com/mikeric",
    website: ""
  },
  mark: {
    first_name: "Mark",
    last_name: "Johnson",
    short_bio: "Web designer, developer and teacher. Co-founder of Pathwright",
    email: "wmdmark@gmail.com",
    twitter: "http://twitter.com/wmdmark",
    github: "http://github.com/wmdmark",
    website: "http://pathwright.com"
  },
  mason: {
    first_name: "Mason",
    last_name: "Stewart",
    short_bio: "Frontender, JavaScripter, & Lisper",
    email: "mason@theironyard.com",
    twitter: "http://twitter.com/masondesu",
    github: "https://github.com/masondesu",
    website: ""
  }
};

});

;
//# sourceMappingURL=app.js.map