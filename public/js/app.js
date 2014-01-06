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
"The Rivets adaptor for Backbone models. \nSee docs on adaptors here: http://www.rivetsjs.com/docs/#adapters";
var ContactFormView, ContactModel, ContactView, _ref, _ref1, _ref2,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
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

"Custom Rivets formatter to replace text line breaks with <br>s\nSee formatter docs here: http://www.rivetsjs.com/docs/#formatters";

rivets.formatters.linebreaksbr = function(value) {
  return value.replace(/\n/g, '<br>');
};

"The Backbone Model and Views for our example.\nNormally these would be split into their own files but\nfor examples sake we're combinding everything here.";

ContactModel = (function(_super) {
  __extends(ContactModel, _super);

  function ContactModel() {
    this.hasLinks = __bind(this.hasLinks, this);
    _ref = ContactModel.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ContactModel.prototype.url = "contacts/";

  ContactModel.prototype.defaults = function() {
    return {
      first_name: "",
      last_name: "",
      short_bio: "",
      links: {
        github: "",
        twitter: "",
        website: ""
      }
    };
  };

  ContactModel.prototype.getGravatar = function() {
    var baseURL, imgPath;
    if (!this.get("email")) {
      return "";
    }
    baseURL = "http://www.gravatar.com/avatar/";
    imgPath = hex_md5(this.get('email'));
    return "" + baseURL + "/" + imgPath;
  };

  ContactModel.prototype.getFullName = function() {
    return "" + (this.get('first_name')) + " " + (this.get('last_name'));
  };

  ContactModel.prototype.hasLinks = function() {
    var vs;
    vs = _.uniq(_.values(this.get("links")));
    return !(vs.length === 1 && vs[0] === "");
  };

  return ContactModel;

})(Backbone.Model);

ContactFormView = (function(_super) {
  __extends(ContactFormView, _super);

  function ContactFormView() {
    this.loadSample = __bind(this.loadSample, this);
    _ref1 = ContactFormView.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  ContactFormView.prototype.el = "#contact-form-view";

  ContactFormView.prototype.events = {
    "keyup textarea": function(e) {
      return $(e.currentTarget).trigger("change");
    }
  };

  ContactFormView.prototype.render = function() {
    return this.bindingView = rivets.bind(this.el, {
      contact: this.model,
      view: this
    });
  };

  ContactFormView.prototype.remove = function() {
    this.bindingView.unbind();
    return ContactFormView.__super__.remove.call(this);
  };

  ContactFormView.prototype.loadSample = function() {
    this.model.set({
      first_name: "Mark",
      last_name: "Johnson",
      short_bio: "Web designer, developer and teacher. Co-founder of Pathwright",
      email: "wmdmark@gmail.com",
      links: {
        twitter: "http://twitter.com/wmdmark",
        github: "http://github.com/wmdmark",
        website: "http://pathwright.com"
      }
    });
    return false;
  };

  return ContactFormView;

})(Backbone.View);

ContactView = (function(_super) {
  __extends(ContactView, _super);

  function ContactView() {
    _ref2 = ContactView.__super__.constructor.apply(this, arguments);
    return _ref2;
  }

  ContactView.prototype.el = "#contact-view";

  ContactView.prototype.render = function() {
    this.bindingView = rivets.bind(this.el, {
      contact: this.model
    });
    return this;
  };

  ContactView.prototype.remove = function() {
    this.bindingView.unbind();
    return ContactView.__super__.remove.call(this);
  };

  return ContactView;

})(Backbone.View);

$(function() {
  window.contactModel = new ContactModel();
  contactModel.on("change", function() {
    return console.log(this.attributes);
  });
  new ContactFormView({
    model: contactModel
  }).render();
  return new ContactView({
    model: contactModel
  }).render();
});

});

;
//# sourceMappingURL=app.js.map